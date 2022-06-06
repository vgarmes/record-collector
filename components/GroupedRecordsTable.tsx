import React from 'react';
import { inferQueryOutput } from '../utils/trpc';
import {
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Heading,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { groupBy } from '../utils';

interface Props {
  data: inferQueryOutput<'record.paginated'>['data'];
}

const RecordsTable = ({ data }: Props) => {
  const groupedRecords = groupBy(data, 'authorId');
  return (
    <>
      {groupedRecords.map((group) => (
        <TableContainer key={group.id} pb={6}>
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
                overflow: hidden;
                text-overflow: ellipsis;
              }
            `}
          >
            <Heading>{group.data[0].author.name}</Heading>
            <Tbody>
              {group.data.map((record) => (
                <Tr key={record.id}>
                  <Td colSpan={5}>{record.title}</Td>
                  <Td textAlign="right">{record.year}</Td>
                  <Td
                    textAlign="right"
                    display={{ base: 'none', md: 'table-cell' }}
                  >
                    {record.label.name}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ))}
    </>
  );
};

export default RecordsTable;
