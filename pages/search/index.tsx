import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const { q } = router.query;
  const isValidQuery = !!q && !Array.isArray(q);
  const { data } = trpc.useQuery(['record.search', { query: q as string }], {
    enabled: isValidQuery,
  });

  if (!q || Array.isArray(q)) {
    return <>Error en la búsqueda</>;
  }

  console.log(data);
  return <>{`Buscar: ${decodeURIComponent(q)}`}</>;
};

export default SearchPage;
