export interface User {
  id: string; 
  name: string;
  email: string;
  username: string;
  perfilNome: string;
  filialNome: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateUserRequest {
  name: string; 
  email: string;
  username: string;
  perfilId: string; 
  filialId: string;
  ativo: boolean; 
}

export interface UpdateUserRequest {
  id: string;
  name?: string; 
  email?: string;
  username?: string;
  perfilId?: string; 
  filialId?: string; 
  ativo?: boolean; 
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; 
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface UserPagedResponse extends PagedResponse<User> {}

export interface UserFilters {
  name?: string;
  email?: string;
  perfil?: string;
  filial?: string;
  ativo?: boolean;
}

export interface PaginationParams {
  page?: number; 
  size?: number;
  sort?: string; 
}


export interface Perfil {
  id: string;
  perfil: string; 
  ativo?: boolean; 
}

export interface Filial {
  id: string;
  name: string; 
  endereco?: string; 
  ativo?: boolean; 
}

export interface UserModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'delete';
  user?: User;
}

export interface UserFormData {
  name: string;
  email: string;
  username: string;
  perfilId: string; 
  filialId: string; 
  ativo: boolean;
}

export interface UserFormErrors {
  name?: string;
  email?: string;
  username?: string;
  perfilId?: string;
  filialId?: string;
}

export interface PerfilResponse {
  data: Perfil[];
  total?: number;
}

export interface FilialResponse {
  data: Filial[];
  total?: number;
}