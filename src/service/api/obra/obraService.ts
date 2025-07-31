import { apiRequest } from '../api';
import { 
  Obra, 
  CreateObraRequest, 
  UpdateObraRequest, 
  ObraFilters,
  ObraPagedResponse,
  EnumOption
} from '@/types/modules/obra';

export const getAllObras = async (
  page: number = 0, 
  size: number = 20,
  filters: ObraFilters = {}
): Promise<ObraPagedResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());
    
    // Adicionar filtros se fornecidos
    if (filters.name_obra && filters.name_obra.trim()) {
      queryParams.append('name_obra', filters.name_obra.trim());
    }

    if (filters.numero_contrato && filters.numero_contrato.trim()) {
      queryParams.append('numero_contrato', filters.numero_contrato.trim());
    }
    
    if (filters.status_obra && filters.status_obra.trim()) {
      queryParams.append('status_obra', filters.status_obra.trim());
    }
    
    if (filters.filial_id && filters.filial_id.trim()) {
      queryParams.append('filial_id', filters.filial_id.trim());
    }
    
    if (filters.obra_tipo_id && filters.obra_tipo_id.trim()) {
      queryParams.append('obra_tipo_id', filters.obra_tipo_id.trim());
    }
    
    if (filters.cliente_id && filters.cliente_id.trim()) {
      queryParams.append('cliente_id', filters.cliente_id.trim());
    }

    console.log('Buscando obras com parâmetros:', queryParams.toString());

    const response = await apiRequest<ObraPagedResponse>(`/obras?${queryParams.toString()}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar obras:', error);
    throw error;
  }
};


// Função para buscar obra por ID
export const getObraById = async (id: string): Promise<Obra> => {
  try {
    const response = await apiRequest<Obra>(`/obras/${id}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error(`Erro ao buscar obra ${id}:`, error);
    throw error;
  }
};

// Função para criar nova obra
export const createObra = async (data: CreateObraRequest): Promise<Obra> => {
  try {
    const response = await apiRequest<Obra>('/obras', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error('Erro ao criar obra:', error);
    throw error;
  }
};

// Função para atualizar obra
export const updateObra = async (id: string, data: UpdateObraRequest): Promise<Obra> => {
  try {
    const response = await apiRequest<Obra>(`/obras/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error(`Erro ao atualizar obra ${id}:`, error);
    throw error;
  }
};

// Função para deletar obra
export const deleteObra = async (id: string): Promise<void> => {
  try {
    await apiRequest<void>(`/obras/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Erro ao deletar obra ${id}:`, error);
    throw error;
  }
};

// ===== FUNÇÕES DE ESTATÍSTICAS =====

// Função para buscar estatísticas das obras
export const getObrasStats = async (fiscalizadorId?: string): Promise<{
  total: number;
  mobilizando: number;
  em_andamento: number;
  desmobilizacao: number;
  concluida: number;
  recentes: number;
}> => {
  try {
    const queryParams = new URLSearchParams();
    
    const url = `/obras/stats${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await apiRequest<{
      total: number;
      mobilizando: number;
      em_andamento: number;
      desmobilizacao: number;
      concluida: number;
      recentes: number;
    }>(url, {
      method: 'GET'
    });
    
    return response;
  } catch (error) {
    console.error('Erro ao buscar estatísticas das obras:', error);
    throw error;
  }
};

// ===== FUNÇÕES AUXILIARES =====

// Função para buscar status de obra options
export const getStatusObraOptions = async (): Promise<EnumOption[]> => {
  try {
    const response = await apiRequest<EnumOption[]>('/enums/status-etapa', {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar status options:', error);
    // Fallback com valores padrão
    return [
      { name: 'MOBILIZANDO', label: 'Mobilizando' },
      { name: 'EM_ANDAMENTO', label: 'Em Andamento' },
      { name: 'DESMOBILIZACAO', label: 'Desmobilização' },
      { name: 'CONCLUIDA', label: 'Concluída' }
    ];
  }
};

// Função para buscar filiais options
export const getFilialOptions = async (): Promise<Array<{id: string, name: string}>> => {
  try {
    const response = await apiRequest<Array<{id: string, name: string}>>('/obras/filiais', {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar filiais:', error);
    throw error;
  }
};

// Função para buscar tipos de obra options
export const getObraTipoOptions = async (): Promise<Array<{id: string, tipo: string}>> => {
  try {
    const response = await apiRequest<Array<{id: string, tipo: string}>>('/obras/tipos', {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar tipos de obra:', error);
    throw error;
  }
};

export const getObrasWithFilters = getAllObras;

export const cleanObraFormData = (data: any): CreateObraRequest => {
  return {
    name_obra: data.name_obra?.trim() || '',
    numero_contrato: data.numero_contrato?.trim() || '',
    obra_tipo_id: data.obra_tipo_id,
    status_obra: data.status_obra,
    endereco: data.endereco?.trim() || '',
    filial_id: data.filial_id,
    cliente_id: data.cliente_id,
    data_inicio: data.data_inicio,
    data_fim: data.data_fim,
  };
};

