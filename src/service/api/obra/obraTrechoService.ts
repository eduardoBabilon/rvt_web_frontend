import { 
  ObraTrecho, 
  CreateObraTrechoRequest, 
  UpdateObraTrechoRequest,
  ObraTrechoFilters,
  ObraTrechoPagedResponse,
  ObraTrechoFormData,
  cleanObraTrechoFormData
} from '@/types/modules/obraTrecho';
import { EnumOption } from '@/types/modules/obra';
import { apiRequest } from '../api';

// ==========================================
// SERVIÇOS PARA OBRA ETAPAS
// ==========================================

// Função para criar uma nova trecho de obra
export const createObraTrecho = async (obraTrechoData: CreateObraTrechoRequest): Promise<ObraTrecho> => {
  try {
    const response = await apiRequest<ObraTrecho>('/obra-trechos', {
      method: 'POST',
      body: JSON.stringify(obraTrechoData)
    });
    return response;
  } catch (error) {
    console.error('Erro ao criar trecho de obra:', error);
    throw error;
  }
};

// Função para criar múltiplas trechos de obra
export const createMultipleObraTrechos = async (trechosData: CreateObraTrechoRequest[]): Promise<ObraTrecho[]> => {
  try {
    const promises = trechosData.map(trecho => createObraTrecho(trecho));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('Erro ao criar múltiplas trechos de obra:', error);
    throw error;
  }
};

// Função para buscar trecho de obra por ID
export const getObraTrechoById = async (id: string): Promise<ObraTrecho> => {
  try {
    const response = await apiRequest<ObraTrecho>(`/obra-trechos/${id}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar trecho de obra:', error);
    throw error;
  }
};

// Função para listar todas as trechos de obra com paginação
export const getAllObraTrechos = async (page: number = 0, size: number = 20): Promise<ObraTrechoPagedResponse> => {
  try {
    const response = await apiRequest<ObraTrechoPagedResponse>(`/obra-trechos?page=${page}&size=${size}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao listar trechos de obra:', error);
    throw error;
  }
};

// Função para buscar trechos de obra por ID da obra
export const getObraTrechosByObraId = async (obraId: string): Promise<ObraTrecho[]> => {
  try {
    const response = await apiRequest<ObraTrecho[]>(`/obra-trechos/obra/${obraId}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar trechos da obra:', error);
    throw error;
  }
};

// Função para atualizar trecho de obra
export const updateObraTrecho = async (id: string, obraTrechoData: UpdateObraTrechoRequest): Promise<ObraTrecho> => {
  try {
    const response = await apiRequest<ObraTrecho>(`/obra-trechos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(obraTrechoData)
    });
    return response;
  } catch (error) {
    console.error('Erro ao atualizar trecho de obra:', error);
    throw error;
  }
};

// Função para excluir trecho de obra
export const deleteObraTrecho = async (id: string): Promise<void> => {
  try {
    await apiRequest<void>(`/obra-trechos/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Erro ao excluir trecho de obra:', error);
    throw error;
  }
};

// ==========================================
// SERVIÇOS PARA FILTROS E BUSCA
// ==========================================

// Função para buscar trechos com filtros
export const getObraTrechosWithFilters = async (filters: ObraTrechoFilters): Promise<ObraTrecho[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.nome_trecho) queryParams.append('nome_trecho', filters.nome_trecho);
    if (filters.endereco) queryParams.append('complexidade', filters.endereco);
    if (filters.obra_id) queryParams.append('obra_id', filters.obra_id);

    const response = await apiRequest<ObraTrecho[]>(`/obra-trechos?${queryParams.toString()}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar trechos com filtros:', error);
    throw error;
  }
};

// ==========================================
// SERVIÇOS PARA VALIDAÇÃO
// ==========================================

// Função para validar dados de trecho antes da submissão
export const validateObraTrechoData = async (trechoData: ObraTrechoFormData): Promise<{
  isValid: boolean;
  errors: string[];
}> => {
  const errors: string[] = [];

  // Validar campos obrigatórios
  if (!trechoData.nome_trecho || trechoData.nome_trecho.trim() === '') {
    errors.push('Nome da trecho é obrigatório');
  }

  if (!trechoData.endereco || trechoData.endereco.trim() === '') {
    errors.push('Complexidade é obrigatória');
  }

  if (!trechoData.obra_id || trechoData.obra_id.trim() === '') {
    errors.push('Obra é obrigatória');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// ==========================================
// SERVIÇOS PARA PROCESSAMENTO EM LOTE
// ==========================================

// Função para salvar múltiplas trechos de uma vez
export const saveObraTrechos = async (trechos: ObraTrechoFormData[]): Promise<{
  success: ObraTrecho[];
  errors: { index: number; error: string }[];
}> => {
  const success: ObraTrecho[] = [];
  const errors: { index: number; error: string }[] = [];

  for (let i = 0; i < trechos.length; i++) {
    try {
      const trecho = trechos[i];
      const cleanedData = cleanObraTrechoFormData(trecho);
      const savedTrecho = await createObraTrecho(cleanedData);
      success.push(savedTrecho);
    } catch (error) {
      console.error(`Erro ao salvar trecho ${i}:`, error);
      errors.push({
        index: i,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }

  return { success, errors };
};

// Função para verificar se uma trecho já existe para uma obra
export const checkTrechoExists = async (obraId: string, nomeTrecho: string): Promise<boolean> => {
  try {
    const trechos = await getObraTrechosByObraId(obraId);
    return trechos.some(trecho => trecho.nome_trecho === nomeTrecho);
  } catch (error) {
    console.error('Erro ao verificar se trecho existe:', error);
    return false;
  }
};


