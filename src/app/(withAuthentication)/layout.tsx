'use client';

import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '@/styles/Theme/MaterialUi/index'
import { WithAuthentication } from '@/components/@shared/WithAuthentication';

export default function WithAuthenticationLayout({ children }: { children: React.ReactNode }) {
  return (
      <WithAuthentication>{children}</WithAuthentication>
  );
}
