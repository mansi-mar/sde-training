import { describe, it, expect, vi, beforeEach } from 'vitest';

import { ApiError } from '@repo/api';
import { showToast } from '@repo/ui/organisms';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getProjectListKey } from '@/features/project/constants/constant';
import { getTranslation } from '@/tests/utils/translation-helper';

import { useAddProject } from './use-add-project';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useMutation: vi.fn(),
  useQueryClient: vi.fn(),
}));

vi.mock('@repo/ui/organisms', () => ({
  showToast: vi.fn(),
}));

const t = getTranslation('account_onboarding');

describe('useAddProject', () => {
  const mockAccountName = 'Test account';
  const addProjectService = {
    addProject: vi.fn(),
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

  it('calls addProjectService.addProject with the correct arguments', async () => {
    const project = { projectName: 'Test project' };
    const response = { data: 'Success' };

    // Mock the addProject method
    addProjectService.addProject.mockResolvedValue(response);

    const { mutationFn } = useAddProject(addProjectService);
    const result = await mutationFn({ accountName: mockAccountName, project });

    expect(addProjectService.addProject).toHaveBeenCalledWith(
      mockAccountName,
      project,
    );
    expect(result).toEqual(response);
  });

  it('shows a success toast and invalidates queries on success', async () => {
    const response = { data: 'Success' };

    // Mock the addProject method
    addProjectService.addProject.mockResolvedValue(response);

    const { onSuccess } = useAddProject(addProjectService);
    await onSuccess(response, { accountName: mockAccountName });

    // Check that the success toast was shown
    expect(showToast).toHaveBeenCalledWith(
      'success',
      t('project_added_successfully'),
    );

    // Check that the queries were invalidated
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: getProjectListKey(mockAccountName),
    });
  });

  it('shows an error toast with the correct detail on error', async () => {
    const project = { projectName: 'Test project' };
    const error = new ApiError(409, 'API error', {
      detail: 'Custom detail error message',
    });

    const { onError } = useAddProject(addProjectService);
    await onError(error, { accountName: mockAccountName, project });

    // Check that the error toast was shown with the custom message
    expect(showToast).toHaveBeenCalledWith(
      'error',
      'Custom detail error message',
    );
  });

  it('shows a default error toast when no custom message is provided', async () => {
    const project = { projectName: 'Test project' };
    const error = {};

    const { onError } = useAddProject(addProjectService);
    await onError(error, { project });

    // Check that the error toast was shown with the default message
    expect(showToast).toHaveBeenCalledWith(
      'error',
      t('error_creating_project'),
    );
  });
});
