import { showToast } from '@repo/ui/organisms';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { getProjectListKey } from '../../constants';
import { RemoveApiResponse } from '../../types/remove-project';

import type { RemoveProject } from '@features/project/services/remove-project/remove-project';

const useRemoveProject = (
  removeService: RemoveProject,
  accountName: string,
) => {
  const translation = useTranslations('account_onboarding');
  const queryClient = useQueryClient();

  return useMutation<RemoveApiResponse, Error, { projectName: string }>({
    mutationFn: async ({ projectName }: { projectName: string }) => {
      return removeService.removeProject({ accountName, projectName });
    },
    onSuccess: (project: RemoveApiResponse) => {
      queryClient.invalidateQueries({
        queryKey: [...getProjectListKey(accountName)],
      });
      queryClient.invalidateQueries({
        queryKey: ['account-list'],
      });
      showToast(
        'success',
        `${project?.project_name} ${translation('project_removed_successfully')}`,
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || translation('error_removing_project');
      showToast('error', errorMessage);
    },
  });
};

export default useRemoveProject;
