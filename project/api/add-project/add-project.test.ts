import { describe, it, expect, vi } from 'vitest';

import { api } from '@repo/api';

import { addProjectFromApi } from './add-project';

import type { APIProjectType } from '@/features/project/types';

// Mock the API
vi.mock('@repo/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('addProjectFromApi', () => {
  const mockAccountName = 'test-account';
  const mockProjectData: APIProjectType = {
    project_name: 'test_project',
    project_additional_info: {
      owner_name: 'John Doe',
      owner_email_id: 'john@example.com',
    },
    project_description: 'A test project',
  };

  it('should send a POST request with correct parameters', async () => {
    const mockResponse = { data: mockProjectData };
    (api.post as unknown as vi.Mock).mockResolvedValue(mockResponse);

    const response = await addProjectFromApi(mockAccountName, mockProjectData);

    expect(api.post).toHaveBeenCalledWith(
      `/admin/accounts/${mockAccountName}/projects/${mockProjectData.project_name}`,
      mockProjectData,
    );

    expect(response).toEqual(mockResponse);
  });

  it('should handle API errors properly', async () => {
    const mockError = new Error('API error');
    (api.post as unknown as vi.Mock).mockRejectedValue(mockError);

    await expect(
      addProjectFromApi(mockAccountName, mockProjectData),
    ).rejects.toThrow('API error');

    expect(api.post).toHaveBeenCalledWith(
      `/admin/accounts/${mockAccountName}/projects/${mockProjectData.project_name}`,
      mockProjectData,
    );
  });
});
