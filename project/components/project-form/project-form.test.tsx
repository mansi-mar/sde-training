import { render, screen } from '@testing-library/react';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import userEvent from '@testing-library/user-event';

import configFallback from '@/json/config.json';
import { generateFormStructure, generateSchema } from '@/lib/utils';
import { getTranslation } from '@/tests/utils/translation-helper';

import { useProjectForm } from '../../hooks';

import ProjectForm from './project-form';

enum ProjectLabels {
  name = 'project_name',
  owner = 'project_additional_info.owner_name',
  ownerEmail = 'project_additional_info.owner_email_id',
  description = 'project_description',
}

const projectStructure = generateFormStructure(configFallback.project);
const formSchema = generateSchema(configFallback.project);

// Mock useAccountProjectStore
vi.mock('@/store/use-form', () => ({
  useAccountProjectStore: () => ({
    updateProjectState: vi.fn(),
    projectState: {
      [ProjectLabels.name]: '',
      [ProjectLabels.owner]: '',
      [ProjectLabels.ownerEmail]: '',
    },
  }),
}));

// Mock useProjectForm
vi.mock('../../hooks');

vi.mock(import('@coreai/component-library'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    // your mocked methods
    DialogContent: ({ children, ...props }) => <div {...props}>{children}</div>,
    DialogBody: ({ children }) => <div>{children}</div>,
    DialogFooter: ({ children }) => <div>{children}</div>,
    DialogHeader: ({ children }) => <div>{children}</div>,
    DialogTitle: ({ children }) => <div>{children}</div>,
  };
});

const t = getTranslation('account_onboarding');

describe('ProjectForm Component', () => {
  const onSuccessMock = vi.fn();
  const onBackMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onSuccess when the form is valid and submitted', async () => {
    const validateMock = vi.fn().mockResolvedValue(true);
    useProjectForm.mockReturnValue({
      form: {
        [ProjectLabels.name]: 'Valid Project',
        [ProjectLabels.owner]: 'Valid Owner',
        [ProjectLabels.ownerEmail]: 'valid@example.com',
      },
      errors: {},
      handleChange: vi.fn(),
      validate: validateMock,
    });

    render(
      <ProjectForm
        onSuccess={onSuccessMock}
        onBack={onBackMock}
        isSubmitting={false}
        projectStructure={projectStructure}
        formSchema={formSchema}
      />,
    );

    await userEvent.click(screen.getByText(t('save')));

    expect(validateMock).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalledWith({
      [ProjectLabels.name]: 'Valid Project',
      [ProjectLabels.owner]: 'Valid Owner',
      [ProjectLabels.ownerEmail]: 'valid@example.com',
    });
  });

  it('does not call onSuccess when the form is invalid', async () => {
    const validateMock = vi.fn().mockResolvedValue(false);
    useProjectForm.mockReturnValue({
      form: {
        [ProjectLabels.name]: '',
        [ProjectLabels.owner]: '',
        [ProjectLabels.ownerEmail]: '',
      },
      errors: {
        [ProjectLabels.name]: 'project_name_required',
        [ProjectLabels.owner]: 'project_owner_required',
        [ProjectLabels.ownerEmail]: 'project_owner_email_required',
      },
      handleChange: vi.fn(),
      validate: validateMock,
    });

    render(
      <ProjectForm
        onSuccess={onSuccessMock}
        onBack={onBackMock}
        isSubmitting={false}
        projectStructure={projectStructure}
        formSchema={formSchema}
      />,
    );

    await userEvent.click(screen.getByText(t('save')));

    expect(validateMock).toHaveBeenCalled();
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('displays validation errors when the form is invalid', () => {
    useProjectForm.mockReturnValue({
      form: {
        [ProjectLabels.name]: '',
        [ProjectLabels.owner]: '',
        [ProjectLabels.ownerEmail]: '',
      },
      errors: {
        [ProjectLabels.name]: 'project_name_required',
        [ProjectLabels.owner]: 'project_owner_required',
        [ProjectLabels.ownerEmail]: 'project_owner_email_required',
      },
      handleChange: vi.fn(),
      validate: vi.fn(),
    });

    render(
      <ProjectForm
        onSuccess={onSuccessMock}
        onBack={onBackMock}
        isSubmitting={false}
        projectStructure={projectStructure}
        formSchema={formSchema}
      />,
    );

    expect(screen.getByText(t('project_name_required'))).toBeInTheDocument();
    expect(screen.getByText(t('project_owner_required'))).toBeInTheDocument();
    expect(
      screen.getByText(t('project_owner_email_required')),
    ).toBeInTheDocument();
  });
});

describe('ProjectForm Footer Button', () => {
  const onSuccessMock = vi.fn();
  const onBackMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls onBack when the back button is clicked', async () => {
    render(
      <ProjectForm
        onSuccess={onSuccessMock}
        onBack={onBackMock}
        isSubmitting={false}
        projectStructure={projectStructure}
        formSchema={formSchema}
      />,
    );

    await userEvent.click(screen.getByText(t('back')));
    expect(onBackMock).toHaveBeenCalled();
  });

  it('disables the submit button when isSubmitting is true', () => {
    render(
      <ProjectForm
        onSuccess={onSuccessMock}
        onBack={onBackMock}
        isSubmitting={true}
        projectStructure={projectStructure}
        formSchema={formSchema}
      />,
    );

    expect(screen.getByRole('button', { name: t('save') })).toBeDisabled();
  });
});

describe('ProjectForm UI Rendering', () => {
  const onSuccessMock = vi.fn();
  const onBackMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form fields correctly', () => {
    useProjectForm.mockReturnValue({
      form: {
        [ProjectLabels.name]: '',
        [ProjectLabels.owner]: '',
        [ProjectLabels.ownerEmail]: '',
      },
      errors: {},
      handleChange: vi.fn(),
      validate: vi.fn(),
    });

    render(
      <ProjectForm
        onSuccess={onSuccessMock}
        onBack={onBackMock}
        isSubmitting={false}
        projectStructure={projectStructure}
        formSchema={formSchema}
      />,
    );

    expect(screen.getByText(t('add_project'))).toBeInTheDocument();
    expect(screen.getByTestId('project-content')).toBeInTheDocument();
  });
});
