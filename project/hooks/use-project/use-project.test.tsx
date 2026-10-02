import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { vi, describe, it, expect } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useProject } from './use-project';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useProject', () => {
  const mockAccountName = 'Test Account';
  const mockProjectData = { projectName: 'Project 1' };

  it('should call projectService.getProject() and return data', async () => {
    const mockGetProject = vi.fn().mockResolvedValue(mockProjectData);

    const mockProjectService = {
      getProject: mockGetProject,
    };
    const { result } = renderHook(
      () =>
        useProject(
          mockProjectService,
          {
            accountName: mockAccountName,
            projectName: mockProjectData.projectName,
          },
          true,
        ),
      {
        wrapper,
      },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).not.toBeDefined();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetProject).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockProjectData);
  });

  it('should handle errors from projectService.getProject()', async () => {
    const mockError = new Error('Failed to fetch');
    const mockGetProject = vi.fn().mockRejectedValue(mockError);
    const mockProjectService = {
      getProject: mockGetProject,
    };

    const { result } = renderHook(
      () =>
        useProject(
          mockProjectService,
          {
            accountName: mockAccountName,
            projectName: mockProjectData.projectName,
          },
          true,
        ),
      {
        wrapper,
      },
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(mockGetProject).toHaveBeenCalledTimes(1);
    expect(result.current.data).not.toBeDefined();
  });

  it('should not call the projectService.getProject() if projectName not passed', async () => {
    const mockProjectService = {
      getProject: vi.fn(),
    };

    renderHook(
      () =>
        useProject(
          mockProjectService,
          {
            accountName: mockAccountName,
            projectName: '',
          },
          true,
        ),
      {
        wrapper,
      },
    );

    expect(mockProjectService.getProject).not.toBeCalled();
  });
  it('should not call the projectService.getProject() if isModalMounted is false', async () => {
    const mockProjectService = {
      getProject: vi.fn(),
    };

    renderHook(
      () =>
        useProject(
          mockProjectService,
          {
            accountName: mockAccountName,
            projectName: mockProjectData.projectName,
          },
          false,
        ),
      {
        wrapper,
      },
    );

    expect(mockProjectService.getProject).not.toBeCalled();
  });
});
