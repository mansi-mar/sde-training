import { useMemo } from 'react';

import { useAppConfig } from '@/hooks/use-app-config';
import {
  generateFormStructure,
  generateSchema,
  generateInitialState,
  updateRegexValidation,
} from '@/lib/utils';
import { FieldType } from '@/types';
import { useFeatureConfig } from '@repo/ui/organisms';
import { projectFieldConfigMapping } from '../../utils/constants';

export const useProjectEditFormConfig = () => {
  const authConfig = useFeatureConfig();
  const { config: apiConfig, isLoading } = useAppConfig();

  const projectEditConfig = useMemo(() => {
    if (!apiConfig?.project) return [];

    const updatedProjectConfig = structuredClone(apiConfig.project).map(
      (group: FieldType | FieldType[]) => {
        if (Array.isArray(group)) {
          return group.map((field) => {
            if (field.id === 'project_name') {
              return {
                ...field,
                disabled: true,
                validation: undefined,
              };
            }
            return field;
          });
        }

        if (group.id === 'project_name') {
          return {
            ...group,
            disabled: true,
            validation: undefined,
          };
        }

        return group;
      },
    );
    return updateRegexValidation(updatedProjectConfig, authConfig, projectFieldConfigMapping);
  }, [apiConfig?.project, authConfig]);

  const formStructure = useMemo(() => {
    if (!projectEditConfig.length) return [];
    return generateFormStructure(projectEditConfig);
  }, [projectEditConfig]);

  const formSchema = useMemo(() => {
    if (!projectEditConfig.length) return undefined;
    return generateSchema(projectEditConfig);
  }, [projectEditConfig]);

  const initialState = useMemo(() => {
    if (!projectEditConfig.length) return {};
    return generateInitialState(projectEditConfig);
  }, [projectEditConfig]);

  return {
    formStructure,
    formSchema,
    initialState,
    isLoading,
  };
};
