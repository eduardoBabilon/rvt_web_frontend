import { 
  ClienteEmpresa, 
  CreateClienteEmpresaRequest, 
  UpdateClienteEmpresaRequest,
  ClienteEmpresaFilters,
  ClienteEmpresaResponse,
  ClienteEmpresaFormData
} from '@/types/modules/clienteEmpresa';
import { apiRequest } from '../api';

// Função para listar todos os clientes
export const getAllClientes = async (): Promise<ClienteEmpresa[]> => {
  try {
    const response = await apiRequest<ClienteEmpresa[]>('/clientes', {
      method: 'GET'
    });
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

// Função para buscar clientes com filtros (preparada para implementação futura de paginação)
export const getClientesWithFilters = async (
  filters: ClienteEmpresaFilters = {},
  page: number = 0,
  size: number = 20,
  sort: string = 'nome_empresa,asc'
): Promise<ClienteEmpresa[]> => {
  try {
    // Por enquanto, como o backend não tem paginação implementada, 
    // vamos buscar todos e filtrar no frontend
    const allClientes = await getAllClientes();
    
    // Aplicar filtros localmente
    let filteredClientes = allClientes;
    
    if (filters.nome_empresa) {
      filteredClientes = filteredClientes.filter(cliente =>
        cliente.nome_empresa.toLowerCase().includes(filters.nome_empresa!.toLowerCase())
      );
    }
    
    if (filters.cnpj) {
      filteredClientes = filteredClientes.filter(cliente =>
        cliente.cnpj.includes(filters.cnpj!)
      );
    }
    
    if (filters.email) {
      filteredClientes = filteredClientes.filter(cliente =>
        cliente.email.toLowerCase().includes(filters.email!.toLowerCase())
      );
    }
    
    if (filters.ativo !== undefined) {
      filteredClientes = filteredClientes.filter(cliente =>
        cliente.ativo === filters.ativo
      );
    }
    
    // Aplicar ordenação
    const [sortField, sortDirection] = sort.split(',');
    filteredClientes.sort((a, b) => {
      let aValue: any = a[sortField as keyof ClienteEmpresa];
      let bValue: any = b[sortField as keyof ClienteEmpresa];
      
      // Converter para string para comparação
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
    
    return filteredClientes;
  } catch (error) {
    console.error('Erro ao buscar clientes com filtros:', error);
    throw error;
  }
};

// Função para validar CNPJ (verificar se já existe)
export const validateCNPJ = async (cnpj: string, excludeId?: string): Promise<boolean> => {
  try {
    const clientes = await getAllClientes();
    const exists = clientes.some(cliente => 
      cliente.cnpj === cnpj && cliente.id !== excludeId
    );
    return !exists; // Retorna true se NÃO existe (válido)
  } catch (error) {
    console.error('Erro ao validar CNPJ:', error);
    return false;
  }
};

interface ValidateCNPJResult {
  valid: boolean;
  error?: string;
}

export const validateCNPJFormat = (cnpj: string): ValidateCNPJResult => {
  const numbers = cnpj.replace(/\D/g, '');

  if (numbers.length !== 14) {
    return { valid: false, error: 'CNPJ deve conter 14 dígitos.' };
  }

  if (/^(\d)\1{13}$/.test(numbers)) {
    return { valid: false, error: 'CNPJ inválido: sequência repetida.' };
  }

  const calculateDigit = (numbers: string, weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(numbers.charAt(i), 10) * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digit1 = calculateDigit(numbers, weights1);
  if (digit1 !== parseInt(numbers.charAt(12), 10)) {
    return { valid: false, error: 'Primeiro dígito verificador inválido.' };
  }

  const digit2 = calculateDigit(numbers, weights2);
  if (digit2 !== parseInt(numbers.charAt(13), 10)) {
    return { valid: false, error: 'Segundo dígito verificador inválido.' };
  }

  return { valid: true };
};

// Função para validar Email (verificar se já existe)
export const validateEmail = async (email: string, excludeId?: string): Promise<boolean> => {
  try {
    const clientes = await getAllClientes();
    const exists = clientes.some(cliente => 
      cliente.email.toLowerCase() === email.toLowerCase() && cliente.id !== excludeId
    );
    return !exists; // Retorna true se NÃO existe (válido)
  } catch (error) {
    console.error('Erro ao validar email:', error);
    return false;
  }
};

// Função para buscar clientes ativos (para dropdowns)
export const getClientesAtivos = async (): Promise<ClienteEmpresa[]> => {
  try {
    const clientes = await getAllClientes();
    return clientes.filter(cliente => cliente.ativo);
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
    const clientes = await getAllClientes();
    return {
      total: clientes.length,
      ativos: clientes.filter(c => c.ativo).length,
      inativos: clientes.filter(c => !c.ativo).length,
      ultimosCadastrados: clientes
        .sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime())
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
