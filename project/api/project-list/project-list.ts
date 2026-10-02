import { api } from '@repo/api';

import { getProjectListingPath } from '@/features/project/constants';
import { ApiProjectListResponse } from '@features/project/types/project-list';

const fetchProjectListFromApi = async ({
  accountName,
}: {
  accountName: string;
  signal?: AbortSignal;
}): Promise<ApiProjectListResponse> => {
  return api.get<ApiProjectListResponse>(
    getProjectListingPath(accountName, 'resource_name'),
  );
};

export default fetchProjectListFromApi;
