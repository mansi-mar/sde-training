import { useQuery } from '@tanstack/react-query';

import { getProjectListKey } from '@/features/project/constants';
import {
  ProjectTransform,
  ProjectService,
} from '@features/project/types/project-list';

const useProjectList = (
  projectService: ProjectService,
  accountName: string,
) => {
  const { data, isLoading, isFetching, error, isError } = useQuery<
    ProjectTransform,
    Error
  >({
    queryKey: getProjectListKey(accountName),
    queryFn: ({ signal }) => projectService.getProjectList(accountName, signal),
    staleTime: 120000,
    retry: 2,
  });
  const projectListData = data ?? null;
  return { projectListData, isLoading, isFetching, error, isError };
};

export default useProjectList;
