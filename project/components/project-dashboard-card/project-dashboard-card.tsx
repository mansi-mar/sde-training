import React from 'react';

import { useTranslations } from 'next-intl';

import { CardMain } from '@/components/card/card-main';
import { projectDashboardCardConfig } from '@features/project/utils';

const ProjectDashboardCard = ({
  count,
  WrapperComponent,
}: {
  count: number;
  WrapperComponent: React.ComponentType<{ children: React.ReactNode }>;
}) => {
  const translations = useTranslations('account_onboarding');
  const projectConfig = React.useMemo(() => {
    return projectDashboardCardConfig(WrapperComponent);
  }, [WrapperComponent]);
  return (
    <CardMain
      count={count}
      title={translations(projectConfig.title)}
      description={translations(projectConfig.content)}
      controls={{
        titleControls: projectConfig.titleControls,
      }}
    />
  );
};

export default ProjectDashboardCard;
