import { renderHook, act } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { showToast } from '@repo/ui/organisms';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useRemoveProject from './use-remove-project';

// Mock dependencies
vi.mock('@repo/ui/organisms', () => ({
  showToast: vi.fn(),
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key) => `translated_${key}`),
}));

// Mock the remove project service
const mockRemoveProject = vi.fn();
const mockRemoveService = {
  removeProject: mockRemoveProject,
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Provide a mock QueryClient for the hooks
export const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

/*eslint max-lines-per-function: ["error", 1000] */
describe('useRemoveProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should remove project successfully', async () => {
    // Mock successful response
    mockRemoveProject.mockResolvedValue({ project_name: 'test-project' });

    // Render the hook
    const { result } = renderHook(
      () => useRemoveProject(mockRemoveService, 'test-account'),
      {
        wrapper,
      },
    );

    // Execute the mutation
    await act(async () => {
      await result.current.mutateAsync({ projectName: 'test-project' });
    });

    // Assert service was called with correct params
    expect(mockRemoveProject).toHaveBeenCalledWith({
      accountName: 'test-account',
      projectName: 'test-project',
    });

    // Assert toast was shown
    expect(showToast).toHaveBeenCalledWith(
      'success',
      'test-project translated_project_removed_successfully',
    );
  });

  it('should handle error when removing project', async () => {
    // Mock error response
    const errorMessage = 'Project removal failed';
    mockRemoveProject.mockRejectedValue({
      response: {
        data: {
          message: errorMessage,
        },
      },
    });

    // Render the hook
    const { result } = renderHook(
      () => useRemoveProject(mockRemoveService, 'test-account'),
      {
        wrapper,
      },
    );

    // Execute the mutation and expect it to fail
    await act(async () => {
      try {
        await result.current.mutateAsync({ projectName: 'test-project' });
      } catch (error) {
        console.log(error);
      }
    });

    // Assert service was called
    expect(mockRemoveProject).toHaveBeenCalledWith({
      accountName: 'test-account',
      projectName: 'test-project',
    });

    // Assert error toast was shown
    expect(showToast).toHaveBeenCalledWith('error', errorMessage);
  });

  it('should use translation for error message when API message is missing', async () => {
    // Mock error response with no message
    mockRemoveProject.mockRejectedValue({
      response: {
        data: {},
      },
    });

    // Render the hook
    const { result } = renderHook(
      () => useRemoveProject(mockRemoveService, 'test-account'),
      {
        wrapper,
      },
    );

    // Execute the mutation and expect it to fail
    await act(async () => {
      try {
        await result.current.mutateAsync({ projectName: 'test-project' });
      } catch (error) {
        console.log(error);
      }
    });

    // Assert error toast was shown with translated message
    expect(showToast).toHaveBeenCalledWith(
      'error',
      'translated_error_removing_project',
    );
  });

  it('should handle error object without response property', async () => {
    // Mock generic error
    mockRemoveProject.mockRejectedValue(new Error('Network error'));

    // Render the hook
    const { result } = renderHook(
      () => useRemoveProject(mockRemoveService, 'test-account'),
      {
        wrapper,
      },
    );

    // Execute the mutation and expect it to fail
    await act(async () => {
      try {
        await result.current.mutateAsync({ projectName: 'test-project' });
      } catch (error) {
        console.log(error);
      }
    });

    // Assert error toast was shown with translated message
    expect(showToast).toHaveBeenCalledWith(
      'error',
      'translated_error_removing_project',
    );
  });

  it('should return loading state correctly', () => {
    // Mock pending promise
    mockRemoveProject.mockImplementation(() => new Promise(() => {}));

    // Render the hook
    const { result } = renderHook(
      () => useRemoveProject(mockRemoveService, 'test-account'),
      {
        wrapper,
      },
    );

    // Start the mutation but don't await it
    act(() => {
      result.current.mutate({ projectName: 'test-project' });
    });

    // Assert loading state
    expect(result.current.isPending).toBe(false);
  });
});
