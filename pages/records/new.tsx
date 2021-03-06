import { Record } from '@prisma/client';
import { Field, FieldInputProps, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import * as Yup from 'yup';
import FieldInput from '../../components/inputs/FieldInput';
import {
  Box,
  Button,
  Flex,
  Input as ChakraInput,
  useDisclosure,
} from '@chakra-ui/react';
import Input from '../../components/Input';
import SearchModal, { Item } from '../../components/SearchModal';
import { useState } from 'react';
import AuthorInput from '../../modules/AuthorInput';

const Schema = Yup.object({
  title: Yup.string().min(1).max(100).required('Requerido'),
  format: Yup.string().min(1).max(10).required('Requerido'),
  author: Yup.string().required('Requerido'),
  year: Yup.number().nullable().defined(),
  version: Yup.string().nullable().defined(),
  owner: Yup.string().required('Requerido'),
  label: Yup.string().required('Requerido'),
}).required();

type NewRecord = Yup.InferType<typeof Schema>;

const NewRecord = () => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/');
    },
  });
  const { mutate, data } = trpc.useMutation('record.create', {
    onSuccess: () => console.log('success!'),
  });
  const [relationFields, setRelationFields] = useState({
    authorId: 0,
    labelId: 0,
    ownerId: 0,
  });

  if (status === 'loading') {
    return 'Loading or not authenticated...';
  }

  const initialValues = {
    title: '',
    format: '',
    author: '',
    year: 0,
    version: '',
    ownerId: 0,
    owner: '',
    labelId: 0,
    label: '',
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validateOnMount={true}
        validationSchema={Schema}
        onSubmit={async (values, actions) => {
          console.log({
            title: values.title,
            format: values.format,
            authorId: relationFields.authorId,
            year: values.year || null,
            version: values.version,
            ownerId: values.ownerId,
            labelId: values.labelId,
          });
          /*  mutate({
          title: values.title,
          format: values.format,
          authorId: author.id,
          year: values.year || null,
          version: values.version,
          ownerId: values.ownerId,
          labelId: values.labelId,
        }); */
        }}
      >
        {(props) => (
          <Form>
            <Input name="title" placeholder="T??tulo" label="T??tulo" />
            <Input name="format" placeholder="Formato" label="Formato" />
            <AuthorInput
              setAuthorId={(authorId) =>
                setRelationFields({ ...relationFields, authorId })
              }
            />
            <Input name="year" placeholder="A??o" label="A??o" type="number" />
            <Input name="ownerId" type="number" hidden />
            <Input name="owner" placeholder="Procedencia" label="Procedencia" />
            <Input name="labelId" type="number" hidden />
            <Input
              name="label"
              placeholder="Discogr??fica"
              label="Discografica"
            />
            <Input name="version" placeholder="Versi??n" label="Versi??n" />
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
              disabled={!props.isValid}
            >
              Crear
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default NewRecord;
