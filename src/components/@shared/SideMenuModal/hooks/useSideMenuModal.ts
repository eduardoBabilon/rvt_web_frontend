import { useAuthContext } from '@/contexts/Auth';
import { useEffect, useState } from 'react';

type Props = {
  show: boolean;
};

export function useSideMenuModal({ show }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeEffects, setActiveEffects] = useState<boolean>(false);

  function blockScroll() {
    document.body.style.overflow = 'hidden';
  }

  function unblockScroll() {
    document.body.style.overflow = 'auto';
  }

  useEffect(() => {
    if (show) {
      blockScroll();
      setIsOpen(show);
      const interval = setInterval(() => {
        setActiveEffects(show);
      }, 10);
      return () => clearInterval(interval);
    }
    unblockScroll();
    setActiveEffects(show);
    const interval = setInterval(() => {
      setIsOpen(show);
    }, 200);

    return () => {
      clearInterval(interval);
      unblockScroll();
    };
  }, [show]);

  return { isOpen, activeEffects };
}
