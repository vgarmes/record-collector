import { useState, useRef } from 'react';
import RecordsTable from '../../components/RecordsTable';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { trpc } from '../../utils/trpc';
import { Box, Button, Flex, IconButton, Spinner, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const Records: NextPage = () => {
  const pageSize = 20;
  const [pageIndex, setPageIndex] = useState(0);
  const { data } = trpc.useQuery(
    ['record.paginated', { skip: pageIndex * pageSize, take: pageSize }],
    { keepPreviousData: true }
  );

  if (!data) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <div>
      <RecordsTable data={data?.data} />
      <Flex align="center" gap={5} width="100%" justify="center" mt={5}>
        <IconButton
          aria-label="reduce page number"
          variant="outline"
          disabled={pageIndex === 1}
          onClick={() => setPageIndex((prev) => prev - 1)}
          icon={<ChevronLeftIcon />}
        >
          Atrás
        </IconButton>
        <Text>{pageIndex}</Text>
        <IconButton
          aria-label="increase page number"
          variant="outline"
          disabled={pageIndex === Math.ceil(data.total / pageSize)}
          onClick={() => setPageIndex((prev) => prev + 1)}
          icon={<ChevronRightIcon />}
        >
          Siguiente
        </IconButton>
      </Flex>
    </div>
  );
};

export default Records;
