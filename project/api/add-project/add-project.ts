import { api } from '@repo/api';

import type { APIProjectType } from '@/features/project/types';

export const addProjectFromApi = async (
  accountName: string,
  projectData: APIProjectType,
) => {
  return api.post<APIProjectType>(
    `/admin/accounts/${accountName}/projects/${projectData.project_name}`,
    projectData,
  );
};
