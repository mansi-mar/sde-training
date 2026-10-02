import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { vi, describe, it, expect } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useProjectList } from '@/features/project/hooks';

import type { ProjectTransform } from '@features/project/types/project-list';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Wrapper for providing QueryClientProvider
export const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useProjectList', () => {
  it('should call projectService.getProjectList() and return data', async () => {
    const mockProjectData: ProjectTransform[] = [
      {
        accountName: 'Account 1',
        accountOwner: 'Account Owner 1',
        projects: [
          {
            projectName: 'Project 1',
            projectOwner: 'Project Owner 1',
          },
        ],
      },
    ];

    const mockGetProjectList = vi.fn().mockResolvedValue(mockProjectData);

    const mockProjectService = {
      getProjectList: mockGetProjectList,
    };

    const { result } = renderHook(
      () => useProjectList(mockProjectService, 'Test Account 1'),
      {
        wrapper,
      },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
    expect(result.current.projectListData).toBeNull();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetProjectList).toHaveBeenCalledTimes(1);
    expect(result.current.projectListData).toEqual(mockProjectData);
    expect(result.current.isFetching).toBe(false);
  });
});
