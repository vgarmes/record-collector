import React, { useEffect, useState } from 'react';
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
import { authors } from '../data/author-mock';

interface Props {
  placeholder: string;
  isOpen: boolean;
  items: { id: string; label: string }[];
  onClose: () => void;
  onSearch: (value: string) => void;
}

const SearchModal = ({
  placeholder,
  isOpen,
  items,
  onClose,
  onSearch,
}: Props) => {
  const timeoutRef = React.useRef<number | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(() => {
      console.log(event.target?.value);
      onSearch(event.target?.value);
    }, 300);
  };

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
              onChange={handleChange}
            />
          </Flex>
          <Box maxH="66vh" overflow="auto">
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
                      key={item.id}
                      width="100%"
                      align="center"
                      minH={16}
                      mt={2}
                      px={4}
                      py={2}
                      rounded="lg"
                      sx={{
                        backgroundColor: 'gray.600',
                        ':hover': { backgroundColor: 'teal.500' },
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
