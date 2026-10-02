import { showToast } from '@repo/ui/organisms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import {
  getProjectListKey,
  getProjectQueryKey,
} from '@/features/project/constants';

import type { EditProject } from '@/features/project/services';
import type { APIProjectType, ProjectType } from '@/features/project/types';

export const useEditProject = (projectService: EditProject) => {
  const t = useTranslations('account_onboarding');
  const queryClient = useQueryClient();

  return useMutation<
    APIProjectType,
    Error,
    { accountName: string; project: ProjectType }
  >({
    mutationFn: async ({ accountName, project }) => {
      return projectService.editProject(accountName, project);
    },
    onSuccess: (_, { accountName, project }) => {
      showToast('success', t('project_updated_successfully'));
      queryClient.invalidateQueries({
        queryKey: getProjectListKey(accountName),
      });
      queryClient.invalidateQueries({
        queryKey: getProjectQueryKey(accountName, project.project_name!),
      });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || t('error_updating_project');
      showToast('error', errorMessage);
    },
  });
};
