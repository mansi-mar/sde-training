import { describe, it, expect } from 'vitest';

import {
  getProjectQueryKey,
  getProjectListKey,
  getProjectListingPath,
  getAccountProjectsPath,
  getProjectResourcesPath,
  ProjectLabels,
} from './constant';

describe('Project Utils', () => {
  describe('getProjectQueryKey', () => {
    it('should return correct query key array', () => {
      const result = getProjectQueryKey('testAccount', 'testProject');
      expect(result).toEqual(['testAccount', 'testProject']);
    });
  });

  describe('getProjectListKey', () => {
    it('should return correct project list key array', () => {
      const result = getProjectListKey('testAccount');
      expect(result).toEqual(['projects-list-testAccount']);
    });
  });

  describe('getProjectListingPath', () => {
    it('should return correct project listing path', () => {
      const result = getProjectListingPath('testAccount', 'active');
      expect(result).toBe('/admin/accounts/testAccount?data_filter=active');
    });
  });

  describe('getAccountProjectsPath', () => {
    it('should return correct account projects path', () => {
      const result = getAccountProjectsPath('testAccount');
      expect(result).toBe('/accounts/testAccount/projects');
    });
  });

  describe('getProjectResourcesPath', () => {
    it('should return correct project resources path', () => {
      const result = getProjectResourcesPath('testAccount', 'testProject');
      expect(result).toBe(
        '/accounts/testAccount/projects/testProject/resources',
      );
    });
  });

  describe('ProjectLabels Enum', () => {
    it('should have correct enum values', () => {
      expect(ProjectLabels.name).toBe('projectName');
      expect(ProjectLabels.owner).toBe('projectOwner');
      expect(ProjectLabels.ownerEmail).toBe('projectOwnerEmail');
      expect(ProjectLabels.description).toBe('projectDescription');
    });
  });
});
