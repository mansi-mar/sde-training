import { describe, it, expect } from 'vitest';

import {
  ProjectTransform,
  ApiProjectListResponse,
} from '@/features/project/types/project-list';
import { transformApiProjectsToProjects } from '@features/project/transforms';

describe('transformApiProjectsToProjects', () => {
  it('should transform API project list to ProjectTransform format', () => {
    const apiProjectList: ApiProjectListResponse = {
      account_name: 'Test Account',
      account_additional_info: {
        owner_name: 'Owner Name',
      },
      projects: [
        {
          project_name: 'Project 1',
          ent_id: 'jkl-xyz',
          project_additional_info: {
            owner_name: 'Owner 1',
          },
          resources: [
            { resource_name: 'Resource 1' },
            { resource_name: 'Resource 2' },
          ],
        },
        {
          project_name: 'Project 2',
          ent_id: 'mno-xyz',
          project_additional_info: {
            owner_name: 'Owner 2',
          },
          resources: [],
        },
      ],
    };

    const expected: ProjectTransform = {
      accountName: 'Test Account',
      accountOwner: 'Owner Name',
      projects: [
        {
          projectName: 'Project 1',
          projectId: 'jkl-xyz',
          projectOwner: 'Owner 1',
          totalResources: 2,
        },
        {
          projectName: 'Project 2',
          projectId: 'mno-xyz',
          projectOwner: 'Owner 2',
          totalResources: 0,
        },
      ],
    };

    const result = transformApiProjectsToProjects(apiProjectList);
    expect(result).toEqual(expected);
  });

  it('should handle projects with undefined resources', () => {
    const apiProjectList: ApiProjectListResponse = {
      account_name: 'Test Account',
      account_additional_info: {
        owner_name: 'Owner Name',
      },
      projects: [
        {
          project_name: 'Project 1',
          ent_id: 'jkl-xyz',
          project_additional_info: {
            owner_name: 'Owner 1',
          },
          resources: undefined,
        },
      ],
    };

    const expected: ProjectTransform = {
      accountName: 'Test Account',
      accountOwner: 'Owner Name',
      projects: [
        {
          projectName: 'Project 1',
          projectId: 'jkl-xyz',
          projectOwner: 'Owner 1',
          totalResources: 0,
        },
      ],
    };

    const result = transformApiProjectsToProjects(apiProjectList);
    expect(result).toEqual(expected);
  });

  it('should return an empty projects array when no projects are provided', () => {
    const apiProjectList: ApiProjectListResponse = {
      account_name: 'Test Account',
      account_additional_info: {
        owner_name: 'Owner Name',
      },
      projects: [],
    };

    const expected: ProjectTransform = {
      accountName: 'Test Account',
      accountOwner: 'Owner Name',
      projects: [],
    };

    const result = transformApiProjectsToProjects(apiProjectList);
    expect(result).toEqual(expected);
  });
});
