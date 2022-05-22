import { Spinner, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import RecordsTable from '../../components/RecordsTable';
import { trpc } from '../../utils/trpc';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const isValidQuery = !!q && !Array.isArray(q);
  const { data, isLoading } = trpc.useQuery(
    ['record.search', { query: q as string }],
    {
      enabled: isValidQuery,
    }
  );

  if (!q || Array.isArray(q)) {
    return <>Error en la búsqueda</>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return <Text>{`Sin resultados para: "${decodeURIComponent(q)}"`}</Text>;
  }

  return (
    <>
      <Text>{`Resultados de: "${decodeURIComponent(q)}"`}</Text>
      <RecordsTable data={data} />
    </>
  );
};

export default SearchPage;
