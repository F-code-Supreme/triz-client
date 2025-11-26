import { createFileRoute } from '@tanstack/react-router';

import MatrixTriz from '@/pages/main/matrix-triz';

export const Route = createFileRoute('/matrix-triz')({
  component: MatrixTriz,
});
