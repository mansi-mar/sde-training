import { renderHook } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAppConfig } from '@/hooks';
import {
  generateFormStructure,
  generateInitialState,
  generateSchema,
} from '@/lib/utils';

import { useProjectWithAccountFormConfig } from './use-project-with-account-form-config';

// Mock the necessary modules
vi.mock('@/hooks', () => ({
  useAppConfig: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  generateFormStructure: vi.fn(),
  generateInitialState: vi.fn(),
  generateSchema: vi.fn(),
}));

describe('useProjectWithAccountFormConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state when config is loading', () => {
    (useAppConfig as vi.Mock).mockReturnValue({
      config: null,
      isLoading: true,
    });

    const { result } = renderHook(() => useProjectWithAccountFormConfig());

    expect(result.current.configLoading).toBe(true);
    expect(result.current.formSchema).toBeUndefined();
    expect(result.current.initialState).toBeUndefined();
    expect(result.current.formStructure).toBeUndefined();
  });

  it('should return null formConfig when projects config is not available', () => {
    (useAppConfig as vi.Mock).mockReturnValue({
      config: {},
      isLoading: false,
    });

    const { result } = renderHook(() => useProjectWithAccountFormConfig());

    expect(result.current.configLoading).toBe(false);
    expect(result.current.formSchema).toBeUndefined();
    expect(result.current.initialState).toBeUndefined();
    expect(result.current.formStructure).toBeUndefined();
  });

  it('should generate form configuration when projects config is available', () => {
    const mockProjectsConfig = [{ id: 'projectName', type: 'string' }];
    (useAppConfig as vi.Mock).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    const mockSchema = {};
    const mockInitialState = {};
    const mockFormStructure = {};

    (generateSchema as vi.Mock).mockReturnValue(mockSchema);
    (generateInitialState as vi.Mock).mockReturnValue(mockInitialState);
    (generateFormStructure as vi.Mock).mockReturnValue(mockFormStructure);

    const { result } = renderHook(() => useProjectWithAccountFormConfig());

    expect(result.current.configLoading).toBe(false);
    expect(result.current.formSchema).toBe(mockSchema);
    expect(result.current.initialState).toBe(mockInitialState);
    expect(result.current.formStructure).toBe(mockFormStructure);

    expect(generateSchema).toHaveBeenCalledWith([
      [
        {
          id: 'account_name',
          label: 'accountName',
          type: 'dropdown',
          defaultValue: '',
          validation: {
            required: { message: 'account_name_required' },
          },
        },
      ],
      ...mockProjectsConfig,
    ]);
    expect(generateInitialState).toHaveBeenCalledWith([
      [
        {
          id: 'account_name',
          label: 'accountName',
          type: 'dropdown',
          defaultValue: '',
          validation: {
            required: { message: 'account_name_required' },
          },
        },
      ],
      ...mockProjectsConfig,
    ]);
    expect(generateFormStructure).toHaveBeenCalledWith([
      [
        {
          id: 'account_name',
          label: 'accountName',
          type: 'dropdown',
          defaultValue: '',
          validation: {
            required: { message: 'account_name_required' },
          },
        },
      ],
      ...mockProjectsConfig,
    ]);
  });
});
