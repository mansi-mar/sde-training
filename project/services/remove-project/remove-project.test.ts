import { describe, it, expect, vi, beforeEach } from 'vitest';

import removeProjectApi from '../../api/remove-project/remove-project';
import { RemoveApiResponse } from '../../types/remove-project';

import removeProject from './remove-project';

// Mock the removeProjectApi function
vi.mock('../../api/remove-project/remove-project', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('removeProject Service', () => {
  const accountName = 'testAccount';
  const projectName = 'testProject';

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should call removeProjectApi with the correct account and project names', async () => {
    const mockResponse: RemoveApiResponse = { success: true };
    (removeProjectApi as vi.Mock).mockResolvedValue(mockResponse);

    const { removeProject: remove } = removeProject();
    const response = await remove({ accountName, projectName });

    expect(removeProjectApi).toHaveBeenCalledWith({ accountName, projectName });
    expect(response).toEqual(mockResponse);
  });

  it('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error');
    (removeProjectApi as vi.Mock).mockRejectedValue(mockError);

    const { removeProject: remove } = removeProject();

    try {
      await remove({ accountName, projectName });
    } catch (error) {
      expect(error).toEqual(mockError);
    }

    expect(removeProjectApi).toHaveBeenCalledWith({ accountName, projectName });
  });
});
