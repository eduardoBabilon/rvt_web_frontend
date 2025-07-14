import { Perfil, PerfilResponse } from '@/@types/modules/users';
import { apiRequest } from '../api';

export const perfilService = {
  getAllPerfis: async (): Promise<PerfilResponse> => {
    const perfis = await apiRequest<Perfil[]>('/perfis', {
      method: 'GET',
    });

    if (Array.isArray(perfis)) {
      return {
        data: perfis,
        total: perfis.length,
      };
    }

    return perfis as PerfilResponse;
  },

  getPerfilById: async (id: string): Promise<Perfil> => {
    return apiRequest<Perfil>(`/perfil/${id}`, {
      method: 'GET',
    });
  },

  getActivePerfis: async (): Promise<PerfilResponse> => {
    const perfis = await apiRequest<Perfil[]>('/perfil?ativo=true', {
      method: 'GET',
    });

    if (Array.isArray(perfis)) {
      return {
        data: perfis,
        total: perfis.length,
      };
    }

    return perfis as PerfilResponse;
  },
};
