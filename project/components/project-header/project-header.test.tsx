import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { describe, it, expect, vi } from 'vitest';

import { ProjectHeader } from '@features/project/components';

vi.mock('@/components', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    SkeletonInfo: ({ classname }: { classname: string }) => (
      <div className={classname}>Loading...</div>
    ),
  };
});

describe('ProjectHeader Component', () => {
  const translations = {
    accountOwner: 'Account Owner:',
    backButton: 'Back',
  };

  const mockHandleBackClick = vi.fn();

  it('should render back button with correct text', () => {
    render(
      <ProjectHeader
        accountOwner="John Doe"
        handleBackClick={mockHandleBackClick}
        translations={translations}
        dataStates={{ isLoading: false, isFetching: false }}
      />,
    );

    const backButton = screen.getByText('Back');
    expect(backButton).toBeInTheDocument();
  });

  it('should call handleBackClick when back button is clicked', () => {
    render(
      <ProjectHeader
        accountOwner="John Doe"
        handleBackClick={mockHandleBackClick}
        translations={translations}
        dataStates={{ isLoading: false, isFetching: false }}
      />,
    );

    const backButton = screen.getByText('Back');
    fireEvent.click(backButton);

    expect(mockHandleBackClick).toHaveBeenCalled();
  });

  it('should render SkeletonInfo when loading', () => {
    render(
      <ProjectHeader
        accountOwner="John Doe"
        handleBackClick={mockHandleBackClick}
        translations={translations}
        dataStates={{ isLoading: true, isFetching: false }}
      />,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render account owner when not loading', () => {
    render(
      <ProjectHeader
        accountOwner="John Doe"
        handleBackClick={mockHandleBackClick}
        translations={translations}
        dataStates={{ isLoading: false, isFetching: false }}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should handle undefined account owner gracefully', () => {
    render(
      <ProjectHeader
        accountOwner={undefined}
        handleBackClick={mockHandleBackClick}
        translations={translations}
        dataStates={{ isLoading: false, isFetching: false }}
      />,
    );

    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
