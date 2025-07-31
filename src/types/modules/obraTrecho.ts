// TIPOS PARA O MÓDULO DE OBRA ETAPAS - MILLS RVT
// ================================================

import { EnumOption } from '@/types/modules/obra';

// Tipos para a entidade ObraEtapa
// Baseado na domain ObraEtapa.java e ObraEtapaDTO.java

export interface ObraTrecho {
  id: string;
  nome_trecho: string;
  endereco: string;
  obra_id: string;
  obra_nome: string;
  created_at: string;
  updated_at: string;
}

export interface CreateObraTrechoRequest {
  nome_trecho: string;
  endereco: string;
  obra_id: string;
}

export interface UpdateObraTrechoRequest {
  nome_trecho?: string;
  endereco?: string;
  obra_id?: string;
}

export interface ObraTrechoFormData {
  id?: string;
  nome_trecho: string;
  endereco: string;
  obra_id: string;
}

// ==========================================
// TIPOS PARA PAGINAÇÃO E FILTROS
// ==========================================

export interface ObraTrechoPagedResponse {
  content: ObraTrecho[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ObraTrechoFilters {
  nome_trecho?: string;
  endereco?: string;
  obra_id?: string;
}

// ==========================================
// TIPOS PARA VALIDAÇÃO DE FORMULÁRIOS
// ==========================================

export interface ObraTrechoFormErrors {
  nome_trecho?: string;
  endereco?: string;
  obra_id?: string;
}

// ==========================================
// TIPOS PARA COMPONENTES
// ==========================================

export interface ObraTrechoCardProps {
  trecho: ObraTrechoFormData;
  index: number;
  onUpdate: (index: number, etapa: ObraTrechoFormData) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  errors?: ObraTrechoFormErrors;
  loading?: boolean;
}

export interface ObraTrechosStepProps {
  obraId?: string;
  trechos: ObraTrechoFormData[];
  onTrechosChange: (etapas: ObraTrechoFormData[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  loading?: boolean;
}

export interface ObraCardProps {
  obra: any; 
  trechos: ObraTrecho[];
  onEditObra: (obra: any) => void;
  onDeleteObra: (obra: any) => void;
  onAddTrecho: (obra: any) => void;
  onEditTrecho: (trecho: ObraTrecho) => void;
  onDeleteTrecho: (trecho: ObraTrecho) => void;
  userRole?: string;
  userId?: string;
}

// ==========================================
// CONSTANTES PARA VALIDAÇÃO
// ==========================================

export const OBRA_TRECHO_VALIDATION = {
  NOME_TRECHO: {
    REQUIRED: true
  },
  ENDERECO: {
    REQUIRED: true
  },
  OBRA_ID: {
    REQUIRED: true
  }
} as const;

// ==========================================
// MENSAGENS DE ERRO
// ==========================================

export const OBRA_TRECHO_ERROR_MESSAGES = {
  NOME_TRECHO_REQUIRED: 'Nome do trecho é obrigatório',
  ENDERECO_REQUIRED: 'Endereço é obrigatório',
  OBRA_ID_REQUIRED: 'Obra é obrigatória',
  TRECHO_ALREADY_EXISTS: 'Este trecho já foi adicionada para esta obra',
  INVALID_ENUM_VALUE: 'Valor inválido selecionado'
} as const;


// ==========================================
// UTILITÁRIOS DE CONVERSÃO
// ==========================================

// Converter ObraEtapa para ObraEtapaFormData
export const convertObraTrechoToFormData = (trecho: ObraTrecho): ObraTrechoFormData => {
  return {
    id: trecho.id,
    nome_trecho: trecho.nome_trecho,
    endereco: trecho.endereco,
    obra_id: trecho.obra_id
  };
};

// ==========================================
// UTILITÁRIOS DE VALIDAÇÃO
// ==========================================

export const validateObraTrecho = (trecho: ObraTrechoFormData): ObraTrechoFormErrors => {
  const errors: ObraTrechoFormErrors = {};

  if (!trecho.nome_trecho || trecho.nome_trecho.trim() === '') {
    errors.nome_trecho = OBRA_TRECHO_ERROR_MESSAGES.NOME_TRECHO_REQUIRED;
  }

  if (!trecho.endereco || trecho.endereco.trim() === '') {
    errors.endereco = OBRA_TRECHO_ERROR_MESSAGES.ENDERECO_REQUIRED;
  }

  if (!trecho.obra_id || trecho.obra_id.trim() === '') {
    errors.obra_id = OBRA_TRECHO_ERROR_MESSAGES.OBRA_ID_REQUIRED;
  }

  return errors;
};

export const validateTrechosUniqueness = (trechos: ObraTrechoFormData[]): boolean => {
  const nomeTrechos = trechos.map(e => e.nome_trecho);
  const uniqueNomeTrechos = new Set(nomeTrechos);
  return nomeTrechos.length === uniqueNomeTrechos.size;
};

export const hasValidationErrors = (errors: ObraTrechoFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// ==========================================
// UTILITÁRIOS DE DADOS
// ==========================================

export const createEmptyObraTrecho = (obraId: string): ObraTrechoFormData => ({
  nome_trecho: '',
  endereco: '',
  obra_id: obraId
});

export const cleanObraTrechoFormData = (data: ObraTrechoFormData): CreateObraTrechoRequest => ({
  nome_trecho: data.nome_trecho.trim(),
  endereco: data.endereco.trim(),
  obra_id: data.obra_id.trim()
});


