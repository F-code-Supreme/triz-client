import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/triz-principles')({
  component: RouteComponent,
});

const RouteComponent = () => {
  return <div>Hello "/triz-principles"!</div>;
};
