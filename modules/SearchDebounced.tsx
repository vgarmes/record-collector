import { FlexProps } from '@chakra-ui/react';
import { useState } from 'react';
import SearchBar from '../components/inputs/SearchInput';
import { useDebounce } from '../hooks/useDebounce';

interface Props extends FlexProps {
  onSearch: (value: string) => void;
}

const SearchDebounced = ({ onSearch, ...props }: Props) => {
  const [value, setValue] = useState('');
  useDebounce(value, 500, onSearch);

  return (
    <SearchBar
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      {...props}
    />
  );
};

export default SearchDebounced;
