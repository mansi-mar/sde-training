// use-columns.test.ts

import { renderHook } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { TranslatedColumns } from '@/features/project/types';
import { removeColumnsByAccessorKeys } from '@/lib/utils/remove-by-accessor-keys';
import { projectListColumns } from '@features/project/utils';

import useColumns from './use-columns';

// Mocking the projectListColumns and removeColumnsByAccessorKeys utilities
vi.mock('@features/project/utils', () => ({
  projectListColumns: vi.fn(),
}));

vi.mock('@/lib/utils/remove-by-accessor-keys', () => ({
  removeColumnsByAccessorKeys: vi.fn(),
}));

describe('useColumns Hook', () => {
  const mockTranslations: TranslatedColumns = {
    projectName: 'Project Name',
    projectOwner: 'Project Owner',
    totalResources: 'Total Resources',
    mapResources: 'Map Resources',
    editProject: 'Edit Project',
    removeProject: 'Remove Project',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all columns for super_admin', () => {
    const mockColumns = [
      { accessorKey: 'projectName', header: 'Project Name' },
      { accessorKey: 'projectOwner', header: 'Project Owner' },
      { accessorKey: 'removeProject', header: 'Remove Project' },
    ];

    vi.mocked(projectListColumns).mockReturnValue(mockColumns);

    const { result } = renderHook(() =>
      useColumns(mockTranslations, ['super_admin']),
    );

    expect(result.current).toEqual(mockColumns);
    expect(projectListColumns).toHaveBeenCalledWith(mockTranslations);
    expect(removeColumnsByAccessorKeys).not.toHaveBeenCalled();
  });

  it('should remove specific columns for non-super_admin', () => {
    const mockColumns = [
      { accessorKey: 'projectName', header: 'Project Name' },
      { accessorKey: 'projectOwner', header: 'Project Owner' },
      { accessorKey: 'removeProject', header: 'Remove Project' },
    ];

    const filteredColumns = [
      { accessorKey: 'projectName', header: 'Project Name' },
      { accessorKey: 'projectOwner', header: 'Project Owner' },
    ];

    vi.mocked(projectListColumns).mockReturnValue(mockColumns);
    vi.mocked(removeColumnsByAccessorKeys).mockReturnValue(filteredColumns);

    renderHook(() =>
      useColumns(mockTranslations, ['admin'], ['removeProject']),
    );

    expect(projectListColumns).toHaveBeenCalledWith(mockTranslations);
  });
});
