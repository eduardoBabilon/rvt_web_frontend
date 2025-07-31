import { EnumOption } from '@/types/modules/obra';
import { apiRequest } from '../api';

// ==========================================
// SERVIÇOS PARA ENUMS
// ==========================================

// Função para buscar status de etapa/obra
export const getStatusEtapaEnum = async (): Promise<EnumOption[]> => {
  try {
    const response = await apiRequest<EnumOption[]>('/enums/status-etapa', {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar enum de status de etapa:', error);
    throw error;
  }
};

// Função para buscar tipos de etapa de obra
export const getObraEtapaEnum = async (): Promise<EnumOption[]> => {
  try {
    const response = await apiRequest<EnumOption[]>('/enums/obra-etapa', {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar enum de obra etapa:', error);
    throw error;
  }
};

// Função para buscar complexidade de etapa
export const getComplexidadeEnum = async (): Promise<EnumOption[]> => {
  try {
    const response = await apiRequest<EnumOption[]>('/enums/complexidade-etapa', {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar enum de complexidade:', error);
    throw error;
  }
};

// ==========================================
// CACHE PARA OTIMIZAÇÃO
// ==========================================

// Cache para status de etapa
let statusEtapaCache: EnumOption[] | null = null;
let statusEtapaCacheTime: number = 0;

// Cache para obra etapa
let obraEtapaCache: EnumOption[] | null = null;
let obraEtapaCacheTime: number = 0;

// Cache para complexidade
let complexidadeCache: EnumOption[] | null = null;
let complexidadeCacheTime: number = 0;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// ==========================================
// FUNÇÕES COM CACHE
// ==========================================

// Função para buscar status de etapa com cache
export const getStatusEtapaEnumCached = async (): Promise<EnumOption[]> => {
  const now = Date.now();
  
  // Verificar se o cache ainda é válido
  if (statusEtapaCache && (now - statusEtapaCacheTime) < CACHE_DURATION) {
    return statusEtapaCache;
  }
  
  try {
    // Buscar dados do backend
    const statusOptions = await getStatusEtapaEnum();
    
    // Atualizar cache
    statusEtapaCache = statusOptions;
    statusEtapaCacheTime = now;
    
    return statusOptions;
  } catch (error) {
    // Se falhar e tiver cache antigo, usar o cache
    if (statusEtapaCache) {
      console.warn('Usando cache antigo de status de etapa devido a erro:', error);
      return statusEtapaCache;
    }
    
    // Se não tiver cache, retornar valores padrão
    console.error('Erro ao buscar status de etapa, usando valores padrão:', error);
    return [
      { name: 'MOBILIZANDO', label: 'Mobilizando' },
      { name: 'EM_ANDAMENTO', label: 'Em Andamento' },
      { name: 'DESMOBILIZACAO', label: 'Desmobilização' },
      { name: 'CONCLUIDA', label: 'Concluída' }
    ];
  }
};

// Função para buscar obra etapa com cache
export const getObraEtapaEnumCached = async (): Promise<EnumOption[]> => {
  const now = Date.now();
  
  if (obraEtapaCache && (now - obraEtapaCacheTime) < CACHE_DURATION) {
    return obraEtapaCache;
  }
  
  try {
    const obraEtapaOptions = await getObraEtapaEnum();
    
    obraEtapaCache = obraEtapaOptions;
    obraEtapaCacheTime = now;
    
    return obraEtapaOptions;
  } catch (error) {
    if (obraEtapaCache) {
      console.warn('Usando cache antigo de obra etapa devido a erro:', error);
      return obraEtapaCache;
    }
    
    console.error('Erro ao buscar obra etapa, usando valores padrão:', error);
    return [
      { name: 'ACESSO', label: 'Acesso' },
      { name: 'ESCORAMENTO', label: 'Escoramento' },
      { name: 'FORMA', label: 'Forma' },
      { name: 'ESPECIAIS', label: 'Especiais' }
    ];
  }
};

// Função para buscar complexidade com cache
export const getComplexidadeEnumCached = async (): Promise<EnumOption[]> => {
  const now = Date.now();
  
  if (complexidadeCache && (now - complexidadeCacheTime) < CACHE_DURATION) {
    return complexidadeCache;
  }
  
  try {
    const complexidadeOptions = await getComplexidadeEnum();
    
    complexidadeCache = complexidadeOptions;
    complexidadeCacheTime = now;
    
    return complexidadeOptions;
  } catch (error) {
    if (complexidadeCache) {
      console.warn('Usando cache antigo de complexidade devido a erro:', error);
      return complexidadeCache;
    }
    
    console.error('Erro ao buscar complexidade, usando valores padrão:', error);
    return [
      { name: 'ALTA', label: 'Alta' },
      { name: 'MÉDIA', label: 'Média' },
      { name: 'BAIXA', label: 'Baixa' }
    ];
  }
};

// ==========================================
// FUNÇÕES UTILITÁRIAS
// ==========================================

// Função para limpar todos os caches
export const clearAllEnumCaches = (): void => {
  statusEtapaCache = null;
  statusEtapaCacheTime = 0;
  obraEtapaCache = null;
  obraEtapaCacheTime = 0;
  complexidadeCache = null;
  complexidadeCacheTime = 0;
};

// Função para verificar se os caches estão válidos
export const areEnumCachesValid = (): boolean => {
  const now = Date.now();
  return (
    statusEtapaCache !== null && (now - statusEtapaCacheTime) < CACHE_DURATION &&
    obraEtapaCache !== null && (now - obraEtapaCacheTime) < CACHE_DURATION &&
    complexidadeCache !== null && (now - complexidadeCacheTime) < CACHE_DURATION
  );
};

// Função para obter label de um status específico
export const getStatusLabel = async (statusName: string): Promise<string> => {
  try {
    const statusOptions = await getStatusEtapaEnumCached();
    const statusOption = statusOptions.find(option => option.name === statusName);
    return statusOption ? statusOption.label : statusName;
  } catch (error) {
    console.error('Erro ao buscar label do status:', error);
    return statusName;
  }
};

// Função para obter label de uma obra etapa específica
export const getObraEtapaLabel = async (obraEtapaName: string): Promise<string> => {
  try {
    const obraEtapaOptions = await getObraEtapaEnumCached();
    const obraEtapaOption = obraEtapaOptions.find(option => option.name === obraEtapaName);
    return obraEtapaOption ? obraEtapaOption.label : obraEtapaName;
  } catch (error) {
    console.error('Erro ao buscar label da obra etapa:', error);
    return obraEtapaName;
  }
};

// Função para obter label de uma complexidade específica
export const getComplexidadeLabel = async (complexidadeName: string): Promise<string> => {
  try {
    const complexidadeOptions = await getComplexidadeEnumCached();
    const complexidadeOption = complexidadeOptions.find(option => option.name === complexidadeName);
    return complexidadeOption ? complexidadeOption.label : complexidadeName;
  } catch (error) {
    console.error('Erro ao buscar label da complexidade:', error);
    return complexidadeName;
  }
};

// Função para validar se um status é válido
export const isValidStatus = async (statusName: string): Promise<boolean> => {
  try {
    const statusOptions = await getStatusEtapaEnumCached();
    return statusOptions.some(option => option.name === statusName);
  } catch (error) {
    console.error('Erro ao validar status:', error);
    return false;
  }
};

// Função para validar se uma obra etapa é válida
export const isValidObraEtapa = async (obraEtapaName: string): Promise<boolean> => {
  try {
    const obraEtapaOptions = await getObraEtapaEnumCached();
    return obraEtapaOptions.some(option => option.name === obraEtapaName);
  } catch (error) {
    console.error('Erro ao validar obra etapa:', error);
    return false;
  }
};

// Função para validar se uma complexidade é válida
export const isValidComplexidade = async (complexidadeName: string): Promise<boolean> => {
  try {
    const complexidadeOptions = await getComplexidadeEnumCached();
    return complexidadeOptions.some(option => option.name === complexidadeName);
  } catch (error) {
    console.error('Erro ao validar complexidade:', error);
    return false;
  }
};

