import { AlertCircleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AlertErrorProps = {
  title: string;
  description: string;
};

const AlertError = ({ title, description }: AlertErrorProps) => {
  return (
    <div className="w-full p-6 flex justify-center">
      <div className="w-full max-w-lg">
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AlertError;
