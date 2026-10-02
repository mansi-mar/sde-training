import { useCallback, useState } from 'react';

import useModalStore from '@/store/use-modal/use-modal';
import { ProjectListTransformed } from '@features/project/types/project-list';

const useProjectSelection = (accountName: string) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const { setIsOpen, setSelectedItem } = useModalStore((state) => ({
    setIsOpen: state.setIsOpen,
    setSelectedItem: state.setSelectedItem,
  }));

  const handleSelectedProject = useCallback(
    (project: ProjectListTransformed) => {
      setSelectedProject(project.projectName);
    },
    [],
  );

  const handleRemoveProject = (project: ProjectListTransformed) => {
    setSelectedItem({ ...project, accountName: accountName });
    setIsOpen(true);
  };

  const handleResetProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return {
    selectedProject,
    handleSelectedProject,
    handleResetProject,
    handleRemoveProject,
  };
};

export default useProjectSelection;
