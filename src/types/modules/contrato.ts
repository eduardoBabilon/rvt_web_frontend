export interface Contrato {
  id: string;
  numero_contrato: string;
  data_inicio: string;
  data_fim: string;
  cliente_empresa_id: string;
  cliente_empresa_nome: string;
}

export interface CreateContratoRequest {
  numero_contrato: string;
  data_inicio: string;
  data_fim: string;
  cliente_empresa_id: string;
}

export interface UpdateContratoRequest {
  numero_contrato?: string;
  data_inicio?: string;
  data_fim?: string;
  cliente_empresa_id?: string;
}

export interface ContratoFormData {
  numero_contrato: string;
  data_inicio: string;
  data_fim: string;
  cliente_empresa_id: string;
}

// Tipos para paginação de contratos
export interface ContratoPagedResponse {
  content: Contrato[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Tipos para filtros de busca de contratos
export interface ContratoFilters {
  numero_contrato?: string;
  cliente_empresa_nome?: string;
  cliente_empresa_id?: string;
  data_inicio_from?: string;
  data_inicio_to?: string;
  data_fim_from?: string;
  data_fim_to?: string;
}

// Tipos para ordenação de contratos
export interface ContratoSort {
  field: 'numero_contrato' | 'cliente_empresa_nome' | 'data_inicio' | 'data_fim';
  direction: 'asc' | 'desc';
}

// Tipos para validação de formulário de contrato
export interface ContratoFormErrors {
  numero_contrato?: string;
  data_inicio?: string;
  data_fim?: string;
  cliente_empresa_id?: string;
}

// Tipo para modal de confirmação de exclusão de contrato
export interface DeleteContratoModalProps {
  open: boolean;
  contrato: Contrato | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
  loading?: boolean;
}

// Tipo para modal de cadastro/edição de contrato
export interface ContratoModalProps {
  open: boolean;
  contrato?: Contrato | null;
  onClose: () => void;
  onSave: (data: ContratoFormData) => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

// Tipo para props da Central de Contratos
export interface CentralContratosProps {
  userRole?: string;
}

// Tipo para props da Tela de Cadastro de Contratos
export interface CadastroContratoProps {
  onSuccess?: (contrato: Contrato) => void;
  onCancel?: () => void;
}

// Constantes para validação de contratos
export const CONTRATO_VALIDATION = {
  NUMERO_CONTRATO: {
    LENGTH: 10,
    PATTERN: /^\d{10}$/,
    REQUIRED: true
  },
  DATA_INICIO: {
    REQUIRED: true
  },
  DATA_FIM: {
    REQUIRED: true
  },
  CLIENTE_EMPRESA_ID: {
    REQUIRED: true
  }
} as const;

// Mensagens de erro padrão para contratos
export const CONTRATO_ERROR_MESSAGES = {
  NUMERO_CONTRATO_REQUIRED: 'Número do contrato é obrigatório',
  NUMERO_CONTRATO_INVALID: 'Número do contrato deve ter exatamente 10 dígitos',
  NUMERO_CONTRATO_ALREADY_EXISTS: 'Número do contrato já está cadastrado',
  DATA_INICIO_REQUIRED: 'Data de início é obrigatória',
  DATA_FIM_REQUIRED: 'Data de fim é obrigatória',
  DATA_FIM_BEFORE_INICIO: 'Data de fim deve ser posterior à data de início',
  CLIENTE_EMPRESA_ID_REQUIRED: 'Cliente é obrigatório',
  CLIENTE_NOT_FOUND: 'Cliente selecionado não foi encontrado'
} as const;

// Utilitários para formatação de contratos
export const formatNumeroContrato = (numero: string): string => {
  // Remove tudo que não é dígito
  const numbers = numero.replace(/\D/g, '');
  // Limita a 10 dígitos
  return numbers.slice(0, 10);
};

export const validateNumeroContrato = (numero: string): boolean => {
  const cleanNumber = numero.replace(/\D/g, '');
  return cleanNumber.length === 10;
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
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Utilitário para validar datas
export const validateDateRange = (dataInicio: string, dataFim: string): boolean => {
  if (!dataInicio || !dataFim) return false;
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  return fim > inicio;
};

// Utilitário para limpar dados do formulário de contrato
export const cleanContratoFormData = (data: ContratoFormData): CreateContratoRequest => {
  return {
    numero_contrato: data.numero_contrato.replace(/\D/g, ''),
    data_inicio: data.data_inicio,
    data_fim: data.data_fim,
    cliente_empresa_id: data.cliente_empresa_id
  };
};

// Utilitário para calcular duração do contrato
export const calculateContractDuration = (dataInicio: string, dataFim: string): number => {
  if (!dataInicio || !dataFim) return 0;
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  const diffTime = Math.abs(fim.getTime() - inicio.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Utilitário para verificar se contrato está ativo
export const isContratoAtivo = (dataInicio: string, dataFim: string): boolean => {
  const now = new Date();
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  return now >= inicio && now <= fim;
};

// Utilitário para obter status do contrato
export const getContratoStatus = (dataInicio: string, dataFim: string): 'pendente' | 'ativo' | 'finalizado' => {
  const now = new Date();
  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);
  
  if (now < inicio) return 'pendente';
  if (now > fim) return 'finalizado';
  return 'ativo';
};