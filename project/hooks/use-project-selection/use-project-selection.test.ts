import { renderHook, act } from '@testing-library/react';

import { describe, it, expect } from 'vitest';

import { ProjectListTransformed } from '@features/project/types/project-list';

import useProjectSelection from './use-project-selection';

describe('useProjectSelection Hook', () => {
  it('should initialize with no selected project', () => {
    const { result } = renderHook(() => useProjectSelection());

    expect(result.current.selectedProject).toBeNull();
  });

  it('should set selected project correctly', () => {
    const { result } = renderHook(() => useProjectSelection());
    const project: ProjectListTransformed = { projectName: 'Project1' };

    act(() => {
      result.current.handleSelectedProject(project);
    });

    expect(result.current.selectedProject).toBe('Project1');
  });

  it('should reset selected project', () => {
    const { result } = renderHook(() => useProjectSelection());
    const project: ProjectListTransformed = { projectName: 'Project1' };

    act(() => {
      result.current.handleSelectedProject(project);
    });

    expect(result.current.selectedProject).toBe('Project1');

    act(() => {
      result.current.handleResetProject();
    });

    expect(result.current.selectedProject).toBeNull();
  });
});
