import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getProjectFromApi } from '@/features/project/api';
import { transformApiProjectToProject } from '@/features/project/transforms';

import { getProject } from './get-project';

vi.mock('@/features/project/api', () => ({
  getProjectFromApi: vi.fn(),
}));

vi.mock('@/features/project/transforms', () => ({
  transformApiProjectToProject: vi.fn(),
}));

describe('getProject', () => {
  const mockAccountName = 'test_account';
  let projectService: ReturnType<typeof getProject>;

  beforeEach(() => {
    vi.clearAllMocks();
    projectService = getProject();
  });

  it('should throw an error if account name is empty', async () => {
    await expect(
      projectService.getProject(mockAccountName, null),
    ).rejects.toThrow('Account name cannot be empty');
    await expect(
      projectService.getProject(mockAccountName, ''),
    ).rejects.toThrow('Account name cannot be empty');
  });

  it('should call getProjectFromApi and transformApiProjectToProject', async () => {
    const mockApiProject = {
      project_name: 'TestAccount',
      project_additional_info: {
        owner_name: 'John Doe',
        owner_email_id: 'john@example.com',
      },
      project_description: 'Sample description',
    };

    const mockTransformedProject = {
      projectName: 'TestAccount',
      projectOwner: 'John Doe',
      projectOwnerEmail: 'john@example.com',
      projectDescription: 'Sample description',
    };

    (getProjectFromApi as vi.Mock).mockResolvedValue(mockApiProject);
    (transformApiProjectToProject as vi.Mock).mockReturnValue(
      mockTransformedProject,
    );

    const result = await projectService.getProject(
      mockAccountName,
      mockTransformedProject.projectName,
    );

    expect(getProjectFromApi).toHaveBeenCalledWith(
      mockAccountName,
      mockTransformedProject.projectName,
    );
    expect(transformApiProjectToProject).toHaveBeenCalledWith(mockApiProject);
    expect(result).toEqual(mockTransformedProject);
  });
});
