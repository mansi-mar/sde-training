'use client';

import React from 'react';

import RemoveModal from '@/components/remove-modal/remove-modal';
import useModalStore from '@/store/use-modal/use-modal';

import { useRemoveProject } from '../../hooks/use-remove-project';
import { removeProject } from '../../services/remove-project';

const removeService = removeProject();
const RemoveProject = () => {
  const { setIsOpen, selectedItem, setSelectedItem } = useModalStore(
    (state) => ({
      setIsOpen: state.setIsOpen,
      selectedItem: state.selectedItem,
      setSelectedItem: state.setSelectedItem,
    }),
  );
  const { isPending, mutate } = useRemoveProject(
    removeService,
    selectedItem?.accountName,
  );
  const handleAccept = () => {
    mutate(
      { projectName: selectedItem?.projectName },
      {
        onSuccess: () => {
          setIsOpen(false);
          setSelectedItem(null);
        },
      },
    );
  };
  return (
    <RemoveModal
      headerText="remove_project_header"
      removeMessage={'remove_project_message'}
      handleAccept={handleAccept}
      isPending={isPending}
    />
  );
};

export default RemoveProject;
