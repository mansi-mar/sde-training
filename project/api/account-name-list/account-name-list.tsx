import { api } from '@repo/api';

import { ACCOUNT_PATH } from '@/constants';

export interface ApiAccountNameListResponse {
  account_name: string;
}

export const fetchAccountNameListFromApi = async (): Promise<
  ApiAccountNameListResponse[]
> => {
  return api.get<ApiAccountNameListResponse[]>(
    `${ACCOUNT_PATH}?data_filter=account`,
  );
};
