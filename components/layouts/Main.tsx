import Head from 'next/head';
import { Box, Container } from '@chakra-ui/react';
import { Router } from 'next/router';
import Navbar from '../Navbar';

interface MainProps {
  router: Router;
}

const Main: React.FC<MainProps> = ({ children, router }) => {
  return (
    <Box as="main" pb={8}>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Victor Garcia's homepage" />
        <meta name="author" content="Victor Garcia" />
        <meta name="author" content="vgmestre" />
        <link rel="apple-touch-icon" href="apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@vgmestre" />
        <meta name="twitter:creator" content="@vgmestre" />
        <meta name="twitter:image" content="/card.png" />
        <meta property="og:site_name" content="Victor Garcia's Homepage" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/card.png" />
        <title>Victor Garcia - Portfolio</title>
      </Head>

      <Navbar path={router.asPath} />

      <Container maxW="container.lg" pt={14}>
        {children}
      </Container>
    </Box>
  );
};

export default Main;
