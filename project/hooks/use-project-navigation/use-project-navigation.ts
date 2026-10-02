import { useCallback } from 'react';

import { getProjectResourcesPath } from '@/features/project/constants/constant';
import { useClientRouter } from '@/hooks';
import { ProjectListTransformed } from '@features/project/types/project-list';

const useProjectNavigation = (accountName: string) => {
  const { navigate, prefetch, goBack } = useClientRouter();

  const navigateToAccounts = useCallback(() => {
    navigate('/accounts');
  }, [navigate]);

  const handleMouseEnter = useCallback(
    (project: ProjectListTransformed) => {
      prefetch(getProjectResourcesPath(accountName, project.projectName));
    },
    [prefetch, accountName],
  );

  const handleProjectRowClick = useCallback(
    (project: ProjectListTransformed) => {
      navigate(getProjectResourcesPath(accountName, project.projectName));
    },
    [accountName, navigate],
  );

  return {
    navigateToAccounts,
    handleProjectRowClick,
    goBack,
    handleMouseEnter,
  };
};

export default useProjectNavigation;
