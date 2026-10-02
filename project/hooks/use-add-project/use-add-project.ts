import { ApiError } from '@repo/api';
import { showToast } from '@repo/ui/organisms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { getProjectListKey } from '@/features/project/constants';

import type { AddProject } from '@/features/project/services';
import type { APIProjectType, ProjectType } from '@/features/project/types';

export const useAddProject = (projectService: AddProject) => {
  const t = useTranslations('account_onboarding');
  const queryClient = useQueryClient();

  return useMutation<
    APIProjectType,
    Error,
    { accountName: string; project: ProjectType }
  >({
    mutationFn: async ({ accountName, project }) => {
      return projectService.addProject(accountName, project);
    },
    onSuccess: (_, { accountName }) => {
      showToast('success', t('project_added_successfully'));
      queryClient.invalidateQueries({
        queryKey: getProjectListKey(accountName),
      });
    },
    onError: (error: any) => {
      let errorMessage = t('error_creating_project');
      if (error instanceof ApiError) {
        errorMessage = error.data.detail || error.message;
      }
      showToast('error', errorMessage);
    },
  });
};
