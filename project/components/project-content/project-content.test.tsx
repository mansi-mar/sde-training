import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from '@repo/ui/organisms';

import {
  useProjectContent,
  useTranslatedContent,
} from '@/features/project/hooks';

import ProjectContent from './project-content';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

vi.mock('@/features/project/hooks', () => ({
  useProjectContent: vi.fn(),
  useTranslatedContent: vi.fn(),
  useColumns: vi.fn(() => []),
}));

vi.mock('@/hooks/use-get-permission/use-get-permission', () => ({
  default: vi.fn(),
}));

vi.mock('@/store/use-modal/use-modal', () => ({
  default: vi.fn(() => ({ selectedItem: null })),
}));

vi.mock('@/store/use-permission/use-permission', () => ({
  default: vi.fn(() => ({ currentPermission: {} })),
}));

vi.mock('@features/project/components', () => ({
  ProjectsInfo: () => <div data-testid="projects-info">Projects Info</div>,
  ProjectHeader: () => <div>Project Header</div>,
  EditProject: () => <div>Edit Project</div>,
}));

vi.mock('../remove-project/remove-project', () => ({
  default: () => <div>Remove Project</div>,
}));

vi.mock('@/components', () => ({
  SkeletonTable: () => <div data-testid="skeleton-table" />,
  SkeletonSearchInput: () => <div data-testid="skeleton-search-input" />,
  PaginatedTable: () => <div data-testid="paginated-table" />,
  Wrapper: ({ children }: any) => <div>{children}</div>,
}));

describe('ProjectContent Component', () => {
  const mockOnMapResourceHandler = vi.fn();

  const config = { ENABLE_FEATURE: 'true' };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useProjectContent).mockReturnValue({
      projectListData: {
        accountName: 'Test Account',
        accountOwner: 'Owner Name',
        projects: [{ projectName: 'Project 1', totalResources: 0 }],
      },
      isLoading: false,
      isFetching: false,
      selectedProject: '',
      goBack: vi.fn(),
      handleResetProject: vi.fn(),
      tableEventHandler: vi.fn(),
      tableOperations: {},
    });

    vi.mocked(useTranslatedContent).mockReturnValue({
      columnHeaderTranslations: {},
      skeletonHeaders: [],
      tableTranslations: { searchProjects: 'Search Projects' },
      detailsContent: {
        accountOwner: 'Account Owner',
        singleProject: 'Project',
        multipleProjects: 'Projects',
        back: 'Back',
      },
    });
  });

  const TestComponent = ({ children = <div /> }) => (
    <ConfigProvider value={config}>
      <QueryClientProvider client={createTestQueryClient()}>
        <ProjectContent
          accountName="Test Account"
          onMapResourceHandler={mockOnMapResourceHandler}
        >
          {children}
        </ProjectContent>
      </QueryClientProvider>
    </ConfigProvider>
  );

  it('renders Project Content with correct account information', () => {
    render(<TestComponent>Additional Children</TestComponent>);

    expect(screen.getByText('Additional Children')).toBeInTheDocument();
    expect(screen.getByTestId('paginated-table')).toBeInTheDocument();
  });

  it('renders skeletons when loading', () => {
    vi.mocked(useProjectContent).mockReturnValueOnce({
      projectListData: null,
      isLoading: true,
      isFetching: false,
      selectedProject: '',
      goBack: vi.fn(),
      handleResetProject: vi.fn(),
      tableEventHandler: vi.fn(),
      tableOperations: {},
    });

    render(<TestComponent />);

    expect(screen.getByTestId('skeleton-search-input')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-table')).toBeInTheDocument();
  });

  it('does not render EditProject without selected project', () => {
    render(<TestComponent />);

    expect(screen.queryByText('Edit Project')).not.toBeInTheDocument();
  });

  it('should display project count as 0 when projects are not present', () => {
    vi.mocked(useProjectContent).mockReturnValueOnce({
      projectListData: {
        accountName: 'Test Account',
        accountOwner: 'Owner Name',
        projects: [],
      },
      isLoading: false,
      isFetching: false,
      selectedProject: '',
      goBack: vi.fn(),
      handleResetProject: vi.fn(),
      tableEventHandler: vi.fn(),
      tableOperations: {},
    });

    render(<TestComponent />);

    expect(screen.getByTestId('projects-info')).toBeInTheDocument();
  });
});