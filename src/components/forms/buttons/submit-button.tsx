import { Button } from '@/components/ui/button';

export const SubmitButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <Button variant="secondary" type="submit">
      {children}
    </Button>
  );
};
