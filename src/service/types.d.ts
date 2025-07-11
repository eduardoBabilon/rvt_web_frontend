import { apiRoutes } from './router';

export type RoutesName = keyof typeof apiRoutes;

export type HttpMethods = 'POST' | 'GET' | ' UPDATE' | 'DELETE' | 'PUT' | 'PATCH';

export type DefaultResponse<T> = {
  data: T;
  error: {
    code: number;
    message: string;
  };
  [key: string]: any;
};

export type MultiApiRouterObject = {
  [key: string]: {
    headers?: Record<string, string>;
    listenHeaders?: string[];
    method: HttpMethods;
    uri: string;
  };
};

export type ApiRouteObject = {
  listenHeaders?: string[];
  method: HttpMethods;
  uri: string;
};

export type DefaultResponse = {
  data: any;
  error: {
    code: number;
    message: string;
  };
  [key: string]: any;
};

export type Params = Record<string, string | string[] | number | number[] | boolean | boolean[] | null>;
