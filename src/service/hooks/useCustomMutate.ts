import { useQueryClient, useMutation } from '@tanstack/react-query';
import useAxiosUtils from '@/utils/axios/hooks/useAxiosUtils';
import { useMiddleware } from '../middleware/useMiddleware';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { MutateOptions } from '@/types/reactQuery';
import { Params, RoutesName } from '../types';

export type CustomMutationProps<T = any> = {
  mutateOptions?: MutateOptions<T, any, any, any>;
  multiInvalidateQueriesKeys?: unknown[][];
  onError?: (error: AxiosError<T>) => void;
  axiosConfig?: AxiosRequestConfig<any>;
  invalidateQueriesKeys?: unknown[];
  onSuccess?: (data?: T) => void;
  showSnackbarOnError?: boolean;
  setQueriesKeys?: unknown[];
  routeName: RoutesName;
  onErrorOptions?: {
    customMessageError?: string;
  };
};

export function useCustomMutate<ReturnData, Payload = any>({
  multiInvalidateQueriesKeys,
  invalidateQueriesKeys,
  onErrorOptions = {},
  showSnackbarOnError = true,
  axiosConfig = {},
  setQueriesKeys,
  mutateOptions,
  routeName,
  ...statusFunctions
}: CustomMutationProps<ReturnData>) {
  const { handleAxiosError } = useAxiosUtils();
  const { requestAxios } = useMiddleware();
  const queryClient = useQueryClient();

  function onError(error: AxiosError<any>) {
    if (showSnackbarOnError) handleAxiosError(error);
    statusFunctions.onError?.(error);
  }

  function onSuccess(data: ReturnData) {
    queryClient.invalidateQueries({
      queryKey: invalidateQueriesKeys,
      refetchType: 'all',
    });
    multiInvalidateQueriesKeys?.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key, refetchType: 'all' });
    });
    if (setQueriesKeys) queryClient.setQueryData(setQueriesKeys, data);
    statusFunctions.onSuccess?.(data);
  }

  function handleMutate({ payload, params }: { payload?: Payload; params?: Params }) {
    return requestAxios<ReturnData, typeof payload>({
      config: axiosConfig,
      routeName,
      payload,
      params,
    }).then((res) => res.data);
  }

  return useMutation({
    mutationFn: handleMutate,
    ...mutateOptions,
    onSuccess,
    onError,
  });
}
