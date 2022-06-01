import { Button, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SearchInput from '../components/inputs/SearchInput';

interface Props {
  route: string;
}

const Search = ({ route }: Props) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <Flex
      as="form"
      align="center"
      gap={5}
      width="100%"
      justify="center"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`${route}/search?q=${encodeURIComponent(searchQuery)}`);
      }}
    >
      <SearchInput
        height={10}
        border="1px solid"
        borderColor="gray.400"
        borderRadius="md"
        px={3}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.currentTarget.value)}
      />
      <Button
        type="submit"
        aria-label="submit button"
        tabIndex={0}
        px={4}
        disabled={searchQuery === ''}
      >
        Buscar
      </Button>
    </Flex>
  );
};

export default Search;
