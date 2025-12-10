import { useTranslation } from 'react-i18next';

import { PrincipleSection } from '@/components/ui/principle-hero-section';
import { DefaultLayout } from '@/layouts/default-layout';

import { TRIZPrinciplesList } from './components/triz-principles-list';

const LearnTRIZPage = () => {
  const { t } = useTranslation('pages.learn_triz');

  return (
    <DefaultLayout
      meta={{ title: t('page_meta_title') }}
      className="scroll-smooth"
    >
      <PrincipleSection />
      <TRIZPrinciplesList />
    </DefaultLayout>
  );
};

export default LearnTRIZPage;
