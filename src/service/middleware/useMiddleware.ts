import { withAuthInstance } from '@/utils/functions/auth';
import { mountUrl } from '@/utils/functions/url';
import Axios, { AxiosRequestConfig } from 'axios';
import { ApiRouteObject, Params, RoutesName } from '../types';
import { apiRoutes } from '../router';
import { baseUrl } from '@/constants/service';
import config from '../../config';
import { ContentType } from 'recharts/types/component/DefaultLegendContent';

const { X_API_KEY } = config.envs;

type RequestAxiosProps<PayloadType> = {
  selectedApi?: keyof typeof baseUrl;
  config?: AxiosRequestConfig;
  routeName?: RoutesName;
  payload?: PayloadType;
  directRouteObject?: ApiRouteObject;
  withAuth?: boolean;
  params?: Params;
  contentType?: ContentType
  query?: (Params | undefined)[];
};

export function useMiddleware() {
  async function requestAxios<ReturnDataType, PayloadType = null>({
    selectedApi = 'default',
    directRouteObject,
    config = {},
    routeName,
    payload,
    params,
    query,
    contentType
  }: RequestAxiosProps<PayloadType>) {
    try {
      // console.log('Initializing request with the following configuration:', {
      //   selectedApi,
      //   directRouteObject,
      //   routeName,
      //   config,
      //   payload,
      //   params,
      //   query,
      // });

      const { method, uri, listenHeaders } = directRouteObject
        ? directRouteObject
        : (apiRoutes[routeName ?? 'none'] as ApiRouteObject);

      if (!uri || !method) {
        console.error('API route configuration missing:', { uri, method });
        throw new Error('API route configuration is incomplete.');
      }

      const request = Axios.create({
  ...config,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': X_API_KEY,
    ...(config?.headers ?? {}),
  },
  withCredentials: true,  // Adicione esta linha
});

      // console.log('Axios instance created with headers:', request.defaults.headers);

      const urlWithParams = mountUrl(uri, baseUrl[selectedApi], params, query);
      // console.log('Constructed URL:', urlWithParams);

      if (!!listenHeaders && listenHeaders.includes('Authorization')) {
        // console.log('Adding authorization headers to the request.');
        withAuthInstance(request);
      }

      // console.log(`Sending ${method} request to ${urlWithParams} with payload:`, payload);

      let response;
      switch (method) {
        case 'GET':
          response = await request.get<ReturnDataType>(urlWithParams);
          break;
        case 'POST':
          response = await request.post<ReturnDataType>(urlWithParams, payload);
          break;
        case 'PUT':
          response = await request.put<ReturnDataType>(urlWithParams, payload);
          break;
        case 'DELETE':
          response = await request.delete<ReturnDataType>(urlWithParams, { data: payload });
          break;
        default:
          console.warn(`Unknown HTTP method "${method}". Defaulting to GET.`);
          response = await request.get<ReturnDataType>(urlWithParams);
          break;
      }

      // console.log('Request successful. Response:', response);
      return response;
    } catch (error) {
      console.error('Error occurred during the request:', error);

      if (Axios.isAxiosError(error)) {
        console.error('Axios-specific error details:', {
          message: error.message,
          code: error.code,
          config: error.config,
          response: error.response,
        });
      } else {
        console.error('Non-Axios error occurred:', error);
      }

      throw error; // Re-throw error for further handling if needed
    }
  }

  return { requestAxios };
}
