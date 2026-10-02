import { describe, it, expect, vi } from 'vitest';

import { api } from '@repo/api';

import { editProjectFromApi } from './edit-project';

import type { APIProjectType } from '@/features/project/types';

// Mock the API
vi.mock('@repo/api', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('editProjectFromApi', () => {
  const mockAccountName = 'test_account';
  const mockProjectEditData: APIProjectType = {
    project_name: 'test_project',
    project_additional_info: {
      owner_name: 'John Doe',
      owner_email_id: 'john@example.com',
    },
    project_description: 'Updated description',
  };

  const mockUpdatedProject = {
    ...mockProjectEditData,
  };

  it('should send a PUT request with correct parameters', async () => {
    (api.put as unknown as vi.Mock).mockResolvedValue(mockUpdatedProject);

    const response = await editProjectFromApi(
      mockAccountName,
      mockProjectEditData,
    );

    expect(api.put).toHaveBeenCalledWith(
      `/admin/accounts/${mockAccountName}/projects/${mockProjectEditData.project_name}`,
      mockProjectEditData,
    );
    expect(response).toEqual(mockUpdatedProject);
  });

  it('should handle API errors properly', async () => {
    const mockError = new Error('API error');
    (api.put as unknown as vi.Mock).mockRejectedValue(mockError);

    await expect(
      editProjectFromApi(mockAccountName, mockProjectEditData),
    ).rejects.toThrow('API error');

    expect(api.put).toHaveBeenCalledWith(
      `/admin/accounts/${mockAccountName}/projects/${mockProjectEditData.project_name}`,
      mockProjectEditData,
    );
  });
});
