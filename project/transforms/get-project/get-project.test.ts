import { describe, it, expect } from 'vitest';

import { transformApiProjectToProject } from './get-project';

import type { ProjectType } from '@/features/project/types';

enum ProjectLabels {
  name = 'project_name',
  owner = 'project_additional_info.owner_name',
  ownerEmail = 'project_additional_info.owner_email_id',
  description = 'project_description',
}

describe('transformApiProjectToProject', () => {
  it('transforms ApiProject to ProjectType correctly', () => {
    const apiProject = {
      project_name: 'Test Project',
      project_additional_info: {
        owner_name: 'John Doe',
        owner_email_id: 'john.doe@example.com',
      },
      project_description: 'A sample project',
    };

    const expectedResult: ProjectType = {
      [ProjectLabels.name]: 'Test Project',
      [ProjectLabels.owner]: 'John Doe',
      [ProjectLabels.ownerEmail]: 'john.doe@example.com',
      [ProjectLabels.description]: 'A sample project',
    };

    expect(transformApiProjectToProject(apiProject)).toEqual(expectedResult);
  });

  it('handles missing optional fields gracefully', () => {
    const apiProject = {
      project_name: 'Test Project',
    };

    const expectedResult: ProjectType = {
      [ProjectLabels.name]: 'Test Project',
    };

    expect(transformApiProjectToProject(apiProject)).toEqual(expectedResult);
  });

  it('handles missing project_additional_info field correctly', () => {
    const apiProject = {
      project_name: 'Test Project',
      project_description: 'Some description',
    };

    const expectedResult: ProjectType = {
      [ProjectLabels.name]: 'Test Project',
      [ProjectLabels.description]: 'Some description',
    };

    expect(transformApiProjectToProject(apiProject)).toEqual(expectedResult);
  });
});
