import { Record } from '@prisma/client';
import { Field, FieldInputProps, Form, Formik, FormikProps } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import * as Yup from 'yup';
import FieldInput from '../../components/FieldInput';
import { Button, Flex, Input as ChakraInput } from '@chakra-ui/react';
import Input from '../../components/Input';

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

  if (status === 'loading') {
    return 'Loading or not authenticated...';
  }

  const initialValues = {
    title: '',
    format: '',
    authorId: 0,
    author: '',
    year: 0,
    version: '',
    ownerId: 0,
    owner: '',
    labelId: 0,
    label: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={async (values, actions) => {
        console.log(values);
        /*  mutate({
          title: values.title,
          format: values.format,
          authorId: values.authorId,
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
          <Input name="authorId" type="number" hidden />
          <Input name="year" placeholder="Año" label="Año" type="number" />
          <Input name="ownerId" type="number" hidden />
          <Input name="owner" placeholder="Procedencia" label="Procedencia" />
          <Input name="labelId" type="number" hidden />
          <Input name="label" placeholder="Discográfica" label="Discografica" />
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
  );
};

export default NewRecord;
