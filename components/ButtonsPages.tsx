import { Button, ButtonGroup } from '@chakra-ui/react';

interface Props {
  pageSize: number;
  pageIndex: number;
  totalEntries: number;
}

const ButtonPages = ({ pageSize, pageIndex, totalEntries }: Props) => {
  const numberOfButtons = Math.ceil(totalEntries / pageSize);

  return (
    <ButtonGroup variant="outline" spacing="1">
      <Button key="back">back</Button>

      <Button key="next">next</Button>
    </ButtonGroup>
  );
};

export default ButtonPages;
