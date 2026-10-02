import { describe, it, expect, vi, beforeEach } from 'vitest';

import { api } from '@repo/api';

import { RemoveApiResponse } from '@/features/project/types';

import removeProjectApi from './remove-project';

// Mock the api.delete function
vi.mock('@repo/api', () => ({
  api: {
    delete: vi.fn(),
  },
}));

describe('removeProjectApi', () => {
  const accountName = 'testAccount';
  const projectName = 'testProject';

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should call api.delete with the correct URL', async () => {
    const mockResponse: RemoveApiResponse = { success: true };
    (api.delete as vi.Mock).mockResolvedValue(mockResponse);

    const response = await removeProjectApi({ accountName, projectName });

    expect(api.delete).toHaveBeenCalledWith(
      `/admin/accounts/${encodeURIComponent(accountName)}/projects/${encodeURIComponent(projectName)}`,
    );
    expect(response).toEqual(mockResponse);
  });

  it('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error');
    (api.delete as vi.Mock).mockRejectedValue(mockError);

    try {
      await removeProjectApi({ accountName, projectName });
    } catch (error) {
      expect(error).toEqual(mockError);
    }

    expect(api.delete).toHaveBeenCalledWith(
      `/admin/accounts/${encodeURIComponent(accountName)}/projects/${encodeURIComponent(projectName)}`,
    );
  });
});
