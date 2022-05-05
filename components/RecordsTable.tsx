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

interface Props {
  data: inferQueryOutput<'record.paginated'>['data'];
}

const RecordsTable = ({ data }: Props) => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Autor</Th>
            <Th>Album</Th>
            <Th isNumeric>Año</Th>
            <Th>Discográfica</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((entry) => (
            <Tr key={entry.id}>
              <Td>{entry.author.name}</Td>
              <Td>{entry.title}</Td>
              <Td isNumeric>{entry.year}</Td>
              <Td>{entry.label.name}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default RecordsTable;
