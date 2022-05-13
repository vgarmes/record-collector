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

const RecordsTable = ({ data }: Props) => {
  return (
    <TableContainer>
      <Table
        variant="simple"
        sx={{ tableLayout: 'fixed' }}
        css={css`
          th {
            padding-left: 4px;
            padding-right: 4px;
          }
          td {
            padding-left: 4px;
            padding-right: 4px;
          }
        `}
      >
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
};

export default RecordsTable;
