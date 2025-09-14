import { Button } from '@/components/ui/button';

export const SecondaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Button
      variant="outline"
      className="w-full bg-secondary text-primary-foreground"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
