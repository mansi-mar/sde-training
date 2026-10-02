export const getProjectQueryKey = (accountName: string, projectKey: string) => [
  accountName,
  projectKey,
];

export const getProjectListKey = (accountName: string) => [
  `projects-list-${accountName}`,
];

export const getProjectListingPath = (accountName: string, filters: string) => {
  return `/admin/accounts/${accountName}?data_filter=${filters}`;
};

export const getAccountProjectsPath = (accountName: string) =>
  `/accounts/${accountName}/projects`;

export const getProjectResourcesPath = (
  accountName: string,
  projectName: string,
) => `/accounts/${accountName}/projects/${projectName}/resources`;

export enum ProjectLabels {
  name = 'projectName',
  owner = 'projectOwner',
  ownerEmail = 'projectOwnerEmail',
  description = 'projectDescription',
}
