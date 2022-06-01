import FormField from '../../components/inputs/FieldInput';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Field, FieldInputProps, Form, Formik, FormikProps } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { trpc } from '../../utils/trpc';

interface InnerForm {
  form: FormikProps<Passwords>;
  field: FieldInputProps<string>;
}

const Schema = Yup.object({
  password: Yup.string().required('Requerido'),
  newPassword: Yup.string().required('Requerido'),
  newPasswordRepeat: Yup.string()
    .required('Requerido')
    .test('equal', 'Las contraseñas no coinciden', function (v) {
      const ref = Yup.ref('newPassword');
      return v === this.resolve(ref);
    }),
}).required(); // 'required' at the end so type can be inferred below

type Passwords = Yup.InferType<typeof Schema>;

const ChangePassword: NextPage = () => {
  const { mutate, data } = trpc.useMutation('user.change-password', {
    onSuccess: () => console.log('success!'),
  });

  const initialValues: Passwords = {
    password: '',
    newPassword: '',
    newPasswordRepeat: '',
  };
  const toast = useToast();
  const router = useRouter();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={async (values, actions) => {
        mutate({ password: values.password, newPassword: values.newPassword });
      }}
    >
      {(props) => (
        <Form>
          <Field name="password">
            {({ form, field }: InnerForm) => (
              <FormField
                name="password"
                type="password"
                placeholder="Contraseña actual"
                form={form}
                field={field}
              />
            )}
          </Field>
          <Field name="newPassword">
            {({ form, field }: InnerForm) => (
              <FormField
                name="newPassword"
                type="password"
                placeholder="Contraseña nueva"
                form={form}
                field={field}
              />
            )}
          </Field>
          <Field name="newPasswordRepeat">
            {({ form, field }: InnerForm) => (
              <FormField
                name="newPasswordRepeat"
                type="password"
                placeholder="Contraseña nueva"
                form={form}
                field={field}
              />
            )}
          </Field>
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
          >
            Cambiar
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ChangePassword;
