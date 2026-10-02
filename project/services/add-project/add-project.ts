import {
  addProjectFromApi,
  fetchAccountNameListFromApi,
} from '@/features/project/api';
import {
  transformApiAccountsToAccountItems,
  transformForAddProjectAPI,
} from '@/features/project/transforms';

import type { AccountItem } from '@/features/project/transforms';
import type { APIProjectType, ProjectType } from '@/features/project/types';

export interface AddProject {
  addProject: (
    accountName: string,
    projectState: ProjectType,
  ) => Promise<APIProjectType>;
  getAccountItems: () => Promise<AccountItem[]>;
}

export const addProject = (): AddProject => {
  return {
    addProject: async (accountName, projectState) => {
      const projectData = transformForAddProjectAPI(projectState);

      const newProject = await addProjectFromApi(accountName, projectData);
      return newProject;
    },
    getAccountItems: async () => {
      const accountName = await fetchAccountNameListFromApi();

      return transformApiAccountsToAccountItems(accountName);
    },
  };
};
