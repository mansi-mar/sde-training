import { fetchProjectListFromApi } from '@features/project/api';
import { transformApiProjectsToProjects } from '@features/project/transforms';
import { ProjectService } from '@features/project/types/project-list';

const projectListService = (): ProjectService => {
  return {
    getProjectList: async (accountName, signal) => {
      const apiProjectList = await fetchProjectListFromApi({
        accountName,
        signal,
      });

      const projectList = transformApiProjectsToProjects(apiProjectList);

      return projectList;
    },
  };
};

export default projectListService;
