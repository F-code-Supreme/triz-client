import { SixStepsWorkflow } from '@/features/6-steps/components';
import { DefaultLayout } from '@/layouts/default-layout';

const SixStepsPage = () => {
  return (
    <DefaultLayout
      className="py-8 bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      meta={{ title: '6 Steps to Innovative Problem Solving' }}
    >
      <SixStepsWorkflow />
    </DefaultLayout>
  );
};

export default SixStepsPage;
