import { useMemo } from 'react';

import { useAppConfig } from '@/hooks';
import {
  generateFormStructure,
  generateInitialState,
  generateSchema,
} from '@/lib/utils';

export function useProjectWithAccountFormConfig() {
  const { config: apiConfig, isLoading: configLoading } = useAppConfig();

  const formConfig = useMemo(() => {
    if (!apiConfig?.project) return null;

    const ProjectWithAccountConfig = [
      [
        {
          id: 'account_name',
          label: 'accountName',
          type: 'dropdown',
          defaultValue: '',
          validation: {
            required: { message: 'account_name_required' },
          },
        },
      ],
      ...apiConfig.project,
    ];

    const formSchema = generateSchema(ProjectWithAccountConfig);
    const initialState = generateInitialState(ProjectWithAccountConfig);
    const formStructure = generateFormStructure(ProjectWithAccountConfig);

    return {
      formSchema,
      initialState,
      formStructure,
    };
  }, [apiConfig?.project]);

  return {
    ...formConfig,
    configLoading,
  };
}
