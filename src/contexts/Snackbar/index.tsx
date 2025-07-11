import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { SnackbarProps, SnackbarData, SnackbarContextData } from './types';
import { SnackbarMessage } from '@/components/@shared/SnackbarMessage';
import { doNothing } from '../../utils/functions/general';
import { When } from '@/components/@shared/When';

export const SnackbarContext = createContext({
  dispatchSnackbar: doNothing,
} as SnackbarContextData);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [snackbar, setSnackbar] = useState<SnackbarProps>({} as SnackbarProps);
  const [width, setWidth] = useState(0);
  const snackbarRef = React.useRef<HTMLDivElement | null>(null);
  const styleSnackbarContainer = { top: '24px', left: `35%` };

  const addSnackbar = ({ type = 'error', message }: SnackbarData) => {
    setSnackbar({
      type: type,
      message: message,
      timestamp: new Date(),
    });
  };

  const deleteSnackbar = () => {
    setTimeout(() => setSnackbar({} as SnackbarProps), 200);
  };

  function handleWidth() {
    if (!snackbarRef.current) return;
    const { scrollWidth } = snackbarRef.current;
    setWidth(scrollWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWidth);
    handleWidth();
    return () => {
      window.removeEventListener('resize', handleWidth);
    };
  }, [snackbarRef.current]);

  useEffect(() => {
    handleWidth();
  }, [snackbar]);

  return (
    <SnackbarContext.Provider
      value={{
        dispatchSnackbar: addSnackbar,
      }}
    >
      <When value={snackbar.message}>
        <div style={{ ...styleSnackbarContainer, position: 'fixed', zIndex: 9998 }}>
          <SnackbarMessage
            
            snackbar={snackbar}
            deleteSnackbar={deleteSnackbar}
          />
        </div>
      </When>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbarContext = () => {
  return useContext(SnackbarContext);
};
