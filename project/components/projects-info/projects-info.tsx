import React from 'react';

import Otherwise from '@repo/ui/components/conditional/otherwise/otherwise';
import When from '@repo/ui/components/conditional/when/when';

import { SkeletonInfo, TruncatedText } from '@/components';

const ProjectsInfo = ({
  accountName,
  projectCount,
  translations,
  dataStates,
}: {
  accountName: string | undefined;
  projectCount: string | number;
  translations: {
    singleProject: string;
    multipleProjects: string;
  };
  dataStates: {
    isLoading: boolean;
    isFetching: boolean;
  };
}) => {
  return (
    <div className="flex gap-1 text-2xl font-semibold w-full  items-center">
      <When condition={dataStates.isLoading || dataStates.isFetching}>
        <SkeletonInfo classname="w-24" />
        <Otherwise>
          <TruncatedText
            text={accountName}
            maxWidth="max-w-125"
            delayDuration={200}
          />
        </Otherwise>
      </When>

      <span data-testid="projects-info">
        ({projectCount}{' '}
        {projectCount === 1
          ? translations.singleProject
          : translations.multipleProjects}
        )
      </span>
    </div>
  );
};

export default ProjectsInfo;
