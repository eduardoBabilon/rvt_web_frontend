// Tipos para a entidade User
export interface User {
  id: string; // UUID no Java é string no TS
  nome: string;
  email: string;
  username: string;
  funcao: string;
  filial: string;
  admin: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

// Tipo para criação de usuário (sem id, criadoEm, atualizadoEm)
export interface CreateUserRequest {
  name: string; // Alterado para 'name' para corresponder ao backend
  email: string;
  username: string;
  perfilId: string; // Adicionado perfilId para corresponder ao backend
  filialId: string; // Adicionado filialId para corresponder ao backend
  ativo: boolean; // Adicionado ativo para corresponder ao backend
}

// Tipo para atualização de usuário (todos os campos opcionais exceto id)
export interface UpdateUserRequest {
  id: string;
  name?: string; // Alterado para 'name'
  email?: string;
  username?: string;
  perfilId?: string; // Adicionado perfilId
  filialId?: string; // Adicionado filialId
  ativo?: boolean; // Adicionado ativo
}

// Tipo para resposta da API com paginação
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // Current page number (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Tipo para resposta da API de usuários paginada
export interface UserPagedResponse extends PagedResponse<User> {}

// Tipo para filtros de busca
export interface UserFilters {
  nome?: string;
  email?: string;
  funcao?: string;
  filial?: string;
  admin?: boolean;
}

// Tipo para parâmetros de paginação e ordenação
export interface PaginationParams {
  page?: number; // 0-indexed
  size?: number;
  sort?: string; // Ex: "nome,asc" ou "email,desc"
}

// Tipos para Perfis/Funções (tabela do banco)
export interface Perfil {
  id: string;
  perfil: string; // Nome da função/perfil
  descricao?: string; // Descrição opcional
  ativo?: boolean; // Se o perfil está ativo
}

// Tipos para Filiais (tabela do banco)
export interface Filial {
  id: string;
  nome: string; // Nome da filial
  codigo?: string; // Código da filial
  endereco?: string; // Endereço da filial
  ativo?: boolean; // Se a filial está ativa
}

// Tipo para modal state
export interface UserModalState {
  isOpen: boolean;
  mode: 'create' | 'edit' | 'delete';
  user?: User;
}

// Tipo para form data (usado nos modais)
export interface UserFormData {
  nome: string;
  email: string;
  username: string;
  perfilId: string; // ID do perfil selecionado
  filialId: string; // ID da filial selecionada
  admin: boolean;
}

// Tipo para validação de formulário
export interface UserFormErrors {
  nome?: string;
  email?: string;
  username?: string;
  perfilId?: string;
  filialId?: string;
}

// Tipos para respostas das APIs de Perfis e Filiais
export interface PerfilResponse {
  data: Perfil[];
  total?: number;
}

export interface FilialResponse {
  data: Filial[];
  total?: number;
}