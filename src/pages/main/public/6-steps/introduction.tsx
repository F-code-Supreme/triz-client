import { useNavigate } from '@tanstack/react-router';

import { Step0Introduction } from '@/features/6-steps/components/steps';
import { DefaultLayout } from '@/layouts/default-layout';

const SixStepsIntroductionPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate({ to: '/6-steps/workflow' });
  };

  return (
    <DefaultLayout
      className="h-[calc(100svh-4rem-1px)] py-8 bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
      meta={{ title: '6 Steps to Innovative Problem Solving' }}
    >
      <Step0Introduction onStart={handleStart} />
    </DefaultLayout>
  );
};

export default SixStepsIntroductionPage;
