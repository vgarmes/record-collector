import { useState, useEffect } from 'react';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { AnimatePresence, motion } from 'framer-motion';

const ColorModeButton = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // this prevents the button from animating on mounting if the color mode is different than the one in SSR
  if (!hasMounted) {
    return null;
  }

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      <motion.div
        style={{ display: 'inline-block' }}
        key={colorMode}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <IconButton
          aria-label="Toggle theme"
          colorScheme={colorMode === 'light' ? 'purple' : 'orange'}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default ColorModeButton;
