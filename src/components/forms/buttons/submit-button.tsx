import { Button } from '@/components/ui/button';

import type { ButtonProps } from '@/components/ui/button';

export const SubmitButton = ({
  children,
  ...props
}: { children: React.ReactNode } & ButtonProps) => {
  return (
    <Button variant="secondary" type="submit" {...props}>
      {children}
    </Button>
  );
};
