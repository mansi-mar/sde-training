import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAppConfig } from '@/hooks/use-app-config';
import {
  generateFormStructure,
  generateInitialState,
  generateSchema,
  updateRegexValidation,
} from '@/lib/utils';
import { useFeatureConfig } from '@repo/ui/organisms';
import { FieldType } from '@/types';

import { useProjectEditFormConfig } from './use-project-edit-config';

vi.mock('@/hooks/use-app-config', () => ({
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

describe('useProjectEditFormConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useFeatureConfig as any).mockReturnValue({});

    // pass-through so config remains predictable
    (updateRegexValidation as any).mockImplementation((config) => config);
  });

  it('should return loading state when config is loading', () => {
    (useAppConfig as any).mockReturnValue({
      config: null,
      isLoading: true,
    });

    const { result } = renderHook(() => useProjectEditFormConfig());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.formSchema).toBeUndefined();
    expect(result.current.initialState).toEqual({});
    expect(result.current.formStructure).toEqual([]);
  });

  it('should return empty formConfig when projects config is not available', () => {
    (useAppConfig as any).mockReturnValue({
      config: {},
      isLoading: false,
    });

    const { result } = renderHook(() => useProjectEditFormConfig());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.formSchema).toBeUndefined();
    expect(result.current.initialState).toEqual({});
    expect(result.current.formStructure).toEqual([]);
  });

  it('should generate form configuration when projects config is available', () => {
    const mockProjectsConfig: FieldType[] = [
      { id: 'project_name', type: 'string' } as FieldType,
    ];

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

    const { result } = renderHook(() => useProjectEditFormConfig());

    const expectedConfig = [
      {
        id: 'project_name',
        type: 'string',
        disabled: true,
        validation: undefined,
      },
    ];

    expect(result.current.isLoading).toBe(false);
    expect(result.current.formSchema).toBe(mockSchema);
    expect(result.current.initialState).toBe(mockInitialState);
    expect(result.current.formStructure).toBe(mockFormStructure);

    // CHANGE: Update assertion to use projectFieldConfigMapping instead of hardcoded array
    expect(updateRegexValidation).toHaveBeenCalledWith(
      expectedConfig,
      {},
      { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
    );

    expect(generateSchema).toHaveBeenCalledWith(expectedConfig);
    expect(generateInitialState).toHaveBeenCalledWith(expectedConfig);
    expect(generateFormStructure).toHaveBeenCalledWith(expectedConfig);
  });

  // CHANGE: Add test to verify project_name field is properly disabled and validation removed
  it('should disable project_name field and remove validation in flat array structure', () => {
    const mockProjectsConfig: FieldType[] = [
      { 
        id: 'project_name', 
        type: 'string',
        validation: {
          required: { message: 'required' },
          regex: { message: 'invalid' }
        }
      } as FieldType,
      { 
        id: 'project_description', 
        type: 'string',
        validation: {
          required: { message: 'required' }
        }
      } as FieldType
    ];

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    renderHook(() => useProjectEditFormConfig());

    const expectedConfig = [
      {
        id: 'project_name',
        type: 'string',
        disabled: true,
        validation: undefined,
      },
      {
        id: 'project_description',
        type: 'string',
        validation: {
          required: { message: 'required' }
        }
      }
    ];

    expect(updateRegexValidation).toHaveBeenCalledWith(
      expectedConfig,
      {},
      { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
    );
  });

  // CHANGE: Add test to verify project_name field is properly disabled in nested array structure
  it('should disable project_name field and remove validation in nested array structure', () => {
    const mockProjectsConfig = [
      [
        { 
          id: 'project_name', 
          type: 'string',
          validation: {
            required: { message: 'required' },
            regex: { message: 'invalid' }
          }
        } as FieldType,
        { 
          id: 'project_owner', 
          type: 'string',
          validation: {
            required: { message: 'required' }
          }
        } as FieldType
      ],
      [
        { 
          id: 'project_description', 
          type: 'string',
          validation: {
            required: { message: 'required' }
          }
        } as FieldType
      ]
    ];

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    renderHook(() => useProjectEditFormConfig());

    const expectedConfig = [
      [
        {
          id: 'project_name',
          type: 'string',
          disabled: true,
          validation: undefined,
        },
        {
          id: 'project_owner',
          type: 'string',
          validation: {
            required: { message: 'required' }
          }
        }
      ],
      [
        {
          id: 'project_description',
          type: 'string',
          validation: {
            required: { message: 'required' }
          }
        }
      ]
    ];

    expect(updateRegexValidation).toHaveBeenCalledWith(
      expectedConfig,
      {},
      { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
    );
  });

  // CHANGE: Add test to verify updateRegexValidation is called with correct parameters
  it('should call updateRegexValidation with authConfig and projectFieldConfigMapping', () => {
    const mockProjectsConfig: FieldType[] = [
      { id: 'project_name', type: 'string' } as FieldType,
    ];
    const mockAuthConfig = { NAME_REGEX: '^[a-zA-Z]*$', DESC_REGEX: '^[a-zA-Z0-9]*$' };

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    (useFeatureConfig as any).mockReturnValue(mockAuthConfig);

    renderHook(() => useProjectEditFormConfig());

    const expectedConfig = [
      {
        id: 'project_name',
        type: 'string',
        disabled: true,
        validation: undefined,
      },
    ];

    expect(updateRegexValidation).toHaveBeenCalledWith(
      expectedConfig,
      mockAuthConfig,
      { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
    );
  });

  // CHANGE: Add test to verify memoization behavior with authConfig changes
  it('should recalculate projectEditConfig when authConfig changes', () => {
    const mockProjectsConfig: FieldType[] = [
      { id: 'project_name', type: 'string' } as FieldType,
    ];
    const initialAuthConfig = { NAME_REGEX: '^[a-zA-Z]*$' };
    const updatedAuthConfig = { NAME_REGEX: '^[a-zA-Z0-9]*$' };

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    (useFeatureConfig as any).mockReturnValue(initialAuthConfig);

    const { rerender } = renderHook(() => useProjectEditFormConfig());

    expect(updateRegexValidation).toHaveBeenCalledTimes(1);

    // Change authConfig
    (useFeatureConfig as any).mockReturnValue(updatedAuthConfig);
    rerender();

    expect(updateRegexValidation).toHaveBeenCalledTimes(2);
    expect(updateRegexValidation).toHaveBeenLastCalledWith(
      expect.any(Array),
      updatedAuthConfig,
      { 'project_name': 'NAME_REGEX', 'project_description': 'DESC_REGEX' },
    );
  });

  // CHANGE: Add test to verify memoization behavior with apiConfig changes
  it('should recalculate projectEditConfig when apiConfig.project changes', () => {
    const initialProjectsConfig: FieldType[] = [
      { id: 'project_name', type: 'string' } as FieldType,
    ];
    const updatedProjectsConfig: FieldType[] = [
      { id: 'project_name', type: 'string' } as FieldType,
      { id: 'project_description', type: 'textarea' } as FieldType
    ];

    (useAppConfig as any).mockReturnValue({
      config: { project: initialProjectsConfig },
      isLoading: false,
    });

    const { rerender } = renderHook(() => useProjectEditFormConfig());

    expect(updateRegexValidation).toHaveBeenCalledTimes(1);

    // Change apiConfig.project
    (useAppConfig as any).mockReturnValue({
      config: { project: updatedProjectsConfig },
      isLoading: false,
    });
    rerender();

    expect(updateRegexValidation).toHaveBeenCalledTimes(2);
  });

  // CHANGE: Add test to verify structuredClone is used for immutability
  it('should use structuredClone to avoid mutating original config', () => {
    const mockProjectsConfig: FieldType[] = [
      { 
        id: 'project_name', 
        type: 'string',
        validation: { required: { message: 'required' } }
      } as FieldType
    ];

    // Create a spy on structuredClone
    const structuredCloneSpy = vi.spyOn(global, 'structuredClone');

    (useAppConfig as any).mockReturnValue({
      config: { project: mockProjectsConfig },
      isLoading: false,
    });

    renderHook(() => useProjectEditFormConfig());

    expect(structuredCloneSpy).toHaveBeenCalledWith(mockProjectsConfig);
    
    // Verify original config is not mutated
    expect(mockProjectsConfig[0].validation).toBeDefined();
    
    structuredCloneSpy.mockRestore();
  });
});