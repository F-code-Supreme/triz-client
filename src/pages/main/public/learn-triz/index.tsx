import { PrincipleSection } from '@/components/ui/principle-hero-section';
import { DefaultLayout } from '@/layouts/default-layout';

import { TRIZPrinciplesList } from './components/triz-principles-list';

const LearnTRIZPage = () => {
  return (
    <DefaultLayout meta={{ title: '40 Nguyên Tắc Sáng Tạo' }} className="">
      <PrincipleSection />
      <TRIZPrinciplesList />
    </DefaultLayout>
  );
};
export default LearnTRIZPage;
