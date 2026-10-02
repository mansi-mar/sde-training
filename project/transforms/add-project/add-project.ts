import { buildNestedObjectFromFlat } from '@/lib/utils';

import type { APIProjectType, ProjectType } from '@/features/project/types';

// Combined function to transform both account and project data
export const transformForAddProjectAPI = (
  projectState: ProjectType,
): APIProjectType => {
  return buildNestedObjectFromFlat(projectState) as APIProjectType;
};
