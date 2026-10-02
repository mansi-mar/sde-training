interface Resources {
  resource_name: string;
}

interface ProjectAdditionalInfo {
  owner_email_id?: string;
  owner_name?: string;
}

interface AccountAdditionalInfo {
  owner_email_id?: string;
  owner_name?: string;
}

interface ProjectList {
  project_name: string;
  ent_id: string;
  project_additional_info?: ProjectAdditionalInfo;
  resources?: Resources[];
}

interface ProjectListTransformed {
  projectName: string;
  projectId: string;
  projectOwner?: string;
  totalResources?: number;
}

interface ApiProjectListResponse {
  account_name: string;
  account_additional_info: AccountAdditionalInfo;
  projects: ProjectList[];
}

interface ProjectTransform {
  accountName: string;
  accountOwner?: string;
  projects: ProjectListTransformed[];
}

interface ProjectService {
  getProjectList: (
    accountName: string,
    signal?: AbortSignal,
  ) => Promise<ProjectTransform>;
}

type TranslatedColumns = {
  projectName: string;
  projectId: string;
  projectOwner: string;
  totalResources: string;
  mapResources: string;
  editProject: string;
  removeProject: string;
};

export type {
  ApiProjectListResponse,
  ProjectTransform,
  ProjectService,
  ProjectListTransformed,
  TranslatedColumns,
};
