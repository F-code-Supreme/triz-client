import { useTranslation } from 'react-i18next';

import { DefaultLayout } from '@/layouts/default-layout';

const LearnTRIZPage = () => {
  const { t: _t } = useTranslation();

  return (
    <DefaultLayout
      meta={{ title: '40 nguyên tắc' }}
      isLearnTRIZPage
    ></DefaultLayout>
  );
};
export default LearnTRIZPage;
