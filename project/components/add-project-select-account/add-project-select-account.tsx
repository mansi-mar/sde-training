'use client';

import React, { useCallback, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DrawerTrigger,
} from '@coreai/component-library';
import When from '@repo/ui/components/conditional/when/when';
import { useTranslations } from 'next-intl';

import { hasAdminAccess } from '@/constants';
import {
  useAccountNames,
  useAddProject,
  useProjectWithAccountFormConfig,
} from '@/features/project/hooks';
import { addProject } from '@/features/project/services';
import { useClientRouter } from '@/hooks';
import { usePermissionStore } from '@/store/use-permission';
import { getAccountProjectsPath } from '@features/project/constants';

import AddProjectForm from './add-project-form';

const addProjectService = addProject();

export const AddProjectSelectAccount = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const t = useTranslations('account_onboarding');
  const [open, setOpen] = useState(false);
  const { accountNames, isFetching } = useAccountNames(addProjectService, open); // fetching account names
  const { isPending, mutate } = useAddProject(addProjectService); // adding project to account
  const { navigate } = useClientRouter();

  const { formSchema, initialState, formStructure, configLoading } =
    useProjectWithAccountFormConfig();

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const onCloseModal = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (!open) {
        closeModal();
      }
    },
    [closeModal],
  );

  const onSubmit = useCallback(
    async (form: any) => {
      const { account_name, ...project } = form;
      mutate(
        { accountName: account_name, project },
        {
          onSuccess: () => {
            onCloseModal(false);
            navigate(getAccountProjectsPath(account_name));
          },
        },
      );
    },
    [mutate, navigate, onCloseModal],
  );

  const currentPermissions = usePermissionStore(
    (state) => state.currentPermission,
  );

  return (
    <section id="add-project">
      <Dialog open={open} onOpenChange={onCloseModal}>
        <When condition={!configLoading && hasAdminAccess(currentPermissions)}>
          <DrawerTrigger asChild>{children}</DrawerTrigger>
        </When>
        {!configLoading && (
          <DialogContent closeBtn data-testid="test-dialog-content" size="sm">
            <DialogHeader>
              <DialogTitle>{t('add_project')}</DialogTitle>
            </DialogHeader>
            <AddProjectForm
              accountList={accountNames || []}
              isLoading={isFetching}
              onSuccess={onSubmit}
              isSubmitting={isPending}
              formSchema={formSchema}
              initialState={initialState!}
              projectStructure={formStructure!}
            />
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};
