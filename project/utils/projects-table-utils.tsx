'use client';
import { Icon, IconButton } from '@repo/ui/atoms';
import Otherwise from '@repo/ui/components/conditional/otherwise/otherwise';
import When from '@repo/ui/components/conditional/when/when';
import { ColumnDef } from '@tanstack/react-table';

import HeaderButton from '@/components/table/header-button/header-button';
import {
  ProjectListTransformed,
  TranslatedColumns,
} from '@/features/project/types/project-list';

 
const projectListColumns = (
  translatedHeaders: Partial<TranslatedColumns>,
): ColumnDef<ProjectListTransformed>[] => [
  {
    id: 'projectName',
    accessorKey: 'projectName',
    header: ({ column }) => {
      return (
        <HeaderButton
          column={column}
          headerText={translatedHeaders['projectName'] as string}
        />
      );
    },
  },
  {
    id: 'projectId',
    accessorKey: 'projectId',
    header: ({ column }) => {
      return (
        <HeaderButton
          column={column}
          headerText={translatedHeaders['projectId'] as string}
        />
      );
    },
  },
  {
    id: 'projectOwner',
    accessorKey: 'projectOwner',
    header: ({ column }) => {
      return (
        <HeaderButton
          column={column}
          headerText={translatedHeaders['projectOwner'] as string}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <When condition={row.getValue('projectOwner')}>
          {`${row.getValue('projectOwner')}`}
          <Otherwise>
            <span> -</span>
          </Otherwise>
        </When>
      );
    },
  },
  {
    id: 'totalResources',
    accessorKey: 'totalResources',
    header: translatedHeaders['totalResources'],
    cell: ({ row }) => {
      return (
        <When condition={row.getValue('totalResources')}>
          {`${row.getValue('totalResources') ? row.getValue('totalResources') : null}`}
          <Otherwise>
            <span> -</span>
          </Otherwise>
        </When>
      );
    },
  },
  {
    id: 'mapResources',
    accessorKey: 'mapResources',
    header: translatedHeaders['mapResources'],
    cell: ({ row }) => {
      return (
        <When condition={row.getValue('projectName')}>
          <IconButton
            type="button"
            className="px-0 py-0  w-full h-full justify-start hover:bg-transparent"
          >
            <Icon name="resources" />
          </IconButton>
          <Otherwise>
            <span> -</span>
          </Otherwise>
        </When>
      );
    },
  },
  {
    id: 'editProject',
    accessorKey: 'editProject',
    header: translatedHeaders['editProject'],
    cell: ({ row }) => {
      return (
        <When condition={row.getValue('projectName')}>
          <IconButton
            type="button"
            className="px-0 py-0  w-full h-full justify-start hover:bg-transparent"
          >
            <Icon name="pencil" />
          </IconButton>
          <Otherwise>
            <span> -</span>
          </Otherwise>
        </When>
      );
    },
  },
  {
    id: 'removeProject',
    accessorKey: 'removeProject',
    header: translatedHeaders['removeProject'],
    cell: ({ row }) => {
      return (
        <When condition={row.getValue('projectName')}>
          <IconButton
            type="button"
            className="px-0 py-0  w-full h-full justify-start hover:bg-transparent"
          >
            <Icon name="cross" fill={'#017E7E'} width="20" height="20" />
          </IconButton>
          <Otherwise>
            <span> -</span>
          </Otherwise>
        </When>
      );
    },
  },
];

export default projectListColumns;
