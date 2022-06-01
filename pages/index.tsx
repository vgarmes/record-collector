import { useState, useRef } from 'react';
import RecordsTable from '../components/RecordsTable';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { trpc } from '../utils/trpc';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Search2Icon,
} from '@chakra-ui/icons';
import SearchBar from '../components/inputs/SearchInput';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <Flex height="50vh" width="100%" justify="center">
      <Flex
        as="form"
        align="center"
        gap={5}
        width={{ base: '100%', sm: '540px' }}
        justify="center"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }}
      >
        <SearchBar
          height={10}
          border="1px solid"
          borderColor="gray.400"
          borderRadius="md"
          px={3}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
        />
        <Button
          type="submit"
          aria-label="submit button"
          tabIndex={0}
          px={4}
          disabled={searchQuery === ''}
        >
          Buscar
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
