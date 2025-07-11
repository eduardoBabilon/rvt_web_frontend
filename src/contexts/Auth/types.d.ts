import { User } from '@/@types/entities';

export type AuthContextData = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  loginWithAD: () => Promise<void>;
  logout: () => Promise<void>;
  username?: string;
  isCentralRole: boolean;
  homeAccountId?: string;
  localAccountId?: string;
};
