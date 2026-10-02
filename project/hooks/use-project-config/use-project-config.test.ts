import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAppConfig } from '@/hooks';
import {
  generateFormStructure,
  generateInitialState,
  generateSchema,
  updateRegexValidation,
} from '@/lib/utils';

import { useFeatureConfig } from '@repo/ui/organisms';

import { useProjectFormConfig } from './use-project-config';

vi.mock('@/hooks', () => ({
  useAppConfig: vi.fn(),
}));

vi.mock('@/lib/utils', () => ({
  generateFormStructure: vi.fn(),
  generateInitialState: vi.fn(),
  generateSchema: vi.fn(),
  updateRegexValidation: vi.fn(),
}));

vi.mock('@repo/ui/organisms', () => ({
  useFeatureConfig: vi.fn(),
}));

// CHANGE: Mock the constants module to provide projectFieldConfigMapping
vi.mock('../../utils/constants', () => ({
  projectFieldConfigMapping: { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
}));

describe('useProjectFormConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useFeatureConfig as any).mockReturnValue({});

    // pass-through mock
    (updateRegexValidation as any).mockImplementation((config) => config);
  });

  it('should return loading state when config is loading', () => {
    (useAppConfig as any).mockReturnValue({
      config: null,
      isLoading: true,
    });

    const { result } = renderHook(() => useProjectFormConfig());

    expect(result.current.configLoading).toBe(true);
    expect(result.current.formSchema).toBeUndefined();
    expect(result.current.initialState).toBeUndefined();
    expect(result.current.formStructure).toBeUndefined();
  });

  it('should return null formConfig when projects config is not available', () => {
    (useAppConfig as any).mockReturnValue({
      config: {},
      isLoading: false,
    });

    const { result } = renderHook(() => useProjectFormConfig());

    expect(result.current.configLoading).toBe(false);
    expect(result.current.formSchema).toBeUndefined();
    expect(result.current.initialState).toBeUndefined();
    expect(result.current.formStructure).toBeUndefined();
  });

  it('should generate form configuration when projects config is available', () => {
    const mockProjectsConfig = [{ id: 'projectName', type: 'string' }];

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    const mockSchema = {};
    const mockInitialState = {};
    const mockFormStructure = {};

    (generateSchema as any).mockReturnValue(mockSchema);
    (generateInitialState as any).mockReturnValue(mockInitialState);
    (generateFormStructure as any).mockReturnValue(mockFormStructure);

    const { result } = renderHook(() => useProjectFormConfig());

    expect(result.current.configLoading).toBe(false);
    expect(result.current.formSchema).toBe(mockSchema);
    expect(result.current.initialState).toBe(mockInitialState);
    expect(result.current.formStructure).toBe(mockFormStructure);

    // CHANGE: Update assertion to use projectFieldConfigMapping instead of hardcoded array
    expect(updateRegexValidation).toHaveBeenCalledWith(
      mockProjectsConfig,
      {},
      { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
    );

    expect(generateSchema).toHaveBeenCalledWith(mockProjectsConfig);
    expect(generateInitialState).toHaveBeenCalledWith(mockProjectsConfig);
    expect(generateFormStructure).toHaveBeenCalledWith(mockProjectsConfig);
  });

  // CHANGE: Add test to verify updateRegexValidation is called with correct parameters
  it('should call updateRegexValidation with authConfig and projectFieldConfigMapping', () => {
    const mockProjectsConfig = [{ id: 'projectName', type: 'string' }];
    const mockAuthConfig = { NAME_REGEX: '^[a-zA-Z]*$', DESC_REGEX: '^[a-zA-Z0-9]*$' };

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    (useFeatureConfig as any).mockReturnValue(mockAuthConfig);

    renderHook(() => useProjectFormConfig());

    expect(updateRegexValidation).toHaveBeenCalledWith(
      mockProjectsConfig,
      mockAuthConfig,
      { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
    );
  });

  // CHANGE: Add test to verify memoization behavior with authConfig changes
  it('should recalculate form config when authConfig changes', () => {
    const mockProjectsConfig = [{ id: 'projectName', type: 'string' }];
    const initialAuthConfig = { NAME_REGEX: '^[a-zA-Z]*$' };
    const updatedAuthConfig = { NAME_REGEX: '^[a-zA-Z0-9]*$' };

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    (useFeatureConfig as any).mockReturnValue(initialAuthConfig);

    const { rerender } = renderHook(() => useProjectFormConfig());

    expect(updateRegexValidation).toHaveBeenCalledTimes(1);

    // Change authConfig
    (useFeatureConfig as any).mockReturnValue(updatedAuthConfig);
    rerender();

    expect(updateRegexValidation).toHaveBeenCalledTimes(2);
    expect(updateRegexValidation).toHaveBeenLastCalledWith(
      mockProjectsConfig,
      updatedAuthConfig,
      { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
    );
  });

  // CHANGE: Add test to verify memoization behavior with apiConfig changes
  it('should recalculate form config when apiConfig.project changes', () => {
    const initialProjectsConfig = [{ id: 'projectName', type: 'string' }];
    const updatedProjectsConfig = [
      { id: 'projectName', type: 'string' },
      { id: 'projectDescription', type: 'textarea' }
    ];

    (useAppConfig as any).mockReturnValue({
      config: { project: initialProjectsConfig },
      isLoading: false,
    });

    const { rerender } = renderHook(() => useProjectFormConfig());

    expect(updateRegexValidation).toHaveBeenCalledTimes(1);

    // Change apiConfig.project
    (useAppConfig as any).mockReturnValue({
      config: { project: updatedProjectsConfig },
      isLoading: false,
    });
    rerender();

    expect(updateRegexValidation).toHaveBeenCalledTimes(2);
  });

  // CHANGE: Add test to verify field-specific regex mapping functionality
  it('should apply field-specific regex validation based on projectFieldConfigMapping', () => {
    const mockProjectsConfig = [
      { 
        id: 'project_name', 
        type: 'string',
        validation: {
          regex: { message: 'invalid_project_name' }
        }
      },
      { 
        id: 'project_description', 
        type: 'textarea',
        validation: {
          regex: { message: 'invalid_project_description' }
        }
      }
    ];
    const mockAuthConfig = { 
      NAME_REGEX: '^[a-zA-Z0-9_]*$', 
      DESC_REGEX: '^[a-zA-Z0-9_\\s]*$' 
    };

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    (useFeatureConfig as any).mockReturnValue(mockAuthConfig);

    renderHook(() => useProjectFormConfig());

    expect(updateRegexValidation).toHaveBeenCalledWith(
      mockProjectsConfig,
      mockAuthConfig,
      { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
    );
  });

  // CHANGE: Add test to verify that form generation functions receive updated config
  it('should pass updated project config to form generation functions', () => {
    const mockProjectsConfig = [{ id: 'projectName', type: 'string' }];
    const mockUpdatedConfig = [{ id: 'projectName', type: 'string', updated: true }];

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    // CHANGE: Mock updateRegexValidation to return modified config
    (updateRegexValidation as any).mockReturnValue(mockUpdatedConfig);

    renderHook(() => useProjectFormConfig());

    expect(generateSchema).toHaveBeenCalledWith(mockUpdatedConfig);
    expect(generateInitialState).toHaveBeenCalledWith(mockUpdatedConfig);
    expect(generateFormStructure).toHaveBeenCalledWith(mockUpdatedConfig);
  });
});