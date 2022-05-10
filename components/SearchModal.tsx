import React, { FormEvent, useEffect, useState } from 'react';
import { Search2Icon } from '@chakra-ui/icons';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Input,
  Flex,
  Text,
  Box,
} from '@chakra-ui/react';
import { useDebounce } from '../hooks/useDebounce';

export interface Item<T> {
  id: T;
  label: string;
}

interface Props<T> {
  placeholder: string;
  isOpen: boolean;
  items: Item<T>[] | undefined;
  onClose: () => void;
  onSearch: (value: string) => void;
  onClickResult: (item: Item<T>) => void;
}

const SearchModal = <T extends string | number>({
  placeholder,
  isOpen,
  items,
  onClose,
  onSearch,
  onClickResult,
}: Props<T>) => {
  const [value, setValue] = useState('');
  useDebounce(value, 300, onSearch);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody px={0} py={0}>
          <Flex align="center" gap={5} height="68px" px={6}>
            <Search2Icon />
            <Input
              variant="unstyled"
              size="lg"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.currentTarget.value)}
            />
          </Flex>
          <Box
            maxH="66vh"
            overflow="auto"
            sx={{ ':webkit-scrollbar-thumb': { background: 'red' } }}
          >
            {items && (
              <Box px={4}>
                <Box
                  as="ul"
                  pt={2}
                  pb={4}
                  borderTopWidth="1px"
                  borderColor="gray.200"
                >
                  {items.map((item) => (
                    <Flex
                      as="li"
                      key={`${item.id}`}
                      width="100%"
                      align="center"
                      minH={16}
                      mt={2}
                      px={4}
                      py={2}
                      rounded="lg"
                      sx={{
                        backgroundColor: 'gray.600',
                        cursor: 'pointer',
                        ':hover': { backgroundColor: 'teal.500' },
                      }}
                      onClick={() => {
                        onClickResult(item);
                        onClose();
                      }}
                    >
                      <Text fontWeight="semibold">{item.label}</Text>
                    </Flex>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
