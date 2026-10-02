// use-project-navigation.test.ts

import { renderHook } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getProjectResourcesPath } from '@/features/project/constants/constant';
import { useClientRouter } from '@/hooks';
import { ProjectListTransformed } from '@features/project/types/project-list';

import useProjectNavigation from './use-project-navigation';

vi.mock('@/hooks', () => ({
  useClientRouter: vi.fn(),
}));

vi.mock('@features/project/constants/constant', () => ({
  getProjectResourcesPath: vi.fn(),
}));

describe('useProjectNavigation Hook', () => {
  const navigateMock = vi.fn();
  const goBackMock = vi.fn();
  const prefetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useClientRouter).mockReturnValue({
      navigate: navigateMock,
      goBack: goBackMock,
      prefetch: prefetchMock,
    });
  });

  it('should navigate to accounts', () => {
    const { result } = renderHook(() => useProjectNavigation('TestAccount'));

    result.current.navigateToAccounts();

    expect(navigateMock).toHaveBeenCalledWith('/accounts');
  });

  it('should handle project row click', () => {
    const project: ProjectListTransformed = { projectName: 'Project1' };
    const expectedPath = '/accounts/TestAccount/projects/Project1/resources';

    vi.mocked(getProjectResourcesPath).mockReturnValue(expectedPath);

    const { result } = renderHook(() => useProjectNavigation('TestAccount'));

    result.current.handleProjectRowClick(project);

    expect(navigateMock).toHaveBeenCalledWith(expectedPath);
  });

  it('should handle project row hover', () => {
    const project: ProjectListTransformed = { projectName: 'Project1' };
    const expectedPath = '/accounts/TestAccount/projects/Project1/resources';

    vi.mocked(getProjectResourcesPath).mockReturnValue(expectedPath);

    const { result } = renderHook(() => useProjectNavigation('TestAccount'));

    result.current.handleMouseEnter(project);

    expect(prefetchMock).toHaveBeenCalledWith(expectedPath);
  });

  it('should return goBack function', () => {
    const { result } = renderHook(() => useProjectNavigation('TestAccount'));

    result.current.goBack();

    expect(goBackMock).toHaveBeenCalled();
  });
});
