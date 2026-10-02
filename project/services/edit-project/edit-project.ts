import { editProjectFromApi } from '@/features/project/api';
import { transformForAddProjectAPI } from '@/features/project/transforms';

import type { APIProjectType, ProjectType } from '@/features/project/types';

export interface EditProject {
  editProject: (
    accountName: string,
    projectState: ProjectType,
  ) => Promise<APIProjectType>;
}

export const editProject = (): EditProject => {
  return {
    editProject: async (accountName, projectState) => {
      const projectData = transformForAddProjectAPI(projectState);

      const updatedProject = await editProjectFromApi(accountName, projectData);
      return updatedProject;
    },
  };
};
