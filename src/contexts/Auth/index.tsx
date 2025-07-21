import { useEffect, useState, createContext, ReactNode, useContext } from 'react';

import { useMsal, useMsalAuthentication } from '@azure/msal-react';
import { useAuthServices } from './hooks/useAuthServices';
import { useSnackbarContext } from '../Snackbar';
import { requestConfig } from '@/authConfig';
import { AuthContextData } from './types';
import { User } from '@/types/entities';
import {
  InteractionRequiredAuthErrorCodes,
  InteractionRequiredAuthError,
  InteractionType,
  AccountInfo,
  EventType,
  BrowserAuthError,
} from '@azure/msal-browser';

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  function getLocalStorage(key: string) {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem(key) ?? undefined;
  }
  const localAccountId = getLocalStorage('preferred_local_account_id');
  const homeAccountId = getLocalStorage('preferred_home_account_id');
  const username = getLocalStorage('preferred_username');
  const loginRequest = {
    ...requestConfig,
    loginHint: username,
  };

  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const { login } = useMsalAuthentication(InteractionType.Silent, loginRequest);
  const { dispatchSnackbar } = useSnackbarContext();
  const { currentUser } = useAuthServices();
  const { instance } = useMsal();

  const userRole = user?.role;
  const isCentralRole = userRole === 'central';

  async function saveDataToken(idToken: string, account: AccountInfo) {
    localStorage.setItem('preferred_local_account_id', account.localAccountId);
    localStorage.setItem('preferred_home_account_id', account.homeAccountId);
    localStorage.setItem('preferred_username', account.username);
    localStorage.setItem('idToken', idToken);
  }

  async function clearDataToken() {
    localStorage.removeItem('preferred_local_account_id');
    localStorage.removeItem('preferred_home_account_id');
    localStorage.removeItem('preferred_username');
    localStorage.removeItem('idToken');
    localStorage.clear();
  }

  function handleAuthError(error: any) {
    const typedError = error as InteractionRequiredAuthError;
    const { loginRequired } = InteractionRequiredAuthErrorCodes;
    if (typedError.errorCode === loginRequired) return;
    dispatchSnackbar({ message: typedError.errorMessage, type: 'error' });
    console.log('authError details: ', { error });
  }

  async function loginWithAD() {
    try {
      setIsAuthLoading(true);
      const { account, idToken } = await instance.loginPopup();

      if (account) {
        instance.setActiveAccount(account);
        saveDataToken(idToken, account);
        await getUser();
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsAuthLoading(false);
    }
  }

  async function logout() {
    clearDataToken();
    await instance.logoutRedirect({ postLogoutRedirectUri: requestConfig.redirectUri });
  }

  async function getUser() {
    try {
      const { data } = await currentUser.refetch({ throwOnError: true });
      if (!data) {
        throw new Error('Usuário não existe');
      }
      const { createdAt, updatedAt, ...newUser } = data;
      console.log(data)
      setUser(newUser);
    } catch (error) {
      handleAuthError(error);
      clearDataToken();
      logout();
    }
  }

  async function initializeAuth() {
    await instance.initialize();
    try {
      const response = await login(InteractionType.Silent, loginRequest);
      if (!response) return;
      localStorage.setItem('idToken', response.idToken);
      instance.setActiveAccount(response.account);
      await getUser();
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsAuthLoading(false);
    }
  }

  useEffect(() => {
    initializeAuth();
    const eventId = instance.addEventCallback((event) => {
      const error = event.error as BrowserAuthError;
      if (
        event.eventType === EventType.SSO_SILENT_FAILURE &&
        error.errorCode === 'monitor_window_timeout'
      ) {
        instance.acquireTokenRedirect({ ...loginRequest });
      }
    });
    return () => instance.removeEventCallback(eventId ?? '');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthLoading,
        loginWithAD,
        logout,
        username,
        isCentralRole,
        homeAccountId,
        localAccountId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
