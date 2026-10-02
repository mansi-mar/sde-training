import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import userEvent from '@testing-library/user-event';

import { useAccountNames } from '@/features/project/hooks';
import configFallback from '@/json/config.json';
import {
  generateFormStructure,
  generateInitialState,
  generateSchema,
} from '@/lib/utils';
import { usePermissionStore } from '@/store/use-permission';
import { getTranslation } from '@/tests/utils/translation-helper';

import { AddProjectSelectAccount } from './add-project-select-account';

// Mock dependencies
const mutateMock = vi.fn();
const checkFormValidationMock = vi.fn();
const setFormMock = vi.fn();
const resetFormMock = vi.fn();

vi.mock(import('@/features/project/hooks'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // your mocked methods
    useAccountNames: vi.fn(() => ({ accountNames: [], isFetching: false })),
    useAddProject: vi.fn(() => ({ isPending: false, mutate: mutateMock })),

    useProjectWithAccountFormConfig: () => ({
      formStructure: generateFormStructure(configFallback.project),
      formSchema: generateSchema(configFallback.project),
      initialState: generateInitialState(configFallback.project),
      configLoading: false,
    }),
  };
});

vi.mock('@/store', () => ({
  useAccountProjectStore: () => ({
    resetStates: vi.fn(), // Prevent actual state change
  }),
}));

vi.mock(import('@/hooks'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // your mocked methods
    useClientRouter: vi.fn(() => ({ navigate: vi.fn() })),
    useFormValidate: vi.fn(() => ({
      form: {
        accountName: '',
        projectName: '',
        projectOwner: '',
        projectOwnerEmail: '',
      },
      setForm: setFormMock,
      resetForm: resetFormMock,
      errors: {},
      checkFormValidation: checkFormValidationMock,
      isValidating: false,
    })),
    useHandleChange: vi.fn(() => vi.fn()),
  };
});

vi.mock('@/store/use-permission', () => ({
  usePermissionStore: vi.fn(),
}));

const t = getTranslation('account_onboarding');
describe('AddProjectSelectAccount Component', () => {
  beforeEach(() => {
    usePermissionStore.mockReturnValue(['super_admin']);
  });
  it('renders without crashing', () => {
    render(
      <AddProjectSelectAccount>
        <button>Open Dialog</button>
      </AddProjectSelectAccount>,
    );
    expect(screen.getByText('Open Dialog')).toBeInTheDocument();
  });

  it('opens and closes the dialog', async () => {
    render(
      <AddProjectSelectAccount>
        <button>Open Dialog</button>
      </AddProjectSelectAccount>,
    );

    fireEvent.click(screen.getByText('Open Dialog'));
    expect(screen.getByTestId('test-dialog-content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    await waitFor(() => {
      expect(
        screen.queryByTestId('test-dialog-content'),
      ).not.toBeInTheDocument();
    });
  });

  it('submits the form when valid data is entered', async () => {
    checkFormValidationMock.mockResolvedValue(true); // Ensure validation passes
    render(
      <AddProjectSelectAccount>
        <button>Open Dialog</button>
      </AddProjectSelectAccount>,
    );

    await userEvent.click(screen.getByText('Open Dialog'));

    const projectName = screen.getByLabelText(t('projectName'));
    const projectOwner = screen.getByLabelText(t('projectOwner'));
    const projectOwnerEmail = screen.getByLabelText(t('projectOwnerEmail'));

    await userEvent.type(projectName, 'Valid Name');
    await userEvent.type(projectOwner, 'Valid Owner');
    await userEvent.type(projectOwnerEmail, 'valid@example.com');

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalled();
    });
  });

  it('it calls form validation mock on save', async () => {
    checkFormValidationMock.mockResolvedValue(false); // Ensure validation fails
    useAccountNames.mockResolvedValue({
      accountNames: null,
      isFetching: false,
    });
    render(
      <AddProjectSelectAccount>
        <button>Open Dialog</button>
      </AddProjectSelectAccount>,
    );

    fireEvent.click(screen.getByText('Open Dialog'));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(checkFormValidationMock).toHaveBeenCalled();
    });
  });
});
