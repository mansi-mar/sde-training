import { describe, it, expect, vi, beforeEach } from 'vitest';

import { api } from '@repo/api';

import { fetchProjectListFromApi } from '@features/project/api';
import { ApiProjectListResponse } from '@features/project/types/project-list';

// Mock the API module
vi.mock('@repo/api', async () => {
  const actual = await vi.importActual<typeof import('@repo/api')>('@repo/api');

  return {
    ...actual,
    api: {
      get: vi.fn(),
    },
    PORTAL_WEB_ENDPOINT: '',
  };
});

describe('fetchProjectListFromApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch project list successfully', async () => {
    const mockApiResponse: ApiProjectListResponse = {
      account_name: 'Test Account',
      account_owner: 'Owner Name',
      projects: [
        {
          project_name: 'Project 1',
          project_additional_info: {
            owner_name: 'Owner 1',
          },
          resources: [{ resource_name: 'Resource 1' }],
        },
      ],
    };

    vi.mocked(api.get).mockResolvedValue(mockApiResponse);

    const result = await fetchProjectListFromApi({
      accountName: 'Test Account',
    });

    expect(api.get).toHaveBeenCalledWith(
      '/admin/accounts/Test Account?data_filter=resource_name',
    );
    expect(result).toEqual(mockApiResponse);
  });

  it('should handle API errors', async () => {
    const mockError = new Error('API Error');
    vi.mocked(api.get).mockRejectedValue(mockError);

    await expect(
      fetchProjectListFromApi({ accountName: 'Test Account' }),
    ).rejects.toThrow('API Error');
  });
});
