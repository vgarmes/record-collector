import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

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

export default LinkItem;
