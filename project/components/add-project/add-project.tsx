'use client';

import { useCallback, useEffect, useState } from 'react';

import { Button, Dialog, DrawerTrigger, Icon } from '@coreai/component-library';
import When from '@repo/ui/components/conditional/when/when';
import { useTranslations } from 'next-intl';

import { hasAdminAccess } from '@/constants';
import { useAddProject, useProjectFormConfig } from '@/features/project/hooks';
import { addProject } from '@/features/project/services';
import { ProjectType } from '@/features/project/types';
import { useAccountProjectStore } from '@/store';
import { usePermissionStore } from '@/store/use-permission';

import { ProjectForm } from '../project-form';

const addProjectService = addProject();
const AddProject = ({ accountName }: { accountName: string }) => {
  const t = useTranslations('account_onboarding');
  const { formStructure, formSchema, initialState, configLoading } =
    useProjectFormConfig();
  const [openAddProject, setOpenAddProject] = useState(false);
  const { isPending, mutate } = useAddProject(addProjectService);
  const { resetStates } = useAccountProjectStore();

  useEffect(() => {
    if (initialState) {
      resetStates({}, initialState);
    }
  }, [initialState, resetStates]);

  const onCloseModal = useCallback(() => {
    setOpenAddProject(false);
  }, [setOpenAddProject]);

  function onSubmit(project: ProjectType) {
    // make api call
    mutate(
      { accountName, project },
      {
        onSuccess: () => {
          resetStates({}, initialState!);
          onCloseModal();
        },
      },
    );
  }

  const currentPermissions = usePermissionStore(
    (state) => state.currentPermission,
  );

  return (
    <section id="add-project">
      <Dialog
        open={openAddProject}
        onOpenChange={(open) => setOpenAddProject(open)}
      >
        <When condition={!configLoading && hasAdminAccess(currentPermissions)}>
          <DrawerTrigger asChild>
            <Button
              className="px-6 py-1.5"
              size="md"
              icon={<Icon name="plus" />}
              variant="brand"
              onClick={() => setOpenAddProject(true)}
            >
              {t('add_project')}
            </Button>
          </DrawerTrigger>
        </When>
        {!configLoading && openAddProject && (
          <ProjectForm
            onSuccess={onSubmit}
            isSubmitting={isPending}
            formSchema={formSchema}
            projectStructure={formStructure!}
          />
        )}
      </Dialog>
    </section>
  );
};

export default AddProject;
