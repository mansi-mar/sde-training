import { describe, it, expect, vi } from 'vitest';

import { api } from '@repo/api';

import { getProjectFromApi } from './get-project';

import type { APIProjectType } from '@/features/project/types';

// Mock the API
vi.mock('@repo/api', () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe('getProjectFromApi', () => {
  const mockAccountName = 'test_account';
  const mockProjectData: APIProjectType = {
    project_name: 'test_project',
    project_additional_info: {
      owner_name: 'John Doe',
      owner_email_id: 'john@example.com',
    },
    project_description: 'A test project',
  };

  it('should send a GET request with correct parameters', async () => {
    (api.get as unknown as vi.Mock).mockResolvedValue(mockProjectData);

    const response = await getProjectFromApi(
      mockAccountName,
      mockProjectData.project_name,
    );

    expect(api.get).toHaveBeenCalledWith(
      `/admin/accounts/${mockAccountName}/projects/${mockProjectData.project_name}`,
    );
    expect(response).toEqual(mockProjectData);
  });

  it('should handle API errors properly', async () => {
    const mockError = new Error('API error');
    (api.get as unknown as vi.Mock).mockRejectedValue(mockError);

    await expect(
      getProjectFromApi(mockAccountName, mockProjectData.project_name),
    ).rejects.toThrow('API error');

    expect(api.get).toHaveBeenCalledWith(
      `/admin/accounts/${mockAccountName}/projects/${mockProjectData.project_name}`,
    );
  });
});
