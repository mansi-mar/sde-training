// [use-translated-content.ts](apps/onboarding/src/features/project/hooks/use-translated-content/use-translated-content.ts)

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { hasAdminAccess } from '@/constants';

type TranslatedContent = {
  projectName: string;
  projectId: string;
  projectOwner: string;
  totalResources: string;
  mapResources: string;
  editProject: string;
  removeProject?: string; // Optional since it might be excluded
};

const useTranslatedContent = (
  permission: ('admin' | 'super_admin')[],
  excludeHeaders: string[],
) => {
  const translation = useTranslations('account_onboarding');

  const columnHeaderTranslations = useMemo<Partial<TranslatedContent>>(() => {
    const allTranslations: TranslatedContent = {
      projectName: translation('projectName'),
      projectId: translation('projectId'),
      projectOwner: translation('projectOwner'),
      totalResources: translation('totalResources'),
      mapResources: translation('mapResources'),
      editProject: translation('editProject'),
      removeProject: translation('removeProject'),
    };

    if (!hasAdminAccess(permission)) {
      return Object.keys(allTranslations)
        .filter(
          (key) =>
            !['mapResources', 'editProject', 'removeProject'].includes(key),
        )
        .reduce((obj, key) => {
          const value = allTranslations[key as keyof TranslatedContent];
          obj[key as keyof TranslatedContent] = value;

          return obj;
        }, {} as Partial<TranslatedContent>);
    }

    // Apply filtering only if 'super_admin' is not in permissions
    if (!permission.includes('super_admin')) {
      return Object.keys(allTranslations)
        .filter((key) => !excludeHeaders.includes(key))
        .reduce((obj, key) => {
          const value = allTranslations[key as keyof TranslatedContent];
          obj[key as keyof TranslatedContent] = value;

          return obj;
        }, {} as Partial<TranslatedContent>);
    }

    // Return all translations if 'super_admin' is present
    return allTranslations;
  }, [translation, excludeHeaders, permission]);

  const detailsContent = {
    accountOwner: translation('account_owner'),
    singleProject: translation('projects_info_single'),
    multipleProjects: translation('projects_info_multiple'),
    back: translation('back'),
  };

  const tableTranslations = {
    searchProjects: translation('search_projects'),
  };

  return {
    columnHeaderTranslations,
    skeletonHeaders: Object.values(columnHeaderTranslations),
    detailsContent,
    tableTranslations,
  };
};

export default useTranslatedContent;
