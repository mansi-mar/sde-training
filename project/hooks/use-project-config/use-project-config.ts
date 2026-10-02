import { useMemo } from 'react';

import { useAppConfig } from '@/hooks';
import {
  generateFormStructure,
  generateInitialState,
  generateSchema,
  updateRegexValidation,
} from '@/lib/utils';
import { useFeatureConfig } from '@repo/ui/organisms';
import { projectFieldConfigMapping } from '../../utils/constants';

export function useProjectFormConfig() {
  const authConfig = useFeatureConfig();
  const { config: apiConfig, isLoading: configLoading } = useAppConfig();

  const formConfig = useMemo(() => {
    if (!apiConfig?.project) return null;
    const updatedProjectConfig = updateRegexValidation(apiConfig.project, authConfig, projectFieldConfigMapping);
    
    const formSchema = generateSchema(updatedProjectConfig);
    const initialState = generateInitialState(updatedProjectConfig);
    const formStructure = generateFormStructure(updatedProjectConfig);

    return {
      formSchema,
      initialState,
      formStructure,
    };
  }, [apiConfig?.project, authConfig]);

  return {
    ...formConfig,
    configLoading,
  };
}
