import { useField } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';

interface Props extends ChakraInputProps {
  name: string;
  label?: string;
  disabled?: boolean;
  validate?: boolean;
}
const Input = ({ name, label, disabled, validate = true, ...props }: Props) => {
  const [field, meta, helpers] = useField(name);
  return (
    <FormControl
      isInvalid={validate && meta.touched && !!meta.error}
      isDisabled={disabled}
    >
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <ChakraInput {...props} {...field} />
      <FormErrorMessage>
        {validate && meta.touched && meta.error}
      </FormErrorMessage>
    </FormControl>
  );
};

export default Input;
