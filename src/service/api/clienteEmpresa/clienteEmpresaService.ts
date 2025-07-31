import { 
  ClienteEmpresa, 
  CreateClienteEmpresaRequest, 
  UpdateClienteEmpresaRequest,
  ClienteEmpresaFilters,
  ClienteEmpresaResponse,
  ClienteEmpresaFormData,
  ProgressCallback,
  ImportacaoLoteResponse
} from '@/types/modules/clienteEmpresa';
import { apiRequest } from '../api';


export const getAllClientes = async (
  page: number = 0,
  size: number = 10,
  filters: ClienteEmpresaFilters = {}
): Promise<ClienteEmpresaResponse> => {
  try {
    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('size', size.toString());

    if (filters.searchTerm) {
      params.append('searchTerm', filters.searchTerm);
    }

    const response = await apiRequest<ClienteEmpresaResponse>(
      `/clientes?${params.toString()}`,
      {
        method: 'GET'
      }
    );

    return response;
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    throw error;
  }
};


// Função para buscar cliente por ID
export const getClienteById = async (id: string): Promise<ClienteEmpresa> => {
  try {
    const response = await apiRequest<ClienteEmpresa>(`/clientes/${id}`, {
      method: 'GET'
    });
    return response;
  } catch (error) {
    console.error(`Erro ao buscar cliente ${id}:`, error);
    throw error;
  }
};

// Função para criar novo cliente
export const createCliente = async (data: CreateClienteEmpresaRequest): Promise<ClienteEmpresa> => {
  try {
    const response = await apiRequest<ClienteEmpresa>('/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw error;
  }
};

// Função para atualizar cliente
export const updateCliente = async (id: string, data: UpdateClienteEmpresaRequest): Promise<ClienteEmpresa> => {
  try {
    const response = await apiRequest<ClienteEmpresa>(`/clientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return response;
  } catch (error) {
    console.error(`Erro ao atualizar cliente ${id}:`, error);
    throw error;
  }
};

// Função para deletar cliente
export const deleteCliente = async (id: string): Promise<void> => {
  try {
    await apiRequest<void>(`/clientes/${id}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error(`Erro ao deletar cliente ${id}:`, error);
    throw error;
  }
};


// Função para criar clientes em lote
export const createClientesLote = async (
  clientes: CreateClienteEmpresaRequest[],
  onProgress?: ProgressCallback
): Promise<ImportacaoLoteResponse> => {
  try {
    const response = await apiRequest<ImportacaoLoteResponse>('/clientes/lote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clientes })
      });
      return response;
  } catch (error) {
    console.error('Erro ao criar clientes em lote:', error);
    throw error;
  }
};

// Função para criar clientes sequencialmente (fallback)
const createClientesSequencial = async (
  clientes: CreateClienteEmpresaRequest[],
  onProgress?: ProgressCallback
): Promise<ImportacaoLoteResponse> => {
  const sucessos: ClienteEmpresa[] = [];
  const erros: { cliente: CreateClienteEmpresaRequest; cnpj: string; erro: string; }[] = [];
  
  for (let i = 0; i < clientes.length; i++) {
    const cliente = clientes[i];
    
    try {
      const clienteCriado = await createCliente(cliente);
      sucessos.push(clienteCriado);
    } catch (error: any) {
      erros.push({
        cliente,
        cnpj: cliente.cnpj,
        erro: error.message || 'Erro desconhecido'
      });
    }
    
    // Atualizar progresso
    if (onProgress) {
      const progresso = ((i + 1) / clientes.length) * 100;
      onProgress(progresso);
    }
    
    // Pequena pausa para não sobrecarregar o servidor
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return {
    sucessos,
    erros,
    total_processados: clientes.length,
    total_sucessos: sucessos.length,
    total_erros: erros.length
  };
};

// Função para validar CNPJ no backend (verificar duplicatas)
export const validateCNPJBackend = async (cnpj: string, excludeId?: string): Promise<{
  valido: boolean;
  erro?: string;
}> => {
  try {
    const response = await apiRequest<{ valido: boolean; erro?: string }>('/clientes/validate-cnpj', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cnpj, excludeId })
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};

// Função para validar lista de CNPJs em lote
export const validateCNPJsLote = async (cnpjs: string[]): Promise<{
  [cnpj: string]: {
    valido: boolean;
    erro?: string;
  }
}> => {
  try {
    const response = await apiRequest<{
      [cnpj: string]: {
        valido: boolean;
        erro?: string;
      }
    }>('/clientes/validate-cnpjs-lote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cnpjs })
    });
    return response;
  } catch (error: any) {
    throw error;
  }
};


// Função para validar CNPJ (verificar se já existe)
export const validateCNPJ = async (cnpj: string, excludeId?: string): Promise<boolean> => {
  try {
    const response = await getAllClientes(0, 1000, { cnpj });
    const exists = response.content.some(cliente => 
      cliente.cnpj === cnpj && cliente.id !== excludeId
    );
    return !exists;
  } catch (error) {
    console.error('Erro ao validar CNPJ:', error);
    return false;
  }
};



// Função para validar Email (verificar se já existe)
export const validateEmail = async (email: string, excludeId?: string): Promise<boolean> => {
  try {
    const response = await getAllClientes(0, 1000, { email });
    const exists = response.content.some(cliente => 
      cliente.email.toLowerCase() === email.toLowerCase() && cliente.id !== excludeId
    );
    return !exists;
  } catch (error) {
    console.error('Erro ao validar email:', error);
    return false;
  }
};


// Função para buscar clientes ativos (para dropdowns)
export const getClientesAtivos = async (): Promise<ClienteEmpresa[]> => {
  try {
    const ativos: ClienteEmpresa[] = [];
    let page = 0;
    let last = false;

    while (!last) {
      const response = await getAllClientes(page, 100, { ativo: true });
      ativos.push(...response.content);
      last = response.last;
      page++;
    }

    return ativos;
  } catch (error) {
    console.error('Erro ao buscar clientes ativos:', error);
    throw error;
  }
};


// Função para ativar/desativar cliente
export const toggleClienteStatus = async (id: string, ativo: boolean): Promise<ClienteEmpresa> => {
  try {
    return await updateCliente(id, { ativo });
  } catch (error) {
    console.error(`Erro ao ${ativo ? 'ativar' : 'desativar'} cliente ${id}:`, error);
    throw error;
  }
};

// Função para buscar estatísticas de clientes
export const getClientesStats = async () => {
  try {
    const allClientes: ClienteEmpresa[] = [];
    let page = 0;
    let last = false;

    while (!last) {
      const response = await getAllClientes(page, 100);
      allClientes.push(...response.content);
      last = response.last;
      page++;
    }

    return {
      total: allClientes.length,
      ativos: allClientes.filter(c => c.ativo).length,
      inativos: allClientes.filter(c => !c.ativo).length,
      ultimosCadastrados: allClientes
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    };
  } catch (error) {
    console.error('Erro ao buscar estatísticas de clientes:', error);
    throw error;
  }
};


// Função para limpar dados do formulário antes da submissão
export const cleanClienteEmpresaFormData = (data: ClienteEmpresaFormData): CreateClienteEmpresaRequest => {
  return {
    nome_empresa: data.nome_empresa.trim(),
    cnpj: data.cnpj.replace(/\D/g, ''),
    contato_nome: data.contato_nome?.trim() || undefined,
    contato_telefone: data.contato_telefone?.replace(/\D/g, '') || undefined,
    email: data.email.trim().toLowerCase()
  };
};

