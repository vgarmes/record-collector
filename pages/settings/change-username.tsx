import { Form, Formik } from 'formik';
import { trpc } from '../../utils/trpc';
import * as Yup from 'yup';
import Input from '../../components/Input';
import { Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Schema = Yup.object({
  newUsername: Yup.string().min(0).max(32),
});

const ChangeUsername = () => {
  const toast = useToast();
  const router = useRouter();

  const { mutate } = trpc.useMutation('user.change-username', {
    onError: () => {
      toast({
        title: 'Error',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    },
    onSuccess: () => {
      toast({
        title: 'Usuario cambiado',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      router.push('/');
    },
  });

  const initialValues = {
    newUsername: '',
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Schema}
      onSubmit={async (values, actions) => {
        mutate({ newUsername: values.newUsername });

        /* if (response?.error) {
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
        } */
      }}
    >
      {(props) => (
        <Form>
          <Input
            name="newUsername"
            placeholder="Nombre"
            label="Nuevo nombre de usuario"
          />
          <Button
            mt={4}
            colorScheme="teal"
            isLoading={props.isSubmitting}
            type="submit"
            disabled={!props.isValid}
          >
            Cambiar
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ChangeUsername;
