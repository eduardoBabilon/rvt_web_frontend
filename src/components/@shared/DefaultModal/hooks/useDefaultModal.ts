import { useEffect, useState } from 'react';

import colors from '@/styles/Theme/colors';
import { useBreakpointValue } from '@/hooks/useBreakpointValue';

type Props = {
  show?: boolean;
};

export function useDefaultModal({ show }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [activeEffects, setActiveEffects] = useState<boolean>(false);

  const isWideVersion = useBreakpointValue({
    xs: false,
    lg: true,
  });

  useEffect(() => {
    if (show) {
      setIsOpen(show);
      const timeout = setTimeout(() => {
        setActiveEffects(show);
      }, 10);
      return () => clearTimeout(timeout);
    }
    setActiveEffects(!!show);
    const timeout = setTimeout(() => {
      setIsOpen(!!show);
    }, 200);

    return () => clearTimeout(timeout);
  }, [show]);

  const { light } = colors.text;

  return { isWideVersion, light, isOpen, activeEffects };
}
