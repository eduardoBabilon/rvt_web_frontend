import { User, CreateUserRequest, UpdateUserRequest, UserFormData, UserPagedResponse, UserFilters, PaginationParams } from '@/types/modules/users';
import { apiRequestWithRoute } from '../api';
import { apiRoutes } from '../../router';

export const userService = {
  createUser: async (userData: UserFormData): Promise<User> => {
    const createRequest: CreateUserRequest = {
      name: userData.name,
      email: userData.email,
      username: userData.username,
      perfilId: userData.perfilId,
      filialId: userData.filialId,
      ativo: userData.ativo, 
    };

    return apiRequestWithRoute<User>(apiRoutes.createUser, {}, {}, createRequest);
  },

  getAllUsers: async (filters?: UserFilters, pagination?: PaginationParams): Promise<UserPagedResponse> => {
    const queryParams: Record<string, string> = {};

    if (filters) {
      if (filters.name) queryParams.name = filters.name;
      if (filters.email) queryParams.email = filters.email;
      // if (filters.perfil) queryParams.perfilId = filters.perfil;
      // if (filters.filial) queryParams.filialId = filters.filial;
    }

    if (pagination) {
      if (pagination.page !== undefined) queryParams.page = pagination.page.toString();
      if (pagination.size !== undefined) queryParams.size = pagination.size.toString();
      if (pagination.sort) queryParams.sort = pagination.sort;
    }

    return apiRequestWithRoute<UserPagedResponse>(apiRoutes.getAllUsers, {}, queryParams);
  },

  getUserById: async (id: string): Promise<User> => {
    return apiRequestWithRoute<User>(apiRoutes.getUserById, { id });
  },

  getUserByEmail: async (email: string): Promise<User> => {
    return apiRequestWithRoute<User>(apiRoutes.getUserByEmail, { email });
  },

  getUserByUsername: async (username: string): Promise<User> => {
    return apiRequestWithRoute<User>(apiRoutes.getUserByUsername, { username });
  },

  updateUser: async (id: string, userData: UserFormData): Promise<User> => {
    const updateRequest: UpdateUserRequest = {
      id,
      name: userData.name,
      email: userData.email,
      username: userData.username,
      perfilId: userData.perfilId,
      filialId: userData.filialId,
      ativo: userData.ativo, 
    };

    return apiRequestWithRoute<User>(apiRoutes.updateUser, { id }, {}, updateRequest);
  },

  deleteUser: async (id: string): Promise<void> => {
    return apiRequestWithRoute<void>(apiRoutes.deleteUser, { id });
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequestWithRoute<User>(apiRoutes.getCurrentUser);
  },
};

export { setAuthToken, removeAuthToken, isAuthenticated } from '../api';
