import React from 'react';
import { WithAuthentication } from '@/components/@shared/WithAuthentication';

export default function WithAuthenticationLayout({ children }: { children: React.ReactNode }) {
  return <WithAuthentication>{children}</WithAuthentication>;
}
