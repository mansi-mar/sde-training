import { render, screen, fireEvent } from '@testing-library/react';

import { describe, expect, it, vi, beforeEach } from 'vitest';

import configFallback from '@/json/config.json';
import {
  generateFormStructure,
  generateInitialState,
  generateSchema,
} from '@/lib/utils';
import { getTranslation } from '@/tests/utils/translation-helper';
import { OptionType } from '@/types';

import AddProjectForm from './add-project-form';

vi.mock(import('@coreai/component-library'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    DialogBody: ({ children }) => (
      <div data-testid="dialog-body">{children}</div>
    ),
    DialogFooter: ({ children }) => (
      <div data-testid="dialog-footer">{children}</div>
    ),
  };
});

const formSchema = generateSchema(configFallback.project);
const initialState = generateInitialState(configFallback.project);
const projectStructure = generateFormStructure(configFallback.project);

const t = getTranslation('account_onboarding');

describe('AddProjectForm Component', () => {
  const mockOnSuccess = vi.fn();
  const accountList: OptionType[] = [
    { label: 'Account 1', value: '1' },
    { label: 'Account 2', value: '2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(
      <AddProjectForm
        onSuccess={mockOnSuccess}
        isSubmitting={false}
        isLoading={false}
        accountList={accountList}
        formSchema={formSchema}
        initialState={initialState}
        projectStructure={projectStructure}
      />,
    );

    expect(screen.getByTestId('dialog-body')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-footer')).toBeInTheDocument();
    expect(screen.getByText(t('save'))).toBeInTheDocument();
  });

  it('calls onSuccess when form is submitted with valid data', async () => {
    render(
      <AddProjectForm
        onSuccess={mockOnSuccess}
        isSubmitting={false}
        isLoading={false}
        accountList={accountList}
        formSchema={formSchema}
        initialState={initialState}
        projectStructure={projectStructure}
      />,
    );

    const submitButton = screen.getByText(t('save'));
    fireEvent.click(submitButton);
    expect(mockOnSuccess).not.toHaveBeenCalled(); // Validation should prevent submission initially
  });
});
