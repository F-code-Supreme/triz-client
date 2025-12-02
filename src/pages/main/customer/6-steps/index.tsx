import { SixStepsWorkflow } from '@/features/6-steps/components';
import { DefaultLayout } from '@/layouts/default-layout';

const SixStepsPage = () => {
  return (
    <DefaultLayout
      className="py-8"
      meta={{ title: '6 Steps to Innovative Problem Solving' }}
    >
      <SixStepsWorkflow />
    </DefaultLayout>
  );
};

export default SixStepsPage;
