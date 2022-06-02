import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, ButtonGroup, Flex, IconButton, Text } from '@chakra-ui/react';

interface Props {
  pageSize: number;
  pageIndex: number;
  totalEntries: number;
  onClickNext: () => void;
  onClickPrev: () => void;
}

const ButtonPages = ({
  pageSize,
  pageIndex,
  totalEntries,
  onClickNext,
  onClickPrev,
}: Props) => {
  const pages = Math.ceil(totalEntries / pageSize);

  return (
    <Flex align="center" gap={5} width="100%" justify="center" my={5}>
      <IconButton
        aria-label="reduce page number"
        variant="outline"
        disabled={pageIndex === 0}
        onClick={onClickPrev}
        icon={<ChevronLeftIcon />}
      >
        Atrás
      </IconButton>
      <Text>{`${pageIndex + 1} / ${pages}`}</Text>
      <IconButton
        aria-label="increase page number"
        variant="outline"
        disabled={pageIndex === pages - 1}
        onClick={onClickNext}
        icon={<ChevronRightIcon />}
      >
        Siguiente
      </IconButton>
    </Flex>
  );
};

export default ButtonPages;
