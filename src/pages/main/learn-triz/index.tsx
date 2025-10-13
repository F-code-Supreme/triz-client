import { useTranslation } from 'react-i18next';

import { PrincipleSection } from '@/components/ui/principle-hero-section';
import { DefaultLayout } from '@/layouts/default-layout';

const LearnTRIZPage = () => {
  const { t: _t } = useTranslation();

  return (
    <DefaultLayout meta={{ title: '40 Nguyên Tắc Sáng Tạo' }} className="">
      <PrincipleSection />
    </DefaultLayout>
  );
};
export default LearnTRIZPage;
