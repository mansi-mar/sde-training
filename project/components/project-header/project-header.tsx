import React from 'react';

import Otherwise from '@repo/ui/components/conditional/otherwise/otherwise';
import When from '@repo/ui/components/conditional/when/when';
import { Button } from '@repo/ui/components/shadcn/button';
import { ArrowLeft } from 'lucide-react';

import { SkeletonInfo, Wrapper } from '@/components';

const ProjectHeader = ({
  accountOwner,
  handleBackClick,
  translations,
  dataStates,
}: {
  accountOwner: string | undefined;
  handleBackClick: () => void;
  translations: {
    accountOwner: string;
    backButton: string;
  };
  dataStates: {
    isLoading: boolean;
    isFetching: boolean;
  };
}) => {
  return (
    <Wrapper classname="px-0 py-3 flex justify-between items-center">
      <Button
        className="flex gap-2 hover:bg-transparent p-0 "
        variant="ghost"
        onClick={handleBackClick}
      >
        <ArrowLeft color="#607A8C" />
        <span className="text-[#607A8C] font-semibold text-base">
          {translations.backButton}
        </span>
      </Button>
      <div className="flex gap-1 items-center">
        <span className="text-sm font-medium">
          {translations.accountOwner}{' '}
        </span>
        <When condition={dataStates.isLoading || dataStates.isFetching}>
          <SkeletonInfo classname="w-24" />
          <Otherwise>
            <span className="text-sm font-semibold">{accountOwner}</span>
          </Otherwise>
        </When>
      </div>
    </Wrapper>
  );
};

export default ProjectHeader;
