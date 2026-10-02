import {
  ProjectTransform,
  ApiProjectListResponse,
} from '@/features/project/types/project-list';

const transformApiProjectsToProjects = (
  apiProjectList: ApiProjectListResponse,
): ProjectTransform => {
  const modifiedProjectApiResponse: ProjectTransform = {
    accountName: apiProjectList.account_name,
    accountOwner: apiProjectList.account_additional_info?.owner_name,
    projects: [],
  };
  apiProjectList.projects.forEach((project, index) => {
    modifiedProjectApiResponse.projects[index] = {
      projectName: project.project_name,
      projectId: project.ent_id,
      projectOwner: project.project_additional_info?.owner_name,
      totalResources: project.resources?.length ?? 0,
    };
  });
  return modifiedProjectApiResponse;
};

export default transformApiProjectsToProjects;
