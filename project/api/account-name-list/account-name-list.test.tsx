import { describe, it, expect, vi } from 'vitest';

import { api } from '@repo/api';

import {
  fetchAccountNameListFromApi,
  ApiAccountNameListResponse,
} from './account-name-list';

// Mock the api.get method
vi.mock('@repo/api', () => ({
  api: {
    get: vi.fn(),
  },
  PORTAL_WEB_ENDPOINT: '',
}));

describe('fetchAccountNameListFromApi', () => {
  it('should return a list of account names on success', async () => {
    const mockResponse: ApiAccountNameListResponse[] = [
      { account_name: 'Account1' },
      { account_name: 'Account2' },
    ];

    // Mock the API response
    (api.get as vi.Mock).mockResolvedValueOnce(mockResponse);

    const result = await fetchAccountNameListFromApi();
    expect(result).toEqual(mockResponse);
    expect(api.get).toHaveBeenCalledWith('/admin/accounts?data_filter=account');
  });

  it('should throw an error when the API call fails', async () => {
    const errorMessage = 'Network Error';

    // Mock the API to reject with an error
    (api.get as vi.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchAccountNameListFromApi()).rejects.toThrow(errorMessage);
    expect(api.get).toHaveBeenCalledWith('/admin/accounts?data_filter=account');
  });
});
