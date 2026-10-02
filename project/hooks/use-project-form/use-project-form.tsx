import { useFormValidate, useHandleChange } from '@/hooks';

export const useProjectForm = (
  initialState: Record<string, string>,
  formSchema: any,
) => {
  const {
    form,
    setForm,
    errors,
    checkFormValidation: validate,
  } = useFormValidate<any>({
    formSchema: formSchema,
    initialState,
  });

  const handleChange = useHandleChange<any>();
  const onChange = (field: keyof any, event: any) =>
    handleChange(setForm, field, event);

  return {
    form,
    errors,
    handleChange: onChange,
    validate,
  };
};
