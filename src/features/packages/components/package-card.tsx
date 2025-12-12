import { Edit, Trash2 } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { formatTrizilium, formatDailyTrizilium } from '@/utils';

import type { Package } from '@/features/packages/types';

interface PackageCardProps {
  package: Package;
  onEdit: (pkg: Package) => void;
  onDelete: (id: string) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation('pages.admin');

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
            <Badge
              variant={pkg.status === 'ACTIVE' ? 'default' : 'secondary'}
              className={
                pkg.status === 'ACTIVE'
                  ? 'bg-green-500 hover:bg-green-500/90'
                  : 'bg-gray-400 hover:bg-gray-400/90'
              }
            >
              {pkg.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t('packages.card.price')}
            </span>
            <span className="font-semibold text-lg">
              {formatTrizilium(pkg.priceInTokens)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t('packages.card.duration')}
            </span>
            <span className="font-medium">
              {pkg.durationInDays} {t('packages.card.days')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t('packages.card.daily_tokens')}
            </span>
            <span className="font-medium">
              {formatDailyTrizilium(pkg.chatTokenPerDay, {
                shortForm: true,
              })}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm font-medium mb-2">
            {t('packages.card.features')}
          </p>
          <ul className="space-y-2">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <img
                  src={feature.iconUrl}
                  alt="feature icon"
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                />
                <span className="text-muted-foreground">
                  {feature.description}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(pkg)}
        >
          <Edit className="mr-2 h-4 w-4" />
          {t('packages.card.edit')}
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(pkg.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t('packages.card.delete')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PackageCard;
