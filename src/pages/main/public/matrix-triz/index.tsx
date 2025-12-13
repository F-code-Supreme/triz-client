import { useTranslation } from 'react-i18next';

import { MatrixSection } from '@/components/ui/matrix-triz';
import { DefaultLayout } from '@/layouts/default-layout';

const MatrixTriz = () => {
  const { t } = useTranslation('pages.matrix_triz');

  return (
    <DefaultLayout meta={{ title: t('page_meta_title') }} className="">
      <MatrixSection />
    </DefaultLayout>
  );
};

export default MatrixTriz;
