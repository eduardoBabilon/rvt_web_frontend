'use client';
import React, { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PublicClientApplication } from '@azure/msal-browser';
import { SnackbarProvider } from '@/contexts/Snackbar';
import { SocketProvider } from '@/contexts/Socket';
import { theme } from '@/styles/Theme/MaterialUi';
import { QueryCache } from '@tanstack/query-core';
import { MsalProvider } from '@azure/msal-react';
import { ThemeProvider } from '@emotion/react';
import { AuthProvider } from '@/contexts/Auth';
import { msalConfig } from '@/authConfig';

interface ProvidersProps {
  children: ReactNode;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache(),
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
const msalInstance = new PublicClientApplication(msalConfig);

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <MsalProvider instance={msalInstance}>
          <ThemeProvider theme={theme}>         
              <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </MsalProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}
