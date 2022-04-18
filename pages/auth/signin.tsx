import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Field, FieldInputProps, Form, Formik, FormikProps } from 'formik';
import { NextPage, NextPageContext } from 'next';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';

interface InnerForm {
  form: FormikProps<Credentials>;
  field: FieldInputProps<string>;
}

const CredentialsSchema = Yup.object({
  username: Yup.string().required('Requerido'),
  password: Yup.string().required('Requerido'),
}).required(); // 'required' at the end so type can be inferred below

type Credentials = Yup.InferType<typeof CredentialsSchema>;

const SignIn: NextPage = () => {
  const initialValues: Credentials = { username: '', password: '' };
  const toast = useToast();
  const router = useRouter();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CredentialsSchema}
      onSubmit={async (values, actions) => {
        const response = await signIn<'credentials'>('credentials', {
          redirect: false,
          username: values.username,
          password: values.password,
        });
        if (response?.error) {
          toast({
            title: response.error,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        } else {
          toast({
            title: 'Login successful!',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
          router.push('/');
        }
      }}
    >
      {(props) => (
        <Form>
          <Field name="username">
            {({ form, field }: InnerForm) => (
              <FormControl
                isInvalid={form.touched.username && !!form.errors.username}
              >
                <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
                <Input
                  {...field}
                  id="username"
                  placeholder="Usuario"
                  autoComplete="username"
                />
                <FormErrorMessage>
                  {form.touched.username && form.errors.username}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Field name="password">
            {({ form, field }: InnerForm) => (
              <FormControl
                isInvalid={form.touched.password && !!form.errors.password}
              >
                <FormLabel htmlFor="password">Contraseña</FormLabel>
                <Input
                  {...field}
                  id="password"
                  placeholder="Contraseña"
                  type="password"
                  autoComplete="password"
                />
                <FormErrorMessage>
                  {form.touched.password && form.errors.password}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Iniciar sesión
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }
  return { props: {} };
}
export default SignIn;
