import { describe, it, expect, vi, beforeEach } from 'vitest';

import { showToast } from '@repo/ui/organisms';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getProjectListKey,
  getProjectQueryKey,
} from '@/features/project/constants/constant';
import { getTranslation } from '@/tests/utils/translation-helper';

import { useEditProject } from './use-edit-project';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@repo/ui/organisms', () => ({
  showToast: vi.fn(),
}));

const t = getTranslation('account_onboarding');

describe('useEditProject', () => {
  const mockAccountName = 'Test account';
  const editProjectService = {
    editProject: vi.fn(),
  };

  const queryClient = {
    invalidateQueries: vi.fn(),
  };

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock useQueryClient
    vi.mocked(useQueryClient).mockReturnValue(queryClient);

    // Mock useMutation
    vi.mocked(useMutation).mockImplementation((config) => ({
      mutate: vi.fn(),
      ...config,
    }));
  });

  it('calls editProjectService.editProject with the correct arguments', async () => {
    const project = { projectName: 'Test project' };
    const response = { data: 'Success' };

    // Mock the editProject method
    editProjectService.editProject.mockResolvedValue(response);

    const { mutationFn } = useEditProject(editProjectService);
    const result = await mutationFn({ accountName: mockAccountName, project });

    expect(editProjectService.editProject).toHaveBeenCalledWith(
      mockAccountName,
      project,
    );
    expect(result).toEqual(response);
  });

  it('shows a success toast and invalidates queries on success', async () => {
    const project = { project_name: 'Test project' };
    const response = { data: 'Success' };

    // Mock the editProject method
    editProjectService.editProject.mockResolvedValue(response);

    const { onSuccess } = useEditProject(editProjectService);
    await onSuccess(response, { accountName: mockAccountName, project });

    // Check that the success toast was shown
    expect(showToast).toHaveBeenCalledWith(
      'success',
      t('project_updated_successfully'),
    );

    // Check that the queries were invalidated
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: getProjectListKey(mockAccountName),
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: getProjectQueryKey(mockAccountName, project.project_name),
    });
  });

  it('shows an error toast with the correct message on error', async () => {
    const project = { project_name: 'Test project' };
    const error = {
      response: { data: { message: 'Custom error message' } },
    };

    const { onError } = useEditProject(editProjectService);
    await onError(error, { accountName: mockAccountName, project });

    // Check that the error toast was shown with the custom message
    expect(showToast).toHaveBeenCalledWith('error', 'Custom error message');
  });

  it('shows a default error toast when no custom message is provided', async () => {
    const project = { project_name: 'Test project' };
    const error = {};

    const { onError } = useEditProject(editProjectService);
    await onError(error, { project });

    // Check that the error toast was shown with the default message
    expect(showToast).toHaveBeenCalledWith(
      'error',
      t('error_updating_project'),
    );
  });
});
