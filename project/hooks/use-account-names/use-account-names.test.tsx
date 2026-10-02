import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';

import { vi, describe, it, expect } from 'vitest';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useAccountNames } from '@/features/project/hooks';

// Create a test QueryClientProvider
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries to prevent unwanted delays
      },
    },
  });

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useAccountNames Hook', () => {
  it('should fetch account names successfully', async () => {
    const mockAccountItems = [
      { id: 1, name: 'Account A' },
      { id: 2, name: 'Account B' },
    ];
    const mockGetAccountItems = vi.fn().mockResolvedValue(mockAccountItems);

    const mockAccountService = {
      getAccountItems: mockGetAccountItems,
    };

    const { result } = renderHook(
      () => useAccountNames(mockAccountService, true),
      { wrapper },
    );

    expect(result.current.isFetching).toBe(true);
    expect(result.current.accountNames).toBeUndefined();

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(mockGetAccountItems).toHaveBeenCalledTimes(1);
    expect(result.current.accountNames).toEqual(mockAccountItems);
  });

  it('should handle errors correctly', async () => {
    const mockError = new Error('Failed to fetch');
    const mockGetAccountItems = vi.fn().mockRejectedValue(mockError);

    const mockAccountService = {
      getAccountItems: mockGetAccountItems,
    };

    const { result } = renderHook(
      () => useAccountNames(mockAccountService, true),
      { wrapper },
    );

    expect(result.current.isFetching).toBe(true);

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(mockGetAccountItems).toHaveBeenCalledTimes(1);
    expect(result.current.accountNames).toBeUndefined();
  });

  it('should not call the service when isEnabled is false', async () => {
    const mockGetAccountItems = vi.fn();

    const mockAccountService = {
      getAccountItems: mockGetAccountItems,
    };

    renderHook(() => useAccountNames(mockAccountService, false), { wrapper });

    expect(mockGetAccountItems).not.toHaveBeenCalled();
  });
});
