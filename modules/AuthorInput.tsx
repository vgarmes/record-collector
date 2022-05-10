import { useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import Input from '../components/Input';
import SearchModal from '../components/SearchModal';
import { trpc } from '../utils/trpc';

interface Props {
  setAuthorId: (authorId: number) => void;
}

const AuthorInput = ({ setAuthorId }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchAuthor, setSearchAuthor] = useState('');
  const [authorName, setAuthorName] = useState('');
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
        onClickResult={(author) => {
          setAuthorName(author.label);
          setAuthorId(author.id);
        }}
      />
      <Input
        name="author"
        value={authorName}
        label="Autor"
        sx={{ cursor: 'pointer' }}
        isReadOnly
        onClick={onOpen}
        validate={!isOpen}
      />
    </>
  );
};

export default AuthorInput;
