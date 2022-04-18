import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { Field, FieldInputProps, Form, Formik, FormikProps } from 'formik';
import { InferGetServerSidePropsType, NextPage, NextPageContext } from 'next';
import { getCsrfToken, signIn } from 'next-auth/react';
import * as Yup from 'yup';

interface InnerForm {
  form: FormikProps<Credentials>;
  field: FieldInputProps<string>;
}

const CredentialsSchema = Yup.object({
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
}).required(); // 'required' at the end so type can be inferred below

type Credentials = Yup.InferType<typeof CredentialsSchema>;

const SignIn: NextPage = () => {
  const initialValues: Credentials = { username: '', password: '' };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CredentialsSchema}
      onSubmit={(values, actions) => {
        signIn('credentials', values);
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
                <Input {...field} id="username" placeholder="Usuario" />
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
                <Input {...field} id="password" placeholder="Usuario" />
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

/* export async function getServerSideProps(context: NextPageContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
} */
export default SignIn;
