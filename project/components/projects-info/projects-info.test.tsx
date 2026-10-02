import { render, screen } from '@testing-library/react';
import React from 'react';

import { describe, it, expect, vi } from 'vitest';

import { ProjectsInfo } from '@features/project/components';

// Mock components
vi.mock('@/components', () => ({
  SkeletonInfo: ({ classname }: { classname: string }) => (
    <div className={classname} data-testid="skeleton-info-loader">Loading...</div>
  ),
  TruncatedText: ({ text, 'data-testid': dataTestId }: { text: string; 'data-testid'?: string }) => (
    <span data-testid={dataTestId || 'truncated-text'}>
      {text}
    </span>
  ),
}));

describe('ProjectsInfo Component', () => {
  const translations = {
    singleProject: 'Project',
    multipleProjects: 'Projects',
  };

  it('should render SkeletonInfo when loading', () => {
    render(
      <ProjectsInfo
        accountName="Test Account"
        projectCount={2}
        translations={translations}
        dataStates={{ isLoading: true, isFetching: false }}
      />,
    );

    expect(screen.getByTestId('skeleton-info-loader')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render SkeletonInfo when fetching', () => {
    render(
      <ProjectsInfo
        accountName="Test Account"
        projectCount={2}
        translations={translations}
        dataStates={{ isLoading: false, isFetching: true }}
      />,
    );

    expect(screen.getByTestId('skeleton-info-loader')).toBeInTheDocument();
  });

  it('should render account name and project count when not loading', () => {
    render(
      <ProjectsInfo
        accountName="Test Account"
        projectCount={1}
        translations={translations}
        dataStates={{ isLoading: false, isFetching: false }}
      />,
    );

    expect(screen.getByTestId('truncated-text')).toBeInTheDocument();
    expect(screen.getByTestId('truncated-text')).toHaveTextContent('Test Account');
    expect(screen.getByTestId('projects-info')).toHaveTextContent('(1 Project)');
  });

  it('should render multiple projects text when project count is more than one', () => {
    render(
      <ProjectsInfo
        accountName="Test Account"
        projectCount={3}
        translations={translations}
        dataStates={{ isLoading: false, isFetching: false }}
      />,
    );

    expect(screen.getByTestId('projects-info')).toHaveTextContent('(3 Projects)');
  });

  it('should handle undefined account name', () => {
    render(
      <ProjectsInfo
        accountName={undefined}
        projectCount={2}
        translations={translations}
        dataStates={{ isLoading: false, isFetching: false }}
      />,
    );

    expect(screen.getByTestId('truncated-text')).toBeInTheDocument();
    expect(screen.getByTestId('truncated-text')).toHaveTextContent('');
    expect(screen.getByTestId('projects-info')).toHaveTextContent('(2 Projects)');
  });

  it('should render skeleton when both loading and fetching', () => {
    render(
      <ProjectsInfo
        accountName="Test Account"
        projectCount={5}
        translations={translations}
        dataStates={{ isLoading: true, isFetching: true }}
      />,
    );

    expect(screen.getByTestId('skeleton-info-loader')).toBeInTheDocument();
  });

  it('should handle string project count', () => {
    render(
      <ProjectsInfo
        accountName="Test Account"
        projectCount="5"
        translations={translations}
        dataStates={{ isLoading: false, isFetching: false }}
      />,
    );

    expect(screen.getByTestId('projects-info')).toHaveTextContent('(5 Projects)');
  });
});