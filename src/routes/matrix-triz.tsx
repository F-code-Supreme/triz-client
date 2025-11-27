import { createFileRoute } from '@tanstack/react-router';

import MatrixTriz from '@/pages/main/public/matrix-triz';

export const Route = createFileRoute('/matrix-triz')({
  component: MatrixTriz,
});
