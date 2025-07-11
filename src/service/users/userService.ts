import { User, CreateUserRequest, UpdateUserRequest, UserFormData, UserPagedResponse, UserFilters, PaginationParams } from '@/@types/modules/users';
import { apiRequestWithRoute } from '../api';
import { apiRoutes } from '../router';

export const userService = {
  createUser: async (userData: UserFormData): Promise<User> => {
    const createRequest: CreateUserRequest = {
      name: userData.nome,
      email: userData.email,
      username: userData.username,
      perfilId: userData.perfilId,
      filialId: userData.filialId,
      ativo: userData.admin, 
    };

    return apiRequestWithRoute<User>(apiRoutes.createUser, {}, {}, createRequest);
  },

  getAllUsers: async (filters?: UserFilters, pagination?: PaginationParams): Promise<UserPagedResponse> => {
    const queryParams: Record<string, string> = {};

    if (filters) {
      if (filters.nome) queryParams.name = filters.nome;
      if (filters.email) queryParams.email = filters.email;
      // if (filters.funcao) queryParams.perfilId = filters.funcao;
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
      name: userData.nome,
      email: userData.email,
      username: userData.username,
      perfilId: userData.perfilId,
      filialId: userData.filialId,
      ativo: userData.admin, 
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
