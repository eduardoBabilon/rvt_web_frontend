import { useSnackbarContext } from '@/contexts/Snackbar';
import { CustomAxiosError } from '../types';

export default function useAxiosUtils() {
  const { dispatchSnackbar } = useSnackbarContext();
  function handleAxiosError(error: unknown) {
    const defaultMessageError = 'Tente novamente mais tarde';
    const typedError = error as CustomAxiosError;
    const responseData = typedError.response?.data;

    const responseError = responseData?.error;

    const descriptionError = responseError?.message ?? defaultMessageError;
    dispatchSnackbar({ message: descriptionError, type: 'error' });
    return { descriptionError };
  }

  return { handleAxiosError };
}
