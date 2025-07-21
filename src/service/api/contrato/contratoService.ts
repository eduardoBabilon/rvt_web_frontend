import { 
  Contrato, 
  CreateContratoRequest, 
  UpdateContratoRequest,
  ContratoFilters,
  ContratoPagedResponse,
  ContratoFormData
} from '@/types/modules/contrato';
import { apiRequest } from '../api';

// Função para listar todos os contratos
export const getAllContratos = async (): Promise<Contrato[]> => {
  try {
    const response = await apiRequest<ContratoPagedResponse>('/contratos', {
      method: 'GET'
    });
    // Se o backend retornar paginação, extrair o content
    if (response && typeof response === 'object' && 'content' in response) {
      return response.content;
    }
    // Se retornar array direto
    return response as unknown as Contrato[];
  } catch (error) {
    console.error('Erro ao buscar contratos:', error);
    throw error;
  }
};

// Função para buscar contratos com paginação
export const getContratosPaginated = async (
  page: number = 0,
  size: number = 20,
  sort: string = 'numero_contrato,asc'
): Promise<ContratoPagedResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: sort
    });

    const response = await apiRequest<ContratoPagedResponse>(`/contratos?${params}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error('Erro ao buscar contratos paginados:', error);
    throw error;
  }
};

// Função para buscar contrato por ID
export const getContratoById = async (id: string): Promise<Contrato> => {
  try {
    const response = await apiRequest<Contrato>(`/contratos/${id}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error(`Erro ao buscar contrato ${id}:`, error);
    throw error;
  }
};

// Função para buscar contratos por cliente
export const getContratosByClienteId = async (clienteId: string): Promise<Contrato[]> => {
  try {
    const response = await apiRequest<Contrato[]>(`/contratos/cliente/${clienteId}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error(`Erro ao buscar contratos do cliente ${clienteId}:`, error);
    throw error;
  }
};

// Função para criar novo contrato
export const createContrato = async (data: CreateContratoRequest): Promise<Contrato> => {
  try {
    const response = await apiRequest<Contrato>('/contratos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error('Erro ao criar contrato:', error);
    throw error;
  }
};

// Função para atualizar contrato
export const updateContrato = async (id: string, data: UpdateContratoRequest): Promise<Contrato> => {
  try {
    const response = await apiRequest<Contrato>(`/contratos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error(`Erro ao atualizar contrato ${id}:`, error);
    throw error;
  }
};

// Função para deletar contrato
export const deleteContrato = async (id: string): Promise<void> => {
  try {
    await apiRequest<void>(`/contratos/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Erro ao deletar contrato ${id}:`, error);
    throw error;
  }
};

// Função para buscar contratos com filtros
export const getContratosWithFilters = async (
  filters: ContratoFilters = {},
  page: number = 0,
  size: number = 20,
  sort: string = 'numero_contrato,asc'
): Promise<Contrato[]> => {
  try {
    // Por enquanto, como o backend pode não ter filtros implementados,
    // vamos buscar todos e filtrar no frontend
    const allContratos = await getAllContratos();
    
    // Aplicar filtros localmente
    let filteredContratos = allContratos;
    
    if (filters.numero_contrato) {
      filteredContratos = filteredContratos.filter(contrato =>
        contrato.numero_contrato.includes(filters.numero_contrato!)
      );
    }
    
    if (filters.cliente_empresa_nome) {
      filteredContratos = filteredContratos.filter(contrato =>
        contrato.cliente_empresa_nome.toLowerCase().includes(filters.cliente_empresa_nome!.toLowerCase())
      );
    }
    
    if (filters.cliente_empresa_id) {
      filteredContratos = filteredContratos.filter(contrato =>
        contrato.cliente_empresa_id === filters.cliente_empresa_id
      );
    }
    
    if (filters.data_inicio_from) {
      filteredContratos = filteredContratos.filter(contrato =>
        new Date(contrato.data_inicio) >= new Date(filters.data_inicio_from!)
      );
    }
    
    if (filters.data_inicio_to) {
      filteredContratos = filteredContratos.filter(contrato =>
        new Date(contrato.data_inicio) <= new Date(filters.data_inicio_to!)
      );
    }
    
    if (filters.data_fim_from) {
      filteredContratos = filteredContratos.filter(contrato =>
        new Date(contrato.data_fim) >= new Date(filters.data_fim_from!)
      );
    }
    
    if (filters.data_fim_to) {
      filteredContratos = filteredContratos.filter(contrato =>
        new Date(contrato.data_fim) <= new Date(filters.data_fim_to!)
      );
    }
    
    // Aplicar ordenação
    const [sortField, sortDirection] = sort.split(',');
    filteredContratos.sort((a, b) => {
      let aValue: any = a[sortField as keyof Contrato];
      let bValue: any = b[sortField as keyof Contrato];
      
      // Tratamento especial para datas
      if (sortField.includes('data_')) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
    
    return filteredContratos;
  } catch (error) {
    console.error('Erro ao buscar contratos com filtros:', error);
    throw error;
  }
};

// Função para validar número do contrato (verificar se já existe)
export const validateNumeroContrato = async (numeroContrato: string, excludeId?: string): Promise<boolean> => {
  try {
    const contratos = await getAllContratos();
    const exists = contratos.some(contrato => 
      contrato.numero_contrato === numeroContrato && contrato.id !== excludeId
    );
    return !exists; // Retorna true se NÃO existe (válido)
  } catch (error) {
    console.error('Erro ao validar número do contrato:', error);
    return false;
  }
};

// Função para buscar estatísticas de contratos
export const getContratosStats = async () => {
  try {
    const contratos = await getAllContratos();
    const now = new Date();
    
    const ativos = contratos.filter(c => {
      const inicio = new Date(c.data_inicio);
      const fim = new Date(c.data_fim);
      return now >= inicio && now <= fim;
    });
    
    const pendentes = contratos.filter(c => {
      const inicio = new Date(c.data_inicio);
      return now < inicio;
    });
    
    const finalizados = contratos.filter(c => {
      const fim = new Date(c.data_fim);
      return now > fim;
    });
    
    return {
      total: contratos.length,
      ativos: ativos.length,
      pendentes: pendentes.length,
      finalizados: finalizados.length,
      ultimosCadastrados: contratos
        .sort((a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime())
        .slice(0, 5)
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas de contratos:', error);
    throw error;
  }
};

// Função para buscar contratos por status
export const getContratosByStatus = async (status: 'pendente' | 'ativo' | 'finalizado'): Promise<Contrato[]> => {
  try {
    const contratos = await getAllContratos();
    const now = new Date();
    
    return contratos.filter(contrato => {
      const inicio = new Date(contrato.data_inicio);
      const fim = new Date(contrato.data_fim);
      
      switch (status) {
        case 'pendente':
          return now < inicio;
        case 'ativo':
          return now >= inicio && now <= fim;
        case 'finalizado':
          return now > fim;
        default:
          return false;
      }
    });
  } catch (error) {
    console.error(`Erro ao buscar contratos ${status}:`, error);
    throw error;
  }
};

// Função para limpar dados do formulário antes da submissão
export const cleanContratoFormData = (data: ContratoFormData): CreateContratoRequest => {
  return {
    numero_contrato: data.numero_contrato.replace(/\D/g, ''),
    data_inicio: data.data_inicio,
    data_fim: data.data_fim,
    cliente_empresa_id: data.cliente_empresa_id
  };
};

// Função para verificar conflitos de datas
export const checkDateConflicts = async (
  dataInicio: string, 
  dataFim: string, 
  clienteId: string, 
  excludeContratoId?: string
): Promise<Contrato[]> => {
  try {
    const contratosCliente = await getContratosByClienteId(clienteId);
    
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    return contratosCliente.filter(contrato => {
      if (excludeContratoId && contrato.id === excludeContratoId) {
        return false; // Excluir o próprio contrato na edição
      }
      
      const contratoInicio = new Date(contrato.data_inicio);
      const contratoFim = new Date(contrato.data_fim);
      
      // Verificar sobreposição de datas
      return (inicio <= contratoFim && fim >= contratoInicio);
    });
  } catch (error) {
    console.error('Erro ao verificar conflitos de datas:', error);
    return [];
  }
};

// Função para obter próximos contratos a vencer
export const getContratosVencendo = async (diasAntecedencia: number = 30): Promise<Contrato[]> => {
  try {
    const contratos = await getAllContratos();
    const now = new Date();
    const limitDate = new Date();
    limitDate.setDate(now.getDate() + diasAntecedencia);
    
    return contratos.filter(contrato => {
      const fim = new Date(contrato.data_fim);
      return fim >= now && fim <= limitDate;
    }).sort((a, b) => new Date(a.data_fim).getTime() - new Date(b.data_fim).getTime());
  } catch (error) {
    console.error('Erro ao buscar contratos vencendo:', error);
    throw error;
  }
};