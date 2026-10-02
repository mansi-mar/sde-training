import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import { vi, describe, beforeEach, it, expect } from 'vitest';

import useModalStore from '@/store/use-modal/use-modal';
import { getTranslation } from '@/tests/utils/translation-helper';

import { useRemoveProject } from '../../hooks/use-remove-project';

import RemoveProject from './remove-project';

// Mock the useRemoveProject hook
vi.mock('../../hooks/use-remove-project', () => ({
  useRemoveProject: vi.fn(),
}));

// Mock the useModalStore
vi.mock('@/store/use-modal/use-modal', () => ({
  __esModule: true,
  default: vi.fn(),
}));

const translations = getTranslation('account_onboarding');

describe('RemoveProject Component', () => {
  const mockModalStore = useModalStore as vi.Mock;
  const setIsOpenMock = vi.fn();
  const setSelectedItemMock = vi.fn();
  const mutateMock = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock the useRemoveProject hook implementation
    (useRemoveProject as vi.Mock).mockReturnValue({
      isPending: false,
      mutate: mutateMock,
    });
  });

  it('opens the modal when isOpen is set to true', () => {
    // Set isOpen to true to simulate the modal opening
    mockModalStore.mockImplementation((selector) =>
      selector({
        setIsOpen: setIsOpenMock,
        selectedItem: {
          accountName: 'testAccount',
          projectName: 'testProject',
        },
        setSelectedItem: setSelectedItemMock,
        isOpen: true,
      }),
    );

    render(<RemoveProject />);
    expect(
      screen.getByText(translations('remove_project_header')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(translations('remove_project_message')),
    ).toBeInTheDocument();
  });

  it('calls mutate with correct arguments when handleAccept is triggered', () => {
    mockModalStore.mockImplementation((selector) =>
      selector({
        setIsOpen: setIsOpenMock,
        selectedItem: {
          accountName: 'testAccount',
          projectName: 'testProject',
        },
        setSelectedItem: setSelectedItemMock,
        isOpen: true,
      }),
    );
    render(<RemoveProject />);
    const acceptButton = screen.getByText('Yes');
    fireEvent.click(acceptButton);

    expect(mutateMock).toHaveBeenCalledWith(
      { projectName: 'testProject' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    );
  });

  it('calls setIsOpen and setSelectedItem on successful mutation', () => {
    mockModalStore.mockImplementation((selector) =>
      selector({
        setIsOpen: setIsOpenMock,
        selectedItem: {
          accountName: 'testAccount',
          projectName: 'testProject',
        },
        setSelectedItem: setSelectedItemMock,
        isOpen: true,
      }),
    );
    render(<RemoveProject />);
    const acceptButton = screen.getByText('Yes');
    fireEvent.click(acceptButton);

    // Simulate onSuccess callback
    const onSuccessCallback = mutateMock.mock.calls[0][1].onSuccess;
    onSuccessCallback();

    expect(setIsOpenMock).toHaveBeenCalledWith(false);
    expect(setSelectedItemMock).toHaveBeenCalledWith(null);
  });
});
