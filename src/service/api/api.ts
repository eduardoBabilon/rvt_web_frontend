import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/authConfig";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL_API || 'http://localhost:8080';


const msalInstance = new PublicClientApplication(msalConfig);

// Função para obter o token de autorização (produção)
const getAuthToken = (): string => {
  return localStorage.getItem('idToken') || '';
};

// Função para fazer requisições HTTP com lógica de ambiente
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  const isDev = process.env.NODE_ENV === 'development';

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.NEXT_PUBLIC_X_API_KEY || '',
  };

  if (isDev) {
    try {
      const account = msalInstance.getAllAccounts()[0];
        if (account) {
         defaultHeaders['X-User-Email'] = account.username;
         defaultHeaders['X-User-Name'] = account.name || account.username;
       }
    } catch (error) {
      console.warn('Erro ao obter dados do MSAL em desenvolvimento:', error);

      defaultHeaders['X-User-Email'] = 'dev@mills.com.br';
      defaultHeaders['X-User-Name'] = 'Usuário Desenvolvimento';
    }
  } else {
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return {} as T;
  } catch (error) {
    console.error('Erro na requisição API:', error);
    throw error;
  }
};

export const apiRequestWithRoute = async <T>(
  route: { method: string; uri: string },
  pathParams: Record<string, string> = {},
  queryParams: Record<string, string> = {},
  body?: any
): Promise<T> => {
  let endpoint = route.uri;
  
  // Substituir parâmetros de path
  Object.entries(pathParams).forEach(([key, value]) => {
    endpoint = endpoint.replace(`{${key}}`, encodeURIComponent(value));
  });

  // Adicionar query parameters
  if (Object.keys(queryParams).length > 0) {
    const params = new URLSearchParams(queryParams);
    endpoint += `?${params.toString()}`;
  }

  const options: RequestInit = {
    method: route.method,
  };

  if (body && (route.method === 'POST' || route.method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  return apiRequest<T>(endpoint, options);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('idToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('idToken');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return !!token;
};

// Função para configurar MSAL (deve ser chamada na inicialização da app)
export const configureMSAL = (msalInstance: PublicClientApplication): void => {
  // Esta função pode ser usada para configurar a instância MSAL
  // se necessário para os serviços
  console.log('MSAL configurado para os serviços de API');
};
