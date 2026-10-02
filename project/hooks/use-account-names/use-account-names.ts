import { useQuery } from '@tanstack/react-query';

import type { AddProject } from '@/features/project/services';
import type { AccountItem } from '@/features/project/transforms';

export const useAccountNames = (
  accountService: AddProject,
  isEnabled?: boolean,
) => {
  const { data, isFetching } = useQuery<AccountItem[], Error>({
    queryKey: ['account-name-list'],
    queryFn: () => accountService.getAccountItems(),
    enabled: isEnabled,
  });
  return { accountNames: data, isFetching };
};

export default useAccountNames;
