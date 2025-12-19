import { useTranslation } from 'react-i18next';

import { SixStepsWorkflow } from '@/features/6-steps/components';
import { DefaultLayout } from '@/layouts/default-layout';

const SixStepsPage = () => {
  const { t } = useTranslation('pages.six_steps');

  return (
    <DefaultLayout
      className="min-h-[calc(100svh-4rem-1px)] py-8 bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      meta={{ title: t('page_meta_title') }}
    >
      <SixStepsWorkflow />
    </DefaultLayout>
  );
};

export default SixStepsPage;
