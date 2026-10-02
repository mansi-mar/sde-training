import { useMemo } from 'react';

import { hasAdminAccess } from '@/constants';
import { TranslatedColumns } from '@/features/project/types';
import removeColumnsByAccessorKeys from '@/lib/utils/remove-by-accessor-keys/remove-by-accessor-keys';
import { projectListColumns } from '@features/project/utils';

const useColumns = (
  columnHeaderTranslations: Partial<TranslatedColumns>,
  permissionLevel: ('super_admin' | 'admin')[],
  accessorKeysToRemove: string[],
) => {
  return useMemo(() => {
    let transformedColumns = projectListColumns(columnHeaderTranslations);
    if (!hasAdminAccess(permissionLevel)) {
      transformedColumns = removeColumnsByAccessorKeys(transformedColumns, [
        'mapResources',
        'editProject',
        'removeProject',
      ]);
    } else if (!permissionLevel.includes('super_admin'))
      transformedColumns = removeColumnsByAccessorKeys(
        projectListColumns(columnHeaderTranslations),
        accessorKeysToRemove,
      );

    return transformedColumns;
  }, [columnHeaderTranslations, permissionLevel, accessorKeysToRemove]);
};

export default useColumns;
