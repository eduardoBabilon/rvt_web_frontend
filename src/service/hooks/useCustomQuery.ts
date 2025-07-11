import { useMiddleware } from '../middleware/useMiddleware';
import { CustomAxiosError } from '@/utils/axios/types';
import { QueryOptions } from '@/@types/reactQuery';
import { useQuery } from '@tanstack/react-query';
import { Params, RoutesName } from '../types';
import { baseUrl } from '@/constants/service';
import { AxiosRequestConfig } from 'axios';
import useAxiosUtils from '@/utils/axios/hooks/useAxiosUtils';
import { useEffect } from 'react';

export type CustomQueryProps<T> = {
  queryOptions?: QueryOptions<T, CustomAxiosError, T, readonly unknown[]>;
  onError?: (error: CustomAxiosError) => boolean | void;
  selectedApi?: keyof typeof baseUrl;
  axiosConfig?: AxiosRequestConfig<any>;
  queriesKeys: readonly unknown[];
  onSuccess?: (data?: T) => void;
  showSnackbarOnError?: boolean;
  throwOnError?: boolean;
  routeName: RoutesName;
  enabled?: boolean;
  params?: Params;
  query?: (Params | undefined)[];
};

export function useCustomQuery<ReturnData>({
  showSnackbarOnError = true,
  selectedApi = 'default',
  enabled = true,
  queryOptions,
  queriesKeys,
  axiosConfig,
  routeName,
  onSuccess,
  onError,
  params,
  query,
}: CustomQueryProps<ReturnData>) {
  const { requestAxios } = useMiddleware();
  const { handleAxiosError } = useAxiosUtils();
  async function handleQuery() {
    const { data } = await requestAxios<ReturnData, null>({
      config: axiosConfig,
      selectedApi,
      routeName,
      params,
      query,
    });
    onSuccess?.(data);
    return data;
  }
  const returnQuery = useQuery({
    queryKey: queriesKeys,
    queryFn: handleQuery,
    ...queryOptions,
    enabled,
  });

  useEffect(() => {
    if (returnQuery.isError) {
      if (showSnackbarOnError) handleAxiosError(returnQuery.error);
      onError?.(returnQuery.error);
    }
  }, [returnQuery.isError]);

  return returnQuery;
}
