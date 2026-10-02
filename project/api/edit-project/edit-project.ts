import { api } from '@repo/api';

import type { APIProjectType } from '@/features/project/types';

export const editProjectFromApi = async (
  accountName: string,
  projectData: APIProjectType,
) => {
  return api.put<APIProjectType>(
    `/admin/accounts/${accountName}/projects/${projectData.project_name}`,
    projectData,
  );
};
