export interface ClienteEmpresa {
  id: string;
  nome_empresa: string;
  cnpj: string;
  contato_nome?: string;
  contato_telefone?: string;
  email: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateClienteEmpresaRequest {
  nome_empresa: string;
  cnpj: string;
  contato_nome?: string;
  contato_telefone?: string;
  email: string;
}

export interface UpdateClienteEmpresaRequest {
  nome_empresa?: string;
  cnpj?: string;
  contato_nome?: string;
  contato_telefone?: string;
  email?: string;
  ativo?: boolean;
}

export interface ClienteEmpresaFormData {
  nome_empresa: string;
  cnpj: string;
  contato_nome: string;
  contato_telefone: string;
  email: string;
}

// Tipos para paginação (caso seja implementada no backend futuramente)
export interface ClienteEmpresaResponse {
  content: ClienteEmpresa[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Tipos para filtros de busca
export interface ClienteEmpresaFilters {
  nome_empresa?: string;
  cnpj?: string;
  email?: string;
  ativo?: boolean;
}

// Tipos para ordenação
export interface ClienteEmpresaSort {
  field: 'nome_empresa' | 'cnpj' | 'email' | 'created_at' | 'updted_at';
  direction: 'asc' | 'desc';
}

// Tipos para validação de formulário
export interface ClienteEmpresaFormErrors {
  nome_empresa?: string;
  cnpj?: string;
  contato_nome?: string;
  contato_telefone?: string;
  email?: string;
}

// Tipo para modal de confirmação de exclusão
export interface DeleteClienteEmpresaModalProps {
  open: boolean;
  cliente: ClienteEmpresa | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading?: boolean;
}

export interface ClienteEmpresaModalProps {
  open: boolean;
  cliente?: ClienteEmpresa | null;
  onClose: () => void;
  onSave: (data: ClienteEmpresaFormData) => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

export interface CentralClientesProps {
  userRole?: string;
}

export interface CadastroClienteProps {
  onSuccess?: (cliente: ClienteEmpresa) => void;
  onCancel?: () => void;
}

export const CLIENTE_EMPRESA_VALIDATION = {
  NOME_EMPRESA: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255,
    REQUIRED: true
  },
  CNPJ: {
    PATTERN: /^\d{14}$/,
    REQUIRED: true
  },
  CONTATO_NOME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REQUIRED: false
  },
  CONTATO_TELEFONE: {
    PATTERN: /^\(?\d{2}\)?[\s\-]?\d{4,5}\-?\d{4}$/,
    REQUIRED: false
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    REQUIRED: true
  }
} as const;

// Mensagens de erro padrão
export const CLIENTE_EMPRESA_ERROR_MESSAGES = {
  NOME_EMPRESA_REQUIRED: 'Nome da empresa é obrigatório',
  NOME_EMPRESA_MIN_LENGTH: 'Nome da empresa deve ter pelo menos 2 caracteres',
  NOME_EMPRESA_MAX_LENGTH: 'Nome da empresa deve ter no máximo 255 caracteres',
  CNPJ_REQUIRED: 'CNPJ é obrigatório',
  CNPJ_INVALID: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX',
  CONTATO_NOME_MIN_LENGTH: 'Nome do contato deve ter pelo menos 2 caracteres',
  CONTATO_NOME_MAX_LENGTH: 'Nome do contato deve ter no máximo 100 caracteres',
  CONTATO_TELEFONE_INVALID: 'Telefone deve estar no formato (XX) XXXXX-XXXX',
  EMAIL_REQUIRED: 'Email é obrigatório',
  EMAIL_INVALID: 'Email deve ter um formato válido',
  CNPJ_ALREADY_EXISTS: 'CNPJ já cadastrado',
  EMAIL_ALREADY_EXISTS: 'Email já cadastrado'
} as const;

// Utilitários para formatação
export const formatCNPJ = (cnpj: string): string => {
  const numbers = cnpj.replace(/\D/g, '');
  if (numbers.length !== 14) return cnpj;
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

export const formatTelefone = (telefone: string): string => {
  const numbers = telefone.replace(/\D/g, '');
  if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return telefone;
};

export const cleanClienteEmpresaFormData = (data: ClienteEmpresaFormData): CreateClienteEmpresaRequest => {
  return {
    nome_empresa: data.nome_empresa.trim(),
    cnpj: data.cnpj.replace(/\D/g, ''),
    contato_nome: data.contato_nome?.trim() || undefined,
    contato_telefone: data.contato_telefone?.replace(/\D/g, '') || undefined,
    email: data.email.trim().toLowerCase()
  };
};
