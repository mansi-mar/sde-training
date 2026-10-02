import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

import { getTranslation } from '@/tests/utils/translation-helper';

import ProjectDashboardCard from './project-dashboard-card';

const translations = getTranslation('account_onboarding');

// Mock the useTranslations hook
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock the CardMain component
vi.mock('@/components/card/card-main', () => ({
  CardMain: ({ count, title, description, controls }: any) => (
    <div data-testid="card-main">
      <div>{translations(title).toUpperCase()}</div>
      <div>{translations(description)}</div>
      <div>{count}</div>
      <div>
        {controls.titleControls
          ? 'Title Controls Present'
          : 'No Title Controls'}
      </div>
    </div>
  ),
}));

describe('ProjectDashboardCard Component', () => {
  it('renders with correct title, description, and count', () => {
    render(<ProjectDashboardCard count={50} />);

    expect(
      screen.getByText(translations('projects_card_title').toUpperCase()),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations('projects_card_content')),
    ).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('renders with title controls when provided', () => {
    render(<ProjectDashboardCard count={50} />);

    expect(screen.getByText('Title Controls Present')).toBeInTheDocument();
  });
});
