import RecordsTable from '../components/RecordsTable';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery([
    'record.paginated',
    { skip: 0, take: 20 },
  ]);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div>
      <RecordsTable data={data} />
    </div>
  );
};

export default Home;
