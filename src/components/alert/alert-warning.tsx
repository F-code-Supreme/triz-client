import { AlertTriangleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AlertWarningProps = {
  title: string;
  description: string;
};

const AlertWarning = ({ title, description }: AlertWarningProps) => {
  return (
    <div className="w-full p-6 flex justify-center">
      <div className="w-full max-w-lg">
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400">
          <AlertTriangleIcon />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            {description}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default AlertWarning;
