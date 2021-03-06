import { useState, useRef, useEffect } from 'react';
import NextLink from 'next/link';
import RecordsTable from '../../components/RecordsTable';
import type { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import { Button, Flex, Spinner, Link, Box, Heading } from '@chakra-ui/react';
import ButtonPages from '../../components/ButtonsPages';
import { useSession } from 'next-auth/react';
import SearchDebounced from '../../modules/SearchDebounced';
import SearchBar from '../../components/inputs/SearchInput';
import { useRouter } from 'next/router';
import Search from '../../modules/Search';
import { Record } from '@prisma/client';
import GroupedRecordsTable from '../../components/GroupedRecordsTable';

const Records: NextPage = () => {
  const pageSize = 20;
  const [pageIndex, setPageIndex] = useState(0);
  const { data: session } = useSession();
  const tableRef = useRef<HTMLDivElement>(null);
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
      {session && (
        <Box pt={5}>
          <NextLink href="/records/new" passHref>
            <Button as={Link} colorScheme="teal">
              Añadir
            </Button>
          </NextLink>
        </Box>
      )}
      <Search route="/records" />
      <GroupedRecordsTable data={data.data} />
      {/*  <RecordsTable ref={tableRef} data={data?.data} /> */}
      <ButtonPages
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalEntries={data.total}
        onClickNext={() => setPageIndex((prev) => prev + 1)}
        onClickPrev={() => setPageIndex((prev) => prev - 1)}
      />
    </div>
  );
};

export default Records;
