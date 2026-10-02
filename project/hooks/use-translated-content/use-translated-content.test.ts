import { renderHook } from '@testing-library/react';

import { describe, it, expect, vi } from 'vitest';

import { useTranslations } from 'next-intl';

import { useTranslatedContent } from '@/features/project/hooks';

// Mock the useTranslations hook
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

 
describe('useTranslatedContent Hook', () => {
  it('should return correct translations', () => {
    const mockTranslations = {
      projectName: 'Project Name',
      projectId: 'Project ID',
      projectOwner: 'Project Owner',
      totalResources: 'Total Resources',
      mapResources: 'Map Resources',
      editProject: 'Edit Project',
      removeProject: 'Remove Project',
      account_owner: 'Account Owner',
      projects_info_single: 'Single Project',
      projects_info_multiple: 'Multiple Projects',
      back: 'Back',
      search_projects: 'Search Projects',
    };

    vi.mocked(useTranslations).mockReturnValue(
      (key: string) => mockTranslations[key],
    );

    const { result } = renderHook(() =>
      useTranslatedContent(['super_admin'], ['removeProject']),
    );

    expect(result.current.columnHeaderTranslations).toEqual({
      projectName: 'Project Name',
      projectId: 'Project ID',
      projectOwner: 'Project Owner',
      totalResources: 'Total Resources',
      mapResources: 'Map Resources',
      editProject: 'Edit Project',
      removeProject: 'Remove Project',
    });

    expect(result.current.skeletonHeaders).toEqual([
      'Project Name',
      'Project ID',
      'Project Owner',
      'Total Resources',
      'Map Resources',
      'Edit Project',
      'Remove Project',
    ]);

    expect(result.current.detailsContent).toEqual({
      accountOwner: 'Account Owner',
      singleProject: 'Single Project',
      multipleProjects: 'Multiple Projects',
      back: 'Back',
    });

    expect(result.current.tableTranslations).toEqual({
      searchProjects: 'Search Projects',
    });
  });

  it('should return correct translations when permission does not contain super_admin', () => {
    const mockTranslations = {
      projectName: 'Project Name',
      projectId: 'abc-xyz',
      projectOwner: 'Project Owner',
      totalResources: 'Total Resources',
      mapResources: 'Map Resources',
      editProject: 'Edit Project',
      removeProject: 'Remove Project',
    };

    vi.mocked(useTranslations).mockReturnValue(
      (key: string) => mockTranslations[key],
    );

    const { result } = renderHook(() =>
      useTranslatedContent(['admin'], ['removeProject']),
    );

    expect(result.current.columnHeaderTranslations).toEqual({
      projectName: 'Project Name',
      projectId: 'abc-xyz',
      projectOwner: 'Project Owner',
      totalResources: 'Total Resources',
      mapResources: 'Map Resources',
      editProject: 'Edit Project',
    });
  });

  it('should handle missing translations gracefully', () => {
    vi.mocked(useTranslations).mockReturnValue(() => undefined);

    const { result } = renderHook(() =>
      useTranslatedContent(['super_admin'], ['removeProject']),
    );

    expect(result.current.columnHeaderTranslations).toEqual({
      projectName: undefined,
      projectOwner: undefined,
      totalResources: undefined,
      mapResources: undefined,
      editProject: undefined,
      removeProject: undefined,
    });

    expect(result.current.skeletonHeaders).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);

    expect(result.current.detailsContent).toEqual({
      accountOwner: undefined,
      singleProject: undefined,
      multipleProjects: undefined,
      back: undefined,
    });

    expect(result.current.tableTranslations).toEqual({
      searchProjects: undefined,
    });
  });
});
