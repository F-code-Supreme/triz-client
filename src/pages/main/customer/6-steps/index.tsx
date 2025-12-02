import SixStepsIntroduction from '@/features/6-steps/components/introduction';
import { DefaultLayout } from '@/layouts/default-layout';

const SixStepsPage = () => {
  return (
    <DefaultLayout
      className="py-8"
      meta={{ title: '6 Steps to Innovative Problem Solving' }}
    >
      <SixStepsIntroduction />
    </DefaultLayout>
  );
};

export default SixStepsPage;
