import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  addProjectFromApi,
  fetchAccountNameListFromApi,
} from '@/features/project/api';
import {
  transformForAddProjectAPI,
  transformApiAccountsToAccountItems,
} from '@/features/project/transforms';

import { addProject } from './add-project';

import type { ApiAccountNameListResponse } from '@/features/project/api';
import type { AccountItem } from '@/features/project/transforms';

vi.mock('@/features/project/api', () => ({
  addProjectFromApi: vi.fn(),
  fetchAccountNameListFromApi: vi.fn(),
}));

vi.mock('@/features/project/transforms', () => ({
  transformForAddProjectAPI: vi.fn(),
  transformApiAccountsToAccountItems: vi.fn(),
}));

describe('addProject', () => {
  let projectService: ReturnType<typeof addProject>;

  beforeEach(() => {
    vi.clearAllMocks();
    projectService = addProject();
  });

  describe('addProject.addProject', () => {
    it('should call transformForAddProjectAPI and addProjectFromApi', async () => {
      const mockAccountName = 'TestAccount';
      const mockProject = {
        projectName: 'TestProject',
        projectOwner: 'Jane Doe',
        projectOwnerEmail: 'jane@example.com',
        projectDescription: 'Project description',
      };
      const transformedData = { mock: 'transformedData' };

      (transformForAddProjectAPI as vi.Mock).mockReturnValue(transformedData);
      (addProjectFromApi as vi.Mock).mockResolvedValue({
        id: 1,
        ...transformedData,
      });

      const result = await projectService.addProject(
        mockAccountName,
        mockProject,
      );

      expect(transformForAddProjectAPI).toHaveBeenCalledWith(mockProject);
      expect(addProjectFromApi).toHaveBeenCalledWith(
        mockAccountName,
        transformedData,
      );
      expect(result).toEqual({ id: 1, ...transformedData });
    });
  });

  describe('addProject.getAccountItems', () => {
    it('should return transformed account items on success', async () => {
      const mockApiResponse: ApiAccountNameListResponse[] = [
        { account_name: 'Account1' },
        { account_name: 'Account2' },
      ];
      const mockTransformedResponse: AccountItem[] = [
        { label: 'Account1', value: 'Account1' },
        { label: 'Account2', value: 'Account2' },
      ];

      (fetchAccountNameListFromApi as vi.Mock).mockResolvedValueOnce(
        mockApiResponse,
      );
      (transformApiAccountsToAccountItems as vi.Mock).mockReturnValueOnce(
        mockTransformedResponse,
      );

      const { getAccountItems } = addProject();
      const result = await getAccountItems();

      expect(result).toEqual(mockTransformedResponse);
      expect(fetchAccountNameListFromApi).toHaveBeenCalled();
      expect(transformApiAccountsToAccountItems).toHaveBeenCalledWith(
        mockApiResponse,
      );
    });

    it('should handle errors from fetchAccountNameListFromApi', async () => {
      const errorMessage = 'Failed to fetch account names';
      (fetchAccountNameListFromApi as vi.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      );

      const { getAccountItems } = addProject();

      await expect(getAccountItems()).rejects.toThrow(errorMessage);
      expect(fetchAccountNameListFromApi).toHaveBeenCalled();
      expect(transformApiAccountsToAccountItems).not.toHaveBeenCalled();
    });
  });
});
