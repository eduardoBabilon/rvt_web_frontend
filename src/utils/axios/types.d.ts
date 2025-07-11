import { DefaultResponse } from '@/service/types';
import { AxiosError } from 'axios';

export type CustomAxiosError = AxiosError<DefaultResponse<null>>;
