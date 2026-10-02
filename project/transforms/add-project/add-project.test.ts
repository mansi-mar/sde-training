import { describe, it, expect } from 'vitest';

import { transformForAddProjectAPI } from './add-project';

import type { ProjectType } from '@/features/project/types';

enum ProjectLabels {
  name = 'project_name',
  owner = 'project_additional_info.owner_name',
  ownerEmail = 'project_additional_info.owner_email_id',
  description = 'project_description',
}

describe('transformForAddProjectAPI', () => {
  it('should transform ProjectType to APIProjectType correctly', () => {
    const projectState: ProjectType = {
      [ProjectLabels.name]: 'Test Project',
      [ProjectLabels.owner]: 'John Doe',
      [ProjectLabels.ownerEmail]: 'john@example.com',
      [ProjectLabels.description]: 'A sample project',
    };

    const transformedData = transformForAddProjectAPI(projectState);

    expect(transformedData).toEqual({
      project_name: 'Test Project',
      project_description: 'A sample project',
      project_additional_info: {
        owner_name: 'John Doe',
        owner_email_id: 'john@example.com',
      },
    });
  });

  it('should handle undefined projectDescription', () => {
    const projectState: ProjectType = {
      [ProjectLabels.name]: 'No Description Project',
      [ProjectLabels.owner]: 'Alice',
      [ProjectLabels.ownerEmail]: 'alice@example.com',
      [ProjectLabels.description]: undefined,
    };

    const transformedData = transformForAddProjectAPI(projectState);

    expect(transformedData).toEqual({
      project_name: 'No Description Project',
      project_description: undefined,
      project_additional_info: {
        owner_name: 'Alice',
        owner_email_id: 'alice@example.com',
      },
    });
  });
});
