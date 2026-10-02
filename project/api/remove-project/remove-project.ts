import { api } from '@repo/api';

import { RemoveApiResponse } from '@/features/project/types';

const removeProjectApi = async ({
  accountName,
  projectName,
}: {
  accountName: string;
  projectName: string;
}) => {
  return api.delete<RemoveApiResponse>(
    `/admin/accounts/${encodeURIComponent(accountName)}/projects/${encodeURIComponent(projectName)}`,
  );
};

export default removeProjectApi;
