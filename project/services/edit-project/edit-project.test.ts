import { describe, it, expect, vi, beforeEach } from 'vitest';

import { editProjectFromApi } from '@/features/project/api';
import { transformForAddProjectAPI } from '@/features/project/transforms';

import { editProject } from './edit-project';

vi.mock('@/features/project/api', () => ({
  editProjectFromApi: vi.fn(),
}));

vi.mock('@/features/project/transforms', () => ({
  transformForAddProjectAPI: vi.fn(),
}));

describe('editProject', () => {
  let projectService: ReturnType<typeof editProject>;

  beforeEach(() => {
    vi.clearAllMocks();
    projectService = editProject();
  });

  describe('editProject', () => {
    it('should call transformForAddProjectAPI and editProjectFromApi', async () => {
      const mockAccountName = 'TestAccount';
      const mockProject = {
        projectName: 'TestProject',
        projectOwner: 'Jane Doe',
        projectOwnerEmail: 'jane@example.com',
        projectDescription: 'Project description',
      };
      const transformedData = { mock: 'transformedData' };

      (transformForAddProjectAPI as vi.Mock).mockReturnValue(transformedData);
      (editProjectFromApi as vi.Mock).mockResolvedValue({
        id: 1,
        ...transformedData,
      });

      const result = await projectService.editProject(
        mockAccountName,
        mockProject,
      );

      expect(transformForAddProjectAPI).toHaveBeenCalledWith(mockProject);
      expect(editProjectFromApi).toHaveBeenCalledWith(
        mockAccountName,
        transformedData,
      );
      expect(result).toEqual({ id: 1, ...transformedData });
    });
  });
});
