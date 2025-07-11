import { Filial, FilialResponse } from '@/@types/modules/users';
import { apiRequest } from '../api';

export const filialService = {
  getAllFiliais: async (): Promise<FilialResponse> => {
    const filiais = await apiRequest<Filial[]>('/filiais', {
      method: 'GET',
    });

    if (Array.isArray(filiais)) {
      return {
        data: filiais,
        total: filiais.length,
      };
    }

    return filiais as FilialResponse;
  },

  getFilialById: async (id: string): Promise<Filial> => {
    return apiRequest<Filial>(`/filiais/${id}`, {
      method: 'GET',
    });
  },

  getActiveFiliais: async (): Promise<FilialResponse> => {
    const filiais = await apiRequest<Filial[]>('/filiais?ativo=true', {
      method: 'GET',
    });

    if (Array.isArray(filiais)) {
      return {
        data: filiais,
        total: filiais.length,
      };
    }

    return filiais as FilialResponse;
  },
};