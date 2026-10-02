'use client';

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@coreai/component-library';
import { useTranslations } from 'next-intl';

import { FormFooter as ProjectCreateFooter } from '@/components/form-footer';
import { CreateForm } from '@/components/forms';
import { ProcessedItem } from '@/lib/utils';
import { useAccountProjectStore } from '@/store';

import { useProjectForm } from '../../hooks';

interface ProjectFormProps {
  onSuccess: (projectState: any) => void;
  onBack?: () => void;
  isSubmitting: boolean;
  formSchema: any;
  projectStructure: (ProcessedItem | ProcessedItem[])[];
}

export const ProjectForm = ({
  onSuccess,
  isSubmitting,
  onBack,
  projectStructure,
  formSchema,
}: ProjectFormProps) => {
  const t = useTranslations('account_onboarding');

  const { updateProjectState, projectState } = useAccountProjectStore();
  const { form, errors, handleChange, validate } = useProjectForm(
    projectState,
    formSchema,
  );
  const handleSubmit = async () => {
    if (await validate()) {
      updateProjectState(form);
      onSuccess(form);
    }
  };

  return (
    <DialogContent closeBtn data-testid="project-content" size="sm">
      <DialogHeader>
        <DialogTitle>{t('add_project')}</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <CreateForm
          structure={projectStructure}
          form={form}
          errors={errors}
          onChange={handleChange}
        />
      </DialogBody>
      <DialogFooter>
        <ProjectCreateFooter
          onSubmit={handleSubmit}
          label={t('save')}
          goBack={onBack}
          isLoading={isSubmitting}
        />
      </DialogFooter>
    </DialogContent>
  );
};

export default ProjectForm;
