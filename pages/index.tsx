import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(['record.all']);

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <div>
      <ul>
        {data.map((record) => (
          <li key={record.id}>{record.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
