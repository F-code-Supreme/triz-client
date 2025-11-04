import { Button } from '@/components/ui/button';

export const SubmitButton = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => {
  return (
    <Button variant="secondary" type="submit" {...props}>
      {children}
    </Button>
  );
};
