import { Search2Icon } from '@chakra-ui/icons';
import { Flex, FlexProps, Input } from '@chakra-ui/react';
import { ChangeEvent } from 'react';

interface Props extends FlexProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const SearchBar = ({ value, onChange, ...props }: Props) => {
  return (
    <Flex align="center" gap={5} {...props}>
      <Search2Icon />
      <Input
        variant="unstyled"
        size="lg"
        placeholder="Buscar"
        value={value}
        onChange={onChange}
      />
    </Flex>
  );
};

export default SearchBar;
