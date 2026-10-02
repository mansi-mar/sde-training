import { useCallback, useMemo } from 'react';

import {
  useProjectList,
  useProjectSelection,
  useProjectNavigation,
  useErrorTranslations,
} from '@/features/project/hooks';
import { useErrorNotification } from '@/hooks';
import { projectListService } from '@features/project/services';
import { ProjectListTransformed } from '@features/project/types/project-list';

// Service initialization
const projectService = projectListService();

const useProjectContent = (
  accountName: string,
  onMapResourceHandler: (projectName: string) => void,
) => {
  const {
    selectedProject,
    handleSelectedProject,
    handleResetProject,
    handleRemoveProject,
  } = useProjectSelection(accountName);
  const {
    navigateToAccounts,
    handleProjectRowClick,
    handleMouseEnter,
    goBack,
  } = useProjectNavigation(accountName);

  const { projectListData, isLoading, isFetching, error, isError } =
    useProjectList(projectService, accountName);

  const { errorNotificationTranslations } = useErrorTranslations();

  useErrorNotification({
    isError,
    title: errorNotificationTranslations.title,
    description: errorNotificationTranslations.description,
    status: JSON.parse(JSON.stringify(error))?.status,
    handleServerError: navigateToAccounts,
  });

  const handleMapResourcesClick = useCallback(
    (project: ProjectListTransformed) => {
      onMapResourceHandler(project.projectName);
    },
    [onMapResourceHandler],
  );

  const tableOperations = useMemo(
    () => ({
      searchKey: 'projectName',
      desc: false,
      isSorting: true,
    }),
    [],
  );

  const tableEventHandler = useMemo(
    () => ({
      editProject: handleSelectedProject,
      rowEvent: handleProjectRowClick,
      hover: handleMouseEnter,
      mapResources: handleMapResourcesClick,
      removeProject: handleRemoveProject,
    }),
    [
      handleSelectedProject,
      handleProjectRowClick,
      handleMapResourcesClick,
      handleMouseEnter,
      handleRemoveProject,
    ],
  );

  return {
    projectListData,
    isLoading,
    isFetching,
    selectedProject,
    goBack,
    handleResetProject,
    tableEventHandler,
    tableOperations,
  };
};

export default useProjectContent;
