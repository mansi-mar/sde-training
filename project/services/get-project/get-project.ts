import { getProjectFromApi } from '@/features/project/api';
import { transformApiProjectToProject } from '@/features/project/transforms';

import type { ProjectType } from '@/features/project/types';

export interface GetProject {
  getProject: (
    accountName: string,
    projectName: string | null,
  ) => Promise<ProjectType>;
}

export const getProject = (): GetProject => {
  return {
    getProject: async (accountName, projectName) => {
      if (!(projectName && projectName.trim())) {
        throw new Error('Account name cannot be empty');
      }
      // API call

      const project = await getProjectFromApi(accountName, projectName);

      const transformedProject = transformApiProjectToProject(project);
      return transformedProject;
    },
  };
};
