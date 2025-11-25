import { MatrixSection } from '@/components/ui/matrix-triz';
import { DefaultLayout } from '@/layouts/default-layout';

const MatrixTriz = () => {
  return (
    <DefaultLayout meta={{ title: 'TRIZ Matrix' }} className="">
      <MatrixSection />
    </DefaultLayout>
  );
};

export default MatrixTriz;
