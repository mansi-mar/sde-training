import React from 'react';

import { DialogBody, DialogFooter } from '@coreai/component-library';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

import { FormFooter } from '@/components/form-footer';
import { CreateForm } from '@/components/forms';
import { useFormValidate, useHandleChange } from '@/hooks';
import { ProcessedItem } from '@/lib/utils';
import { OptionType } from '@/types';

type Props = {
  onSuccess: (projectState: any) => void;
  isSubmitting: boolean;
  isLoading: boolean;
  accountList: OptionType[];
  formSchema: any;
  initialState: Record<string, string>;
  projectStructure: (ProcessedItem | ProcessedItem[])[];
};

const AddProjectForm = ({
  onSuccess,
  isSubmitting,
  isLoading,
  accountList,
  formSchema,
  initialState,
  projectStructure,
}: Props) => {
  const t = useTranslations('account_onboarding');

  const { form, setForm, errors, checkFormValidation, isValidating } =
    useFormValidate<z.infer<typeof formSchema>>({
      formSchema: formSchema,
      initialState: initialState,
    });

  const handleValueChange = useHandleChange<any>();

  const handleSubmit = async () => {
    if (await checkFormValidation()) {
      onSuccess(form);
    }
  };

  const structureWithAccounts = projectStructure.map(
    (row) =>
      Array.isArray(row)
        ? row.map((field) =>
            field.id === 'account_name'
              ? { ...field, options: accountList } // Correctly assign options
              : field,
          )
        : row, // Return unchanged for non-array elements
  );

  return (
    <>
      <DialogBody>
        <CreateForm
          structure={structureWithAccounts}
          form={form}
          errors={errors}
          onChange={handleValueChange.bind(this, setForm)}
          isLoading={isLoading}
        />
      </DialogBody>
      <DialogFooter>
        <FormFooter
          onSubmit={handleSubmit}
          label={t('save')}
          isLoading={isValidating || isSubmitting}
        />
      </DialogFooter>
    </>
  );
};

export default AddProjectForm;
