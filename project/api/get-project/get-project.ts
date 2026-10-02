import { api } from '@repo/api';

import type { APIProjectType } from '@/features/project/types';

export const getProjectFromApi = async (
  accountName: string,
  projectName: string,
) => {
  return api.get<APIProjectType>(
    `/admin/accounts/${accountName}/projects/${projectName}`,
  );
};
