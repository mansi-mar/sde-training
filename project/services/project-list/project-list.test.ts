import { describe, it, expect, vi, beforeEach } from 'vitest';

import { fetchProjectListFromApi } from '@features/project/api';
import { projectListService } from '@features/project/services';
import { transformApiProjectsToProjects } from '@features/project/transforms';

// Mock the dependencies
vi.mock('@features/project/api', () => ({
  fetchProjectListFromApi: vi.fn(),
}));

vi.mock('@features/project/transforms', () => ({
  transformApiProjectsToProjects: vi.fn(),
}));

describe('projectListService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and transform project list', async () => {
    const mockApiData = [{ id: 1, name: 'API Project' }];
    const mockTransformedData = [{ id: 1, projectName: 'Transformed Project' }];

    vi.mocked(fetchProjectListFromApi).mockResolvedValue(mockApiData);
    vi.mocked(transformApiProjectsToProjects).mockReturnValue(
      mockTransformedData,
    );

    const service = projectListService();
    const result = await service.getProjectList('TestAccount', undefined);

    expect(fetchProjectListFromApi).toHaveBeenCalledWith({
      accountName: 'TestAccount',
      signal: undefined,
    });
    expect(transformApiProjectsToProjects).toHaveBeenCalledWith(mockApiData);
    expect(result).toEqual(mockTransformedData);
  });

  it('should handle errors from API fetch', async () => {
    vi.mocked(fetchProjectListFromApi).mockRejectedValue(
      new Error('API Error'),
    );

    const service = projectListService();

    await expect(
      service.getProjectList('TestAccount', undefined),
    ).rejects.toThrow('API Error');
  });
});
