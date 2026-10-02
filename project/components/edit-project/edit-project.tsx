'use client';

import React, { useCallback } from 'react';

import { useTranslations } from 'next-intl';

import { CreateFormModal } from '@/components/forms';
import {
  useEditProject,
  useProject,
  useProjectEditFormConfig,
} from '@/features/project/hooks';
import { editProject, getProject } from '@/features/project/services';
import { useModalMount } from '@/hooks';

const projectService = getProject();
const projectEditService = editProject();

interface EditProjectType {
  accountName: string;
  projectName: string;
  resetProjectName: () => void;
}

const EditProject = ({
  accountName,
  projectName,
  resetProjectName,
}: EditProjectType) => {
  const t = useTranslations('account_onboarding');
  const { isModalMounted } = useModalMount();
  const { data: selectedProject, isLoading: isFetchingProject } = useProject(
    projectService,
    { accountName, projectName },
    isModalMounted,
  );
  const { formStructure, formSchema, initialState, isLoading } =
    useProjectEditFormConfig();

  const { isPending, mutate } = useEditProject(projectEditService);

  const onSubmit = (updatedProjectData: any) => {
    // Make API call with the selected project data
    mutate(
      { accountName, project: updatedProjectData },
      {
        onSuccess: () => {
          onCloseModal();
        },
      },
    );
  };

  const onCloseModal = useCallback(() => {
    resetProjectName();
  }, [resetProjectName]);

  return (
    <section id="edit-project">
      {/* Project Form Modal */}
      {!!projectName && !isLoading && (
        <CreateFormModal
          openModal={!!projectName}
          onCloseModal={onCloseModal}
          title={t('edit_project')}
          onSubmit={onSubmit}
          submitButtonLabel={t('save')}
          initialState={selectedProject || initialState}
          formSchema={formSchema!}
          formStructure={formStructure!}
          isSubmitting={isPending}
          isLoadingData={isFetchingProject || !isModalMounted}
        />
      )}
    </section>
  );
};

export default EditProject;
