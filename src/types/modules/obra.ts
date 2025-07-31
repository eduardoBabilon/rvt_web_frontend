// ==========================================
// TIPOS PARA O MÓDULO DE OBRAS - MILLS RVT
// ==========================================

// Tipos para a entidade Obra
// Baseado na domain Obra.java e ObraDTO.java

import { User } from '@/types/modules/users'
import { ClienteEmpresa } from './clienteEmpresa';

export interface Obra {
  id: string;
  name_obra: string;
  numero_contrato: string;
  obra_tipo_id: string;
  obra_tipo_nome: string;
  status_obra: string;
  endereco: string;
  cliente_id: string;
  cliente_name: string;
  filial_id: string;
  filial_nome: string;
  data_inicio: string;
  data_fim: string;
  created_at: string;
  updated_at: string;
}

export interface CreateObraRequest {
  name_obra: string;
  numero_contrato: string;
  obra_tipo_id: string;
  status_obra: string;
  endereco: string;
  cliente_id: string;
  filial_id: string;
  data_inicio: string;
  data_fim: string;
}

export interface UpdateObraRequest {
  name_obra?: string;
  numero_contrato?: string;
  obra_tipo_id?: string;
  status_obra?: string;
  endereco?: string;
  cliente_id?: string;
  filial_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface ObraFormData {
  name_obra: string;
  numero_contrato: string;
  obra_tipo_id: string;
  obra_tipo?: ObraTipo;
  status_obra: string;
  endereco: string;
  filial_id: string;
  filial?: Filial;
  cliente_id: string;
  cliente?: ClienteEmpresa;
  data_inicio: string;
  data_fim: string;
}

export interface ObraTipo {
  id: string;
  obra_tipo_nome: string;
}

export interface CreateObraTipoRequest {
  tipo: string;
}

export interface UpdateObraTipoRequest {
  tipo?: string;
}

export interface ObraTipoFormData {
  tipo: string;
}


export interface Filial {
  id: string;
  name: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
}


// Tipos para paginação de obras
export interface ObraPagedResponse {
  content: Obra[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Tipos para paginação de obra tipos
export interface ObraTipoPagedResponse {
  content: ObraTipo[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Tipos para filtros de busca de obras
export interface ObraFilters {
  name_obra?: string;
  numero_contrato?: string;
  obra_tipo_id?: string;
  status_obra?: string;
  filial_id?: string;
  cliente_id?: string;
  data_inicio_from?: string;
  data_inicio_to?: string;
  data_fim_from?: string;
  data_fim_to?: string;
}

// Tipos para filtros de busca de obra tipos
export interface ObraTipoFilters {
  tipo?: string;
}

// Tipos para ordenação de obras
export interface ObraSort {
  field: 'name_obra' | 'obra_tipo_nome' | 'status_obra' | 'filial_nome' | 'data_inicio' | 'data_fim';
  direction: 'asc' | 'desc';
}

// Tipos para ordenação de obra tipos
export interface ObraTipoSort {
  field: 'tipo';
  direction: 'asc' | 'desc';
}

// ==========================================
// TIPOS PARA VALIDAÇÃO DE FORMULÁRIOS
// ==========================================

// Tipos para validação de formulário de obra
export interface ObraFormErrors {
  name_obra?: string;
  numero_contrato?: string;
  obra_tipo_id?: string;
  status_obra?: string;
  endereco?: string;
  filial_id?: string;
  cliente_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

// Tipos para validação de formulário de obra tipo
export interface ObraTipoFormErrors {
  tipo?: string;
}

// ==========================================
// TIPOS PARA MODAIS E COMPONENTES
// ==========================================

// Tipo para modal de confirmação de exclusão de obra
export interface DeleteObraModalProps {
  open: boolean;
  obra: Obra | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading?: boolean;
}

// Tipo para modal de confirmação de exclusão de obra tipo
export interface DeleteObraTipoModalProps {
  open: boolean;
  obraTipo: ObraTipo | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading?: boolean;
}

// Tipo para modal de cadastro/edição de obra tipo
export interface ObraTipoModalProps {
  open: boolean;
  obraTipo?: ObraTipo | null;
  onClose: () => void;
  onSave: (data: ObraTipoFormData) => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

// ==========================================
// TIPOS PARA PROPS DE COMPONENTES
// ==========================================

// Tipo para props da Listagem de Obras
export interface ListagemObrasProps {
  userRole?: string;
  userId?: string;
}

// Tipo para props da Tela de Cadastro de Obras
export interface CadastroObraProps {
  onSuccess?: (obra: Obra) => void;
  onCancel?: () => void;
}

// Tipo para props da Tela de Edição de Obras
export interface EdicaoObraProps {
  obraId: string;
  onSuccess?: (obra: Obra) => void;
  onCancel?: () => void;
}

// Tipo para props da Listagem de Tipos de Obra
export interface ListagemObraTiposProps {
  userRole?: string;
}

// Tipo para props da Tela de Cadastro de Tipos de Obra
export interface CadastroObraTipoProps {
  onSuccess?: (obraTipo: ObraTipo) => void;
  onCancel?: () => void;
}

// ==========================================
// CONSTANTES PARA VALIDAÇÃO
// ==========================================

// Constantes para validação de obras
export const OBRA_VALIDATION = {
  NAME_OBRA: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255,
    REQUIRED: true
  },
  NUMERO_CONTRATO: {
    LENGTH: 10,
    PATTERN: /^\d{10}$/,
    REQUIRED: true
  },
  OBRA_TIPO_ID: {
    REQUIRED: true
  },
  STATUS_OBRA: {
    REQUIRED: true
  },
  ENDERECO: {
    REQUIRED: true,
    MIN_LENGTH: 5,
    MAX_LENGTH: 500
  },
  FILIAL_ID: {
    REQUIRED: true
  },
  CLIENTE_ID: {
    REQUIRED: true
  },
  DATA_INICIO: {
    REQUIRED: true
  },
  DATA_FIM: {
    REQUIRED: true
  },
} as const;

// Constantes para validação de tipos de obra
export const OBRA_TIPO_VALIDATION = {
  TIPO: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    REQUIRED: true
  }
} as const;


// Mensagens de erro padrão para obras
export const OBRA_ERROR_MESSAGES = {
  NAME_OBRA_REQUIRED: 'Nome da obra é obrigatório',
  NUMERO_CONTRATO_REQUIRED: 'Numero do contrato é obrigatório',
  NAME_OBRA_MIN_LENGTH: 'Nome da obra deve ter pelo menos 2 caracteres',
  NAME_OBRA_MAX_LENGTH: 'Nome da obra deve ter no máximo 255 caracteres',
  OBRA_TIPO_ID_REQUIRED: 'Tipo de obra é obrigatório',
  STATUS_OBRA_REQUIRED: 'Status da obra é obrigatório',
  ENDERECO_REQUIRED: 'Endereço é obrigatório',
  ENDERECO_MIN_LENGTH: 'Endereço deve ter pelo menos 5 caracteres',
  ENDERECO_MAX_LENGTH: 'Endereço deve ter no máximo 500 caracteres',
  FILIAL_ID_REQUIRED: 'Filial é obrigatória',
  CLIENTE_ID_REQUIRED: 'É obrigatório selecioanr um cliente',
  DATA_INICIO_REQUIRED: 'Data de início é obrigatória',
  DATA_FIM_BEFORE_INICIO: 'Data de fim deve ser posterior à data de início',
  CLIENTE_NOT_FOUND: 'Cliente selecionado não foi encontrado',
  OBRA_TIPO_NOT_FOUND: 'Tipo de obra selecionado não foi encontrado',
  FILIAL_NOT_FOUND: 'Filial selecionada não foi encontrada',
} as const;

// Mensagens de erro padrão para tipos de obra
export const OBRA_TIPO_ERROR_MESSAGES = {
  TIPO_REQUIRED: 'Tipo de obra é obrigatório',
  TIPO_MIN_LENGTH: 'Tipo de obra deve ter pelo menos 2 caracteres',
  TIPO_MAX_LENGTH: 'Tipo de obra deve ter no máximo 100 caracteres',
  TIPO_ALREADY_EXISTS: 'Tipo de obra já cadastrado'
} as const;

// ==========================================
// TIPOS PARA ENUMS DINÂMICOS
// ==========================================

// Tipo para enum retornado pelo backend
export interface EnumOption {
  name: string;
  label: string;
}

// ==========================================
// ENUMS E OPÇÕES
// ==========================================

// Status de Obra será carregado dinamicamente do backend via /enums/status-etapa
// Removido STATUS_OBRA_OPTIONS fixo para usar dados dinâmicos

// ==========================================
// UTILITÁRIOS PARA FORMATAÇÃO
// ==========================================

// ==========================================
// UTILITÁRIOS DE CONVERSÃO
// ==========================================

// Converter Obra para ObraFormData
export const convertObraToFormData = (obra: Obra): ObraFormData => {
  return {
    name_obra: obra.name_obra,
    numero_contrato: obra.numero_contrato,
    obra_tipo_id: obra.obra_tipo_id,
    status_obra: obra.status_obra,
    endereco: obra.endereco,
    filial_id: obra.filial_id,
    cliente_id: obra.cliente_id,
    data_inicio: formatDateForInput(obra.data_inicio),
    data_fim: formatDateForInput(obra.data_fim),
  };
};

// ==========================================
// UTILITÁRIOS DE VALIDAÇÃO
// ==========================================

// Validar dados do formulário de obra
export const validateObra = (data: ObraFormData): ObraFormErrors => {
  const errors: ObraFormErrors = {};

  // Validar nome da obra
  if (!data.name_obra || data.name_obra.trim() === '') {
    errors.name_obra = OBRA_ERROR_MESSAGES.NAME_OBRA_REQUIRED;
  } else if (data.name_obra.trim().length < OBRA_VALIDATION.NAME_OBRA.MIN_LENGTH) {
    errors.name_obra = OBRA_ERROR_MESSAGES.NAME_OBRA_MIN_LENGTH;
  } else if (data.name_obra.trim().length > OBRA_VALIDATION.NAME_OBRA.MAX_LENGTH) {
    errors.name_obra = OBRA_ERROR_MESSAGES.NAME_OBRA_MAX_LENGTH;
  }

  // Validar numero do contrato
  if (!data.numero_contrato || data.numero_contrato.trim() === '') {
    errors.numero_contrato = OBRA_ERROR_MESSAGES.NUMERO_CONTRATO_REQUIRED;
  }

  // Validar tipo de obra
  if (!data.obra_tipo_id || data.obra_tipo_id.trim() === '') {
    errors.obra_tipo_id = OBRA_ERROR_MESSAGES.OBRA_TIPO_ID_REQUIRED;
  }

  // Validar status da obra
  if (!data.status_obra || data.status_obra.trim() === '') {
    errors.status_obra = OBRA_ERROR_MESSAGES.STATUS_OBRA_REQUIRED;
  }

  // Validar endereço
  if (!data.endereco || data.endereco.trim() === '') {
    errors.endereco = OBRA_ERROR_MESSAGES.ENDERECO_REQUIRED;
  } else if (data.endereco.trim().length < OBRA_VALIDATION.ENDERECO.MIN_LENGTH) {
    errors.endereco = OBRA_ERROR_MESSAGES.ENDERECO_MIN_LENGTH;
  } else if (data.endereco.trim().length > OBRA_VALIDATION.ENDERECO.MAX_LENGTH) {
    errors.endereco = OBRA_ERROR_MESSAGES.ENDERECO_MAX_LENGTH;
  }

  // Validar filial
  if (!data.filial_id || data.filial_id.trim() === '') {
    errors.filial_id = OBRA_ERROR_MESSAGES.FILIAL_ID_REQUIRED;
  }

  // Validar cliente
  if (!data.cliente_id || data.cliente_id.trim() === '') {
    errors.cliente_id = OBRA_ERROR_MESSAGES.CLIENTE_ID_REQUIRED;
  }

  // Validar data de início
  if (!data.data_inicio || data.data_inicio.trim() === '') {
    errors.data_inicio = OBRA_ERROR_MESSAGES.DATA_INICIO_REQUIRED;
  }


  // Validar intervalo de datas
  if (data.data_inicio && data.data_fim && !validateObraDateRange(data.data_inicio, data.data_fim)) {
    errors.data_fim = OBRA_ERROR_MESSAGES.DATA_FIM_BEFORE_INICIO;
  }

  return errors;
};

export const validateNumeroContrato = (numero: string): boolean => {
  const cleanNumber = numero.replace(/\D/g, '');
  return cleanNumber.length === 10;
};

// ==========================================
// UTILITÁRIOS PARA FORMATAÇÃO DE OBRAS
// ==========================================
export const getStatusObraLabel = (status: string, statusOptions: EnumOption[]): string => {
  const statusOption = statusOptions.find(option => option.name === status);
  return statusOption ? statusOption.label : status;
};

export const getStatusObraColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case 'MOBILIZANDO':
      return 'info';
    case 'EM_ANDAMENTO':
      return 'primary';
    case 'DESMOBILIZACAO':
      return 'warning';
    case 'CONCLUIDA':
      return 'success';
    default:
      return 'default';
  }
};

// Utilitário para gerar nome da obra automaticamente
export const generateObraName = (contratoNumero: string, clienteNome: string): string => {
  return `${contratoNumero} - ${clienteNome}`;
};

// Utilitário para validar datas de obra
export const validateObraDateRange = (dataInicio: string, dataFim: string): boolean => {
  if (!dataInicio || !dataFim) return false;
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  return fim > inicio;
};

// Utilitário para limpar dados do formulário de obra
export const cleanObraFormData = (data: ObraFormData): CreateObraRequest => {
  return {
    name_obra: data.name_obra.trim(),
    numero_contrato: data.numero_contrato.trim(),
    obra_tipo_id: data.obra_tipo_id,
    status_obra: data.status_obra,
    endereco: data.endereco.trim(),
    filial_id: data.filial_id,
    cliente_id: data.cliente_id,
    data_inicio: data.data_inicio,
    data_fim: data.data_fim,
  };
};

// Utilitário para limpar dados do formulário de tipo de obra
export const cleanObraTipoFormData = (data: ObraTipoFormData): CreateObraTipoRequest => {
  return {
    tipo: data.tipo.trim()
  };
};

// Utilitário para calcular duração da obra
export const calculateObraDuration = (dataInicio: string, dataFim: string): number => {
  if (!dataInicio || !dataFim) return 0;
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const diffTime = Math.abs(fim.getTime() - inicio.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Utilitário para verificar se usuário pode ver obra (baseado no perfil)
export const canUserViewObra = (userRole: string, userId: string, obra: Obra): boolean => {
  // Administradores podem ver todas as obras
  if (userRole === 'ADMIN') {
    return true;
  }
  return false;
};

// Utilitário para verificar se usuário pode editar obra
export const canUserEditObra = (userRole: string, userId: string, obra: Obra): boolean => {
  // Administradores podem editar todas as obras
  if (userRole === 'ADMIN') {
    return true;
  }
  
  return false;
};

// Utilitário para verificar se usuário pode excluir obra
export const canUserDeleteObra = (userRole: string): boolean => {
  // Apenas administradores podem excluir obras
  return userRole === 'ADMIN';
};

// Utilitário para verificar se usuário pode gerenciar tipos de obra
export const canUserManageObraTipos = (userRole: string): boolean => {
  // Apenas administradores podem gerenciar tipos de obra
  return userRole === 'ADMIN';
};

// ==========================================
// UTILITÁRIOS PARA FORMATAÇÃO DE DATAS
// ==========================================

export const formatNumeroContrato = (numero: string): string => {
  // Remove tudo que não é dígito
  const numbers = numero.replace(/\D/g, '');
  // Limita a 10 dígitos
  return numbers.slice(0, 10);
};

export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
};

export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const formatDateTimeForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

