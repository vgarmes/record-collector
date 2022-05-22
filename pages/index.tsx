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
import SearchBar from '../components/SearchBar';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <Flex height="50vh" width="100%" justify="center">
      <Flex align="center" gap={5} width="100%" justify="center">
        <SearchBar
          height={10}
          width={{ base: '100%', sm: '540px' }}
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
          disabled={searchQuery === ''}
          onClick={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
          }}
        >
          Buscar
        </Button>
      </Flex>
    </Flex>
  );
};

export default Home;
