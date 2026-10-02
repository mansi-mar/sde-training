import { renderHook, act } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  useProjectList,
  useProjectSelection,
  useProjectNavigation,
  useErrorTranslations,
} from '@/features/project/hooks';
import { ProjectListTransformed } from '@features/project/types/project-list';

import useProjectContent from './use-project-content';

// Mocking the hooks
vi.mock('@/features/project/hooks', () => ({
  useProjectList: vi.fn(),
  useProjectSelection: vi.fn(),
  useProjectNavigation: vi.fn(),
  useErrorTranslations: vi.fn(),
}));

vi.mock('@/hooks', () => ({
  useErrorNotification: vi.fn(),
}));

describe('useProjectContent Hook', () => {
  const mockOnMapResourceHandler = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProjectSelection).mockReturnValue({
      selectedProject: null,
      handleSelectedProject: vi.fn(),
      handleResetProject: vi.fn(),
    });

    vi.mocked(useProjectNavigation).mockReturnValue({
      navigateToAccounts: vi.fn(),
      handleProjectRowClick: vi.fn(),
      goBack: vi.fn(),
    });

    vi.mocked(useProjectList).mockReturnValue({
      projectListData: null,
      isLoading: false,
      isFetching: false,
      error: null,
      isError: false,
    });

    vi.mocked(useErrorTranslations).mockReturnValue({
      errorNotificationTranslations: {
        title: 'Error Title',
        description: 'Error Description',
      },
    });
  });

  it('should return default values', () => {
    const { result } = renderHook(() =>
      useProjectContent('TestAccount', mockOnMapResourceHandler),
    );

    expect(result.current.projectListData).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.selectedProject).toBeNull();
    expect(result.current.goBack).toBeDefined();
    expect(result.current.handleResetProject).toBeDefined();
    expect(result.current.tableEventHandler).toBeDefined();
    expect(result.current.tableOperations).toEqual({
      searchKey: 'projectName',
      desc: false,
      isSorting: true,
    });
  });

  it('should handle map resources click', () => {
    const { result } = renderHook(() =>
      useProjectContent('TestAccount', mockOnMapResourceHandler),
    );

    const project: ProjectListTransformed = { projectName: 'Project1' };

    act(() => {
      result.current.tableEventHandler.mapResources(project);
    });

    expect(mockOnMapResourceHandler).toHaveBeenCalledWith('Project1');
  });
});
