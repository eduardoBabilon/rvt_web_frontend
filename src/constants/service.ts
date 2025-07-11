import config from '@/config';

export const BASE_TOKEN_NAME = 'nasa.';

export const selectedTokenName = {
  base: BASE_TOKEN_NAME,
};

export const baseUrl = {
  default: config.envs.baseUrlApi,
  mcc: 'http://localhost:8080',
  localhost: '',
};
