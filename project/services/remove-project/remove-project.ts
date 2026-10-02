import removeProjectApi from '../../api/remove-project/remove-project';
import { RemoveApiResponse } from '../../types/remove-project';

export interface RemoveProject {
  removeProject: ({
    accountName,
    projectName,
  }: {
    accountName: string;
    projectName: string;
  }) => Promise<RemoveApiResponse>;
}

const removeProject = (): RemoveProject => {
  return {
    removeProject: async ({
      accountName,
      projectName,
    }: {
      accountName: string;
      projectName: string;
    }) => {
      const response = await removeProjectApi({ accountName, projectName });
      return response;
    },
  };
};

export default removeProject;
