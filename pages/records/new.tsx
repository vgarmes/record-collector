import { Record } from '@prisma/client';
import { Field, FieldInputProps, Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import * as Yup from 'yup';
import FieldInput from '../../components/FieldInput';
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
  const { mutate, data } = trpc.useMutation('recordAdmin.create', {
    onSuccess: () => console.log('success!'),
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchAuthor, setSearchAuthor] = useState('');
  const [author, setAuthor] = useState<{ id: number; label: string }>();
  const { data: authors, ...response } = trpc.useQuery(
    ['author.search', { searchQuery: searchAuthor }],
    { keepPreviousData: true }
  );

  /*   const [search]
  const [label,setLabel] = useState<Item<number>>() */

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
      <SearchModal
        placeholder="añadir autor"
        isOpen={isOpen}
        onClose={onClose}
        items={authors?.map((author) => ({
          id: author.id,
          label: author.name,
        }))}
        onSearch={setSearchAuthor}
        onClickResult={setAuthor}
      />
      <Formik
        initialValues={initialValues}
        validateOnMount={true}
        validationSchema={Schema}
        onSubmit={async (values, actions) => {
          console.log({
            title: values.title,
            format: values.format,
            authorId: author?.id,
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
            <Input name="title" placeholder="Título" label="Título" />
            <Input name="format" placeholder="Formato" label="Formato" />
            <input name="authorId" value={author?.id} type="number" hidden />
            <Input
              name="author"
              value={author?.label}
              label="Autor"
              sx={{ cursor: 'pointer' }}
              isReadOnly
              onClick={onOpen}
            />
            <Input name="year" placeholder="Año" label="Año" type="number" />
            <Input name="ownerId" type="number" hidden />
            <Input name="owner" placeholder="Procedencia" label="Procedencia" />
            <Input name="labelId" type="number" hidden />
            <Input
              name="label"
              placeholder="Discográfica"
              label="Discografica"
            />
            <Input name="version" placeholder="Versión" label="Versión" />
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
