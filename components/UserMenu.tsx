import NextLink from 'next/link';
import { SettingsIcon, LockIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Link,
} from '@chakra-ui/react';
import { User } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import ColorModeButton from './ColorModeButton';

interface Props {
  user: User | undefined;
}

const UserMenu = ({ user }: Props) => {
  if (!user) {
    return (
      <Menu>
        <MenuButton>
          <Avatar size="sm" />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => signIn()}>Iniciar sesión</MenuItem>
          <MenuItem mt={6}>
            <ColorModeButton />
          </MenuItem>
        </MenuList>
      </Menu>
    );
  }

  return (
    <Menu>
      <MenuButton>
        <Avatar name={user.name} size="sm" />
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
        <MenuItem mt={6}>
          <ColorModeButton />
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
