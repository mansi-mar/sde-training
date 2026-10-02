import { renderHook } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useTranslations } from 'next-intl';

import useErrorTranslations from './use-error-translations';

// Mocking the useTranslations hook
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(),
}));

describe('useErrorTranslations Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return correct error notification translations', () => {
    const mockTranslation = vi.fn((key: string) => {
      const translations = {
        projects_error_title: 'Error Title',
        projects_404_error: 'Error Description',
      };
      return translations[key];
    });

    vi.mocked(useTranslations).mockReturnValue(mockTranslation);

    const { result } = renderHook(() => useErrorTranslations());

    expect(result.current.errorNotificationTranslations).toEqual({
      title: 'Error Title',
      description: 'Error Description',
    });
  });

  it('should memoize the translations', () => {
    const mockTranslation = vi.fn((key: string) => {
      const translations = {
        projects_error_title: 'Error Title',
        projects_404_error: 'Error Description',
      };
      return translations[key];
    });

    vi.mocked(useTranslations).mockReturnValue(mockTranslation);

    const { result, rerender } = renderHook(() => useErrorTranslations());

    // Initial render
    expect(result.current.errorNotificationTranslations).toEqual({
      title: 'Error Title',
      description: 'Error Description',
    });

    // Rerender and check if the translations are memoized
    rerender();
    expect(mockTranslation).toHaveBeenCalledTimes(2); // Called twice for each key
  });
});
