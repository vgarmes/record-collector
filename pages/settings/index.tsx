import { Box, Button, Flex, Stack, Link } from '@chakra-ui/react';
import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';
import NextLink from 'next/link';

const Settings: NextPage = () => {
  return (
    <Box>
      Settings page
      <Stack direction="column" spacing={4} align="center">
        <NextLink href="/settings/change-password" passHref>
          <Button as={Link} colorScheme="teal" variant="solid">
            Cambiar contraseña
          </Button>
        </NextLink>
        <Button colorScheme="teal" variant="solid">
          Cambiar nombre de usuario
        </Button>
      </Stack>
    </Box>
  );
};

export default Settings;
