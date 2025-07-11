import { useCustomMutate } from '@/service/hooks/useCustomMutate';

import { useCustomQuery } from '@/service/hooks/useCustomQuery';
import { GetUserData } from '@/service/users/returnData';

export function useAuthServices() {
  const currentUser = useCustomQuery<GetUserData>({
    enabled: false,
    queriesKeys: ['currentUser'],
    routeName: 'getCurrentUser',
    queryOptions: {
      retry: false,
    },
  });

  return { currentUser };
}
