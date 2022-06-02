import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { trpc } from '../../utils/trpc';

const Authors: NextPage = () => {
  const pageSize = 20;
  const [pageIndex, setPageIndex] = useState(0);
  const { data: session } = useSession();
  const { data } = trpc.useQuery(
    ['author.paginated', { skip: pageIndex * pageSize, take: pageSize }],
    { keepPreviousData: true }
  );

  if (!data) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }
  console.log(data);
  return (
    <div>
      <ul>
        {data?.map((author) => (
          <li key={author.id}>
            <Flex>
              <Text pr={2}>{author.name}</Text>
              <Text>{author._count.records}</Text>
            </Flex>
          </li>
        ))}
      </ul>
      <Flex>
        <Button
          disabled={pageIndex === 0}
          onClick={() => setPageIndex((prev) => prev - 1)}
        >
          Anterior
        </Button>
        <Button onClick={() => setPageIndex((prev) => prev + 1)}>
          Siguiente
        </Button>
      </Flex>
    </div>
  );
};

export default Authors;
