import type { ApiAccountNameListResponse } from '@/features/project/api';

export interface AccountItem {
  label: string;
  value: string;
}

export const transformApiAccountsToAccountItems = (
  apiAccountList: ApiAccountNameListResponse[],
): AccountItem[] => {
  const accounts: AccountItem[] = [];
  apiAccountList.forEach((account) => {
    accounts.push({ label: account.account_name, value: account.account_name });
  });
  return accounts;
};
