import React from 'react';

import { MatrixSection } from '@/components/ui/matrix-triz';
import { DefaultLayout } from '@/layouts/default-layout';
import { TrizMatrix } from '@/pages/main/matrix-triz/components/triz-matrix';

const MatrixTriz = () => {
  

  return (
    <DefaultLayout meta={{ title: 'TRIZ Matrix' }} className="">
      <MatrixSection />
      {/* <TrizMatrix data={fullMatrixData} /> */}
    </DefaultLayout>
  );
};

export default MatrixTriz;
