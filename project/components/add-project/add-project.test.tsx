import { render, screen, fireEvent } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import configFallback from '@/json/config.json';
import {
  generateFormStructure,
  generateInitialState,
  generateSchema,
} from '@/lib/utils';
import { usePermissionStore } from '@/store/use-permission';
import { getTranslation } from '@/tests/utils/translation-helper';

import AddProject from './add-project';

vi.mock(import('@/features/project/hooks'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // your mocked methods
    useAddProject: () => ({
      isPending: false,
      mutate: vi.fn(),
    }),
    useProjectFormConfig: () => ({
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

vi.mock('@/store/use-permission', () => ({
  usePermissionStore: vi.fn(),
}));

const t = getTranslation('account_onboarding');
describe('AddProject Component', () => {
  beforeEach(() => {
    usePermissionStore.mockReturnValue(['super_admin']);
  });
  it('renders button with correct label', () => {
    render(<AddProject accountName="accountOnboarding" />);
    expect(screen.getByText(t('add_project'))).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens modal on button click', async () => {
    render(<AddProject accountName="accountOnboarding" />);
    const addButton = screen.getByText(t('add_project'));
    fireEvent.click(addButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes modal on close action', async () => {
    render(<AddProject accountName="accountOnboarding" />);
    fireEvent.click(screen.getByText(t('add_project')));
    const closeButton = screen.getByLabelText('Close Dialog');
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onSubmit function when form is submitted', async () => {
    render(<AddProject accountName="accountOnboarding" />);
    fireEvent.click(screen.getByText(t('add_project')));
    const saveButton = screen.getByText(t('save'));
    fireEvent.click(saveButton);
    // Here you should verify that the API call was made (mock API function if needed)
  });
});
