import { Edit, Trash2, RotateCcw, MoreHorizontal } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { Achievement } from '@/features/achievement/types';

interface AchievementCardProps {
  achievement: Achievement;
  onEdit: (achievement: Achievement) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  isDeleted?: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onEdit,
  onDelete,
  onRestore,
  isDeleted = false,
}) => {
  const { t } = useTranslation('pages.admin');

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'FIRST_BOOK':
        return t('achievements.type.first_book');
      case 'BOOK_MILESTONE':
        return t('achievements.type.book_milestone');
      default:
        return type;
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="h-full p-0 relative flex flex-col">
        {/* Actions Dropdown - Top Right */}
        {!isDeleted && (
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(achievement)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t('achievements.card.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(achievement.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('achievements.card.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Restore Button - Top Right (for deleted items) */}
        {isDeleted && (
          <div className="absolute top-2 right-2 z-10">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRestore?.(achievement.id)}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('achievements.card.restore')}
            </Button>
          </div>
        )}

        {/* Image */}
        <div className="overflow-hidden rounded-tr-md rounded-tl-md bg-gray-100 flex-shrink-0">
          {achievement.imageUrl ? (
            <img
              src={achievement.imageUrl}
              alt={achievement.name}
              className="h-72 w-full object-cover"
            />
          ) : (
            <div className="flex h-60 w-full items-center justify-center text-sm text-muted-foreground">
              {t('achievements.card.no_image')}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-3 min-h-0">
          <div className="flex-1 min-h-0 mb-2">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h2 className="text-base font-semibold truncate">
                {achievement.name}
              </h2>
              <Badge
                variant={
                  achievement.status === 'ACTIVE' ? 'default' : 'secondary'
                }
                className={
                  achievement.status === 'ACTIVE'
                    ? 'bg-green-500 hover:bg-green-500/90 flex-shrink-0'
                    : 'bg-gray-400 hover:bg-gray-400/90 flex-shrink-0'
                }
              >
                {achievement.status}
              </Badge>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 overflow-hidden">
              {achievement.description}
            </p>
          </div>

          {achievement.milestoneCount && (
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                {t('achievements.card.milestone', {
                  count: achievement.milestoneCount,
                })}
              </span>
              <Badge variant="secondary" className="flex-shrink-0">
                {getTypeLabel(achievement.type)}
              </Badge>
            </div>
          )}

          {!achievement.milestoneCount && (
            <div className="flex justify-end">
              <Badge variant="secondary" className="flex-shrink-0">
                {getTypeLabel(achievement.type)}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
