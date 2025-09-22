import { Button } from '@/components/ui/button';

import type { ButtonProperties } from '@/components/ui/button';

export const SubmitButton = ({
  children,
  ...props
}: { children: React.ReactNode } & ButtonProperties) => {
  return (
    <Button variant="secondary" type="submit" {...props}>
      {children}
    </Button>
  );
};
