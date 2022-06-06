import React, { Ref, RefObject } from 'react';
import { inferQueryOutput } from '../utils/trpc';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { css } from '@emotion/react';

interface Props {
  data: inferQueryOutput<'record.paginated'>['data'];
}

const RecordsTable = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { data } = props;
  return (
    <TableContainer ref={ref}>
      <Table variant="simple" sx={{ tableLayout: 'fixed' }}>
        <Thead>
          <Tr>
            <Th style={{ width: '30%' }}>Autor</Th>
            <Th>Album</Th>
            <Th style={{ width: '15%' }}>Año</Th>
            <Th
              style={{ width: '20%' }}
              display={{ base: 'none', md: 'table-cell' }}
            >
              Discográfica
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((entry) => (
            <Tr key={entry.id}>
              <Td
                style={{ width: '30%' }}
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {entry.author.name}
              </Td>
              <Td overflow="hidden" textOverflow="ellipsis">
                {entry.title}
              </Td>
              <Td style={{ width: '15%' }} width="10px">
                {entry.year}
              </Td>
              <Td
                style={{ width: '20%' }}
                display={{ base: 'none', md: 'table-cell' }}
              >
                {entry.label.name}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
});

RecordsTable.displayName = 'RecordsTable';

export default RecordsTable;
