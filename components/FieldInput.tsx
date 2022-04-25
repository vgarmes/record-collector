import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { FieldInputProps, FormikProps } from 'formik';
import { HTMLInputTypeAttribute } from 'react';

interface Props<T> {
  name: string & keyof T;
  form: FormikProps<T>;
  field: FieldInputProps<string>;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}

const FieldInput = <T extends unknown>({
  name,
  form,
  field,
  placeholder,
  type,
}: Props<T>) => {
  return (
    <FormControl isInvalid={form.touched[name] && !!form.errors[name]}>
      <FormLabel htmlFor={name}>Contraseña actual:</FormLabel>
      <Input
        {...field}
        id={name}
        placeholder={placeholder}
        type={type}
        autoComplete={name}
      />
      <FormErrorMessage>
        {form.touched[name] && form.errors[name]}
      </FormErrorMessage>
    </FormControl>
  );
};

export default FieldInput;
