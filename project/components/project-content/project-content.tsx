'use client';
import React from 'react';

import Otherwise from '@repo/ui/components/conditional/otherwise/otherwise';
import When from '@repo/ui/components/conditional/when/when';

import {
  SkeletonTable,
  SkeletonSearchInput,
  PaginatedTable,
  Wrapper,
} from '@/components';
import {
  useProjectContent,
  useColumns,
  useTranslatedContent,
} from '@/features/project/hooks';
import useGetPermission from '@/hooks/use-get-permission/use-get-permission';
import useModalStore from '@/store/use-modal/use-modal';
import usePermissionStore from '@/store/use-permission/use-permission';
import {
  ProjectsInfo,
  ProjectHeader,
  EditProject,
} from '@features/project/components';
import { ProjectListTransformed } from '@features/project/types/project-list';

import RemoveProject from '../remove-project/remove-project';

const skeletonTableRowCount = 10;

const ProjectContent = ({
  accountName,
  onMapResourceHandler,
  children,
}: {
  accountName: string;
  onMapResourceHandler: (projectName: string) => void;
  children: React.ReactNode;
}) => {
  const {
    projectListData,
    isLoading,
    isFetching,
    selectedProject,
    goBack,
    handleResetProject,
    tableEventHandler,
    tableOperations,
  } = useProjectContent(accountName, onMapResourceHandler);
  const currentPermission = usePermissionStore(
    (state) => state.currentPermission,
  );
  const { selectedItem } = useModalStore((state) => ({
    selectedItem: state.selectedItem,
  }));
  const {
    columnHeaderTranslations,
    skeletonHeaders,
    tableTranslations,
    detailsContent,
  } = useTranslatedContent(currentPermission, ['removeProject']);

  useGetPermission();

  const columns = useColumns(columnHeaderTranslations, currentPermission, [
    'removeProject',
  ]);
  return (
    <>
      <Wrapper classname="pt-0">
        <ProjectHeader
          accountOwner={projectListData?.accountOwner ?? 'None'}
          handleBackClick={goBack}
          translations={{
            accountOwner: detailsContent.accountOwner,
            backButton: detailsContent.back,
          }}
          dataStates={{ isLoading: isLoading, isFetching: isFetching }}
        />
        <Wrapper classname="px-0 pt-0 flex justify-between items-center">
          <ProjectsInfo
            accountName={projectListData?.accountName}
            projectCount={projectListData?.projects?.length ?? 0}
            translations={{
              singleProject: detailsContent.singleProject,
              multipleProjects: detailsContent.multipleProjects,
            }}
            dataStates={{ isLoading: isLoading, isFetching: isFetching }}
          />
          {children}
        </Wrapper>
        <Wrapper classname="px-0 pt-0">
          <When condition={isLoading || isFetching}>
            <SkeletonSearchInput />
            <SkeletonTable
              rowCount={skeletonTableRowCount}
              headers={skeletonHeaders}
            />
            <Otherwise>
              <PaginatedTable<ProjectListTransformed>
                transformedData={
                  projectListData?.projects?.length
                    ? projectListData.projects
                    : []
                }
                columns={columns}
                tableOperations={tableOperations}
                tableTranslations={{
                  placeholder: tableTranslations.searchProjects,
                }}
                cellClassNames={{
                  editProject: 'px-2',
                  mapResources: 'px-2',
                  removeProject: 'px-2',
                }}
                tableEventHandler={tableEventHandler}
              />
            </Otherwise>
          </When>
        </Wrapper>
      </Wrapper>
      <When condition={selectedItem}>
        <RemoveProject />
      </When>
      {selectedProject ? (
        <EditProject
          accountName={accountName}
          projectName={selectedProject}
          resetProjectName={handleResetProject}
        />
      ) : null}
    </>
  );
};

export default ProjectContent;
