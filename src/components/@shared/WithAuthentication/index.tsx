'use client';
import React from 'react';

import { MsalAuthenticationTemplate } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';
import { LoginBox } from '@/components/LoginBox';
import { useAuthContext } from '@/contexts/Auth';
import { Loading } from '../Loading';
import { When } from '../When';

type Props = {
  children: React.ReactNode;
};

export function WithAuthentication({ children }: Props) {
  const { isAuthLoading, username, homeAccountId, localAccountId } = useAuthContext();

  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Silent}
      localAccountId={localAccountId}
      homeAccountId={homeAccountId}
      loadingComponent={() => <Loading />}
      errorComponent={LoginBox}
      username={username}
    >
      <When value={isAuthLoading} render={<Loading />} elseRender={children} />
    </MsalAuthenticationTemplate>
  );
}
