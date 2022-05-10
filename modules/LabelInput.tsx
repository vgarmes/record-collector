import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import Input from '../components/Input';
import SearchModal from '../components/SearchModal';
import { trpc } from '../utils/trpc';

const LabelInput = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchAuthor, setSearchAuthor] = useState('');
  const [author, setAuthor] = useState<{ id: number; label: string }>();
  const { data: authors } = trpc.useQuery(
    ['author.search', { searchQuery: searchAuthor }],
    { keepPreviousData: true }
  );

  return (
    <>
      <SearchModal
        placeholder="añadir autor"
        isOpen={isOpen}
        onClose={onClose}
        items={authors?.map((author) => ({
          id: author.id,
          label: author.name,
        }))}
        onSearch={setSearchAuthor}
        onClickResult={setAuthor}
      />
      <Input
        name="author"
        value={author?.label}
        label="Autor"
        sx={{ cursor: 'pointer' }}
        isReadOnly
        onClick={onOpen}
        validate={!isOpen}
      />
    </>
  );
};

export default LabelInput;
