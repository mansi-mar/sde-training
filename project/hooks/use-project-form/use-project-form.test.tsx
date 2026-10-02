import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useFormValidate, useHandleChange } from '@/hooks';

import { useProjectForm } from './use-project-form';

// Mock the useFormValidate and useHandleChange hooks
vi.mock('@/hooks', () => ({
  useFormValidate: vi.fn(),
  useHandleChange: vi.fn(),
}));

describe('useProjectForm', () => {
  const initialState = {
    projectName: '',
    projectOwner: '',
    projectOwnerEmail: '',
  };

  const mockSetForm = vi.fn();
  const mockHandleChange = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock useFormValidate
    useFormValidate.mockReturnValue({
      form: initialState,
      setForm: mockSetForm,
      errors: {},
      checkFormValidation: vi.fn(),
    });

    // Mock useHandleChange
    vi.mocked(useHandleChange).mockReturnValue(mockHandleChange);
  });

  it('initializes with the correct form state and no errors', () => {
    const { form, errors } = useProjectForm(initialState);

    expect(form).toEqual(initialState);
    expect(errors).toEqual({});
  });

  it('updates the form state using handleChange', () => {
    const { handleChange } = useProjectForm(initialState);

    const event = { target: { value: 'New Project' } };
    handleChange('projectName', event);

    expect(mockHandleChange).toHaveBeenCalledWith(
      mockSetForm,
      'projectName',
      event,
    );
  });

  it('validates the form and returns false when invalid', async () => {
    const mockValidate = vi.fn().mockResolvedValue({
      success: false,
    });

    useFormValidate.mockReturnValue({
      form: initialState,
      setForm: mockSetForm,
      errors: {},
      checkFormValidation: mockValidate,
    });

    const { validate } = useProjectForm(initialState);

    const validationResult = await validate();

    expect(validationResult.success).toBe(false);
  });

  it('validates the form and returns no errors when valid', async () => {
    const mockValidate = vi.fn().mockResolvedValue({
      success: true,
      errors: {},
    });

    useFormValidate.mockReturnValue({
      form: {
        projectName: 'Valid Project',
        projectOwner: 'Valid Owner',
        projectOwnerEmail: 'valid@example.com',
      },
      setForm: mockSetForm,
      errors: {},
      checkFormValidation: mockValidate,
    });

    const { validate, errors } = useProjectForm(initialState);

    const validationResult = await validate();

    expect(validationResult.success).toBe(true);
    expect(errors).toEqual({});
  });
});
