import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserFormData,
  UserPagedResponse,
  UserFilters,
  PaginationParams,
} from '@/types/modules/users';

import { apiRequestWithRoute } from '../api';
import { apiRoutes } from '../../router';
import { getObraById } from '../obra/obraService';

export const createUser = async (userData: UserFormData): Promise<User> => {
  const createRequest: CreateUserRequest = {
    name: userData.name,
    email: userData.email,
    username: userData.username,
    perfil_id: userData.perfil_id,
    filial_id: userData.filial_id,
    ativo: userData.ativo,
  };

  return apiRequestWithRoute<User>(apiRoutes.createUser, {}, {}, createRequest);
};

export const getAllUsers = async (
  filters?: UserFilters,
  pagination?: PaginationParams
): Promise<UserPagedResponse> => {
  const queryParams: Record<string, string> = {};

  if (filters) {
    if (filters.name) queryParams.name = filters.name;
    if (filters.email) queryParams.email = filters.email;
    // if (filters.perfil) queryParams.perfil_id = filters.perfil;
    // if (filters.filial) queryParams.filial_id = filters.filial;
  }

  if (pagination) {
    if (pagination.page !== undefined) queryParams.page = pagination.page.toString();
    if (pagination.size !== undefined) queryParams.size = pagination.size.toString();
    if (pagination.sort) queryParams.sort = pagination.sort;
  }

  return apiRequestWithRoute<UserPagedResponse>(apiRoutes.getAllUsers, {}, queryParams);
};

export const getUserById = async (id: string): Promise<User> => {
  return apiRequestWithRoute<User>(apiRoutes.getUserById, { id });
};

export const getUserByEmail = async (email: string): Promise<User> => {
  return apiRequestWithRoute<User>(apiRoutes.getUserByEmail, { email });
};

export const getUserByUsername = async (username: string): Promise<User> => {
  return apiRequestWithRoute<User>(apiRoutes.getUserByUsername, { username });
};

export const updateUser = async (id: string, userData: UserFormData): Promise<User> => {
  const updateRequest: UpdateUserRequest = {
    id,
    name: userData.name,
    email: userData.email,
    username: userData.username,
    perfil_id: userData.perfil_id,
    filial_id: userData.filial_id,
    ativo: userData.ativo,
  };

  return apiRequestWithRoute<User>(apiRoutes.updateUser, { id }, {}, updateRequest);
};

export const deleteUser = async (id: string): Promise<void> => {
  return apiRequestWithRoute<void>(apiRoutes.deleteUser, { id });
};

export const getCurrentUser = async (): Promise<User> => {
  return apiRequestWithRoute<User>(apiRoutes.getCurrentUser);
};

// Fiscalizadores
export const getFiscalizadoresAtivos = async (): Promise<any[]> => {
  try {
    const PERFIL_FISCALIZADOR_SUPERVISOR = '3a8e496b-ecf6-4d3b-808b-09d4a30cc977';
    const PERFIL_FISCALIZADOR_LIDER = 'bf0ed3b8-d5af-4758-82e3-c9d40ba8fa75';

    const [supervisores, lideres] = await Promise.all([
      getAllUsers({ perfil: PERFIL_FISCALIZADOR_SUPERVISOR, ativo: true }),
      getAllUsers({ perfil: PERFIL_FISCALIZADOR_LIDER, ativo: true }),
    ]);

    const todos = [...supervisores.content, ...lideres.content];
    const unicos = todos.filter((item, i, arr) => i === arr.findIndex(f => f.id === item.id));

    return unicos;
  } catch (error) {
    console.error('Erro ao buscar fiscalizadores:', error);
    throw error;
  }
};

export const getFiscalizadoresDisponiveis = async (obraId?: string): Promise<any[]> => {
  try {
    const todos = await getFiscalizadoresAtivos();

    if (!obraId) return todos;

    const obra = await getObraById(obraId);
    const vinculados = obra.fiscalizadores_ids || [];

    return todos.filter(f => !vinculados.includes(f.id));
  } catch (error) {
    console.error('Erro ao buscar fiscalizadores disponíveis:', error);
    throw error;
  }
};

// Exporte tokens se necessário
export { setAuthToken, removeAuthToken, isAuthenticated } from '../api';
