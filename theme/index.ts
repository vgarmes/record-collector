import { extendTheme, ThemeConfig, ThemeOverride } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
import icons from './icons';

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
});

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: false,
};

const overrides: ThemeOverride = {
  config,
  breakpoints,
  icons,
};

export default extendTheme(overrides);
