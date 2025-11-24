import { PrincipleSection } from '@/components/ui/principle-hero-section';
import { DefaultLayout } from '@/layouts/default-layout';
import { TRIZPrinciplesList } from '@/pages/main/learn-triz/components/triz-principles-list';

const LearnTRIZPage = () => {
  return (
    <DefaultLayout meta={{ title: '40 Nguyên Tắc Sáng Tạo' }} className="">
      <PrincipleSection />
      {/* <div className="container mx-auto md:p-8 sm:p-4">123</div> */}
      <TRIZPrinciplesList />
    </DefaultLayout>
  );
};
export default LearnTRIZPage;
