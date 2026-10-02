import { useQuery } from '@tanstack/react-query';

import { getProjectQueryKey } from '@/features/project/constants';

import type { GetProject } from '@/features/project/services';
import type { ProjectType } from '@/features/project/types';

export const useProject = (
  projectService: GetProject,
  data: { accountName: string; projectName: string | null },
  isModalMounted: boolean,
) => {
  const isValidProjectName = Boolean(
    data.projectName && data.projectName.trim(),
  );

  return useQuery<ProjectType, Error>({
    queryKey: getProjectQueryKey(data.accountName, data.projectName || ''),
    queryFn: () =>
      projectService.getProject(data.accountName, data.projectName),
    enabled: isModalMounted && isValidProjectName,
  });
};
