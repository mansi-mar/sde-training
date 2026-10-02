import { flattenToDotPath } from '@/lib/utils';

import type { APIProjectType, ProjectType } from '@/features/project/types';

export const transformApiProjectToProject = (
  projectData: APIProjectType,
): ProjectType => {
  return flattenToDotPath(projectData) as ProjectType;
};
