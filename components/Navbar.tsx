//import Logo from './logo';
import NextLink from 'next/link';
import {
  Container,
  Box,
  Link,
  Stack,
  Heading,
  Flex,
  Menu,
  MenuItem,
  MenuList,
  MenuButton,
  IconButton,
  useColorModeValue,
  ChakraProps,
  Button,
  Avatar,
  Text,
  MenuDivider,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  LockIcon,
  SettingsIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { useSession, signOut } from 'next-auth/react';
import ColorModeButton from './ColorModeButton';
import LinkItem from './LinkItem';

export const routes = [
  { id: 'records', label: 'Discos', href: '/records' },
  { id: 'authors', label: 'Autores', href: '/authors' },
];

interface NavbarProps {
  path: string;
  sx?: ChakraProps['sx'];
}

const Navbar: React.FC<NavbarProps> = ({ path, sx }) => {
  const { data: session, status } = useSession();
  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      style={{ backdropFilter: 'blur(10px)' }}
      zIndex={1}
      sx={{ ...sx }}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.lg"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Flex align="center" mr={5}>
          <NextLink href="/" passHref>
            <Link fontSize="3xl" fontWeight="bold" letterSpacing={'tighter'}>
              Record DB
            </Link>
          </NextLink>
        </Flex>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          display={{ base: 'none', sm: 'flex' }}
          width={{ base: 'full', sm: 'auto' }}
          align="center"
          flexGrow={1}
          mt={{ base: 4, sm: 0 }}
        >
          {routes.map(({ id, label, href }) => (
            <LinkItem key={id} href={href} path={path}>
              {label}
            </LinkItem>
          ))}
        </Stack>

        <Flex gap={4} align="center">
          {session?.user && status === 'authenticated' ? (
            <Menu>
              <MenuButton>
                <Avatar name={session.user.name!} size="sm" src={''} />
              </MenuButton>
              <MenuList>
                <NextLink href="/settings" passHref>
                  <MenuItem as={Link} icon={<SettingsIcon />}>
                    Ajustes
                  </MenuItem>
                </NextLink>
                <MenuDivider />
                <MenuItem icon={<LockIcon />} onClick={() => signOut()}>
                  Cerrar sesión
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <NextLink href="/auth/signin" passHref>
              <Link>Iniciar sesión</Link>
            </NextLink>
          )}

          <ColorModeButton />
          <Box display={{ base: 'block', sm: 'none' }}>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                {routes.map(({ id, label, href }) => (
                  <NextLink key={id} href={href} passHref>
                    <MenuItem as={Link}>{label}</MenuItem>
                  </NextLink>
                ))}
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
