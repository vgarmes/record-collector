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
//import ColorModeButton from './color-mode-button';
import { useSession, signOut } from 'next-auth/react';

interface LinkItemProps {
  href: string;
  path: string;
}

const LinkItem: React.FC<LinkItemProps> = ({ href, path, children }) => {
  const active = path === href;
  //const inactiveColor = useColorModeValue('gray200', 'whiteAlpha.900')
  return (
    <NextLink href={href} passHref>
      <Link
        p={2}
        borderBottom="3px solid"
        borderColor={active ? 'teal.100' : 'transparent'}
        sx={{ ':hover': { textDecoration: 'none', color: 'teal.100' } }}
      >
        {children}
      </Link>
    </NextLink>
  );
};

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
      bg="var(--color-background)"
      style={{ backdropFilter: 'blur(10px)' }}
      zIndex={1}
      sx={{ ...sx }}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        <Flex align="center" mr={5}>
          <NextLink href="/" passHref>
            <Link fontSize="3xl" fontWeight="bold" letterSpacing={'tighter'}>
              Logo
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
          <LinkItem href="/records" path={path}>
            Discos
          </LinkItem>
          <LinkItem href="/artists" path={path}>
            Artistas
          </LinkItem>
        </Stack>

        <Box>
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
          {/*  <ColorModeButton /> */}
          <Box ml={4} display={{ base: 'inline-block', sm: 'none' }}>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<HamburgerIcon />}
                variant="outline"
                aria-label="Options"
              />
              <MenuList>
                <NextLink href="/" passHref>
                  <MenuItem as={Link}>About</MenuItem>
                </NextLink>
                <NextLink href="/works" passHref>
                  <MenuItem as={Link}>Works</MenuItem>
                </NextLink>
                <NextLink href="/posts" passHref>
                  <MenuItem as={Link}>Posts</MenuItem>
                </NextLink>
                <MenuItem as={Link} href="http://wwww.github.com/vgarmes">
                  View Source
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
