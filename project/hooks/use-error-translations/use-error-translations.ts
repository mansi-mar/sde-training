import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

const useErrorTranslations = () => {
  const translation = useTranslations('account_onboarding');
  const errorNotificationTranslations = useMemo(() => {
    return {
      title: translation('projects_error_title'),
      description: translation('projects_404_error'),
    };
  }, [translation]);
  return { errorNotificationTranslations };
};

export default useErrorTranslations;
