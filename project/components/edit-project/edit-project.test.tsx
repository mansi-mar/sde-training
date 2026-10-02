import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { describe, it, expect, vi } from 'vitest';

import { useEditProject, useProject } from '@/features/project/hooks';
import configFallback from '@/json/config.json';
import {
  generateFormStructure,
  generateInitialState,
  generateSchema,
} from '@/lib/utils';
import { getTranslation } from '@/tests/utils/translation-helper';

import EditProject from './edit-project';

vi.mock('@/features/project/hooks', () => ({
  useProject: vi.fn(),
  useEditProject: vi.fn(),
  useProjectEditFormConfig: () => ({
    formStructure: generateFormStructure(configFallback.project),
    formSchema: generateSchema(configFallback.project),
    initialState: generateInitialState(configFallback.project),
    isLoading: false,
  }),
}));

vi.mock('@/store', () => ({
  useAccountProjectStore: () => ({
    resetStates: vi.fn(), // Prevent actual state change
  }),
}));

enum ProjectLabels {
  name = 'project_name',
  owner = 'project_additional_info.owner_name',
  ownerEmail = 'project_additional_info.owner_email_id',
  description = 'project_description',
}

const t = getTranslation('account_onboarding');

describe('EditProject Component', () => {
  const mockResetProjectName = vi.fn();

  it('renders modal when projectName is provided', () => {
    (useProject as vi.Mock).mockReturnValue({
      data: { project_name: 'Test Project' },
      isLoading: false,
    });

    (useEditProject as vi.Mock).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    });

    render(
      <EditProject
        accountName="testAccount"
        projectName="Test Project"
        resetProjectName={mockResetProjectName}
      />,
    );

    expect(screen.getByText(t('edit_project'))).toBeInTheDocument();
    expect(screen.getByText(t('save'))).toBeInTheDocument();
  });

  it('does not render modal when projectName is empty', () => {
    render(
      <EditProject
        accountName="testAccount"
        projectName=""
        resetProjectName={mockResetProjectName}
      />,
    );

    expect(screen.queryByText(t('edit_project'))).not.toBeInTheDocument();
  });

  it('calls resetProjectName when modal is closed', () => {
    (useProject as vi.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });

    (useEditProject as vi.Mock).mockReturnValue({
      isPending: false,
      mutate: vi.fn(),
    });

    render(
      <EditProject
        accountName="testAccount"
        projectName="Test Project"
        resetProjectName={mockResetProjectName}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(mockResetProjectName).toHaveBeenCalled();
  });

  it('submits form with updated project data', async () => {
    const mockMutate = vi.fn();

    (useProject as vi.Mock).mockReturnValue({
      data: {
        [ProjectLabels.name]: 'Project1',
        [ProjectLabels.owner]: 'XYZ',
        [ProjectLabels.ownerEmail]: 'xyz@abc.com',
        [ProjectLabels.description]: 'project description',
      },
      isLoading: false,
    });

    (useEditProject as vi.Mock).mockReturnValue({
      isPending: false,
      mutate: mockMutate,
    });

    render(
      <EditProject
        accountName="testAccount"
        projectName="Project1"
        resetProjectName={mockResetProjectName}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Wait for mutate function to be called
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
    });
  });
});
