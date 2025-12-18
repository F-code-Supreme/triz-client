import { Search, FilterX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { CourseLevel, CourseFilters } from '../types';

interface CourseFiltersProps {
  filters: CourseFilters;
  onFiltersChange: (filters: CourseFilters) => void;
  className?: string;
}

const CourseFiltersComponent = ({
  filters,
  onFiltersChange,
  className,
}: CourseFiltersProps) => {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleLevelChange = (value: string) => {
    onFiltersChange({
      ...filters,
      level: value === 'all' ? undefined : (value as CourseLevel),
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    onFiltersChange({
      ...filters,
      sortBy: sortBy as CourseFilters['sortBy'],
      sortOrder: sortOrder as CourseFilters['sortOrder'],
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.search || filters.status || filters.category || filters.level;

  const { t } = useTranslation('pages.courses');

  return (
    <div className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('filters.search_placeholder')}
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearFilters}
              className="shrink-0"
            >
              <FilterX className="h-4 w-4" />
            </Button>
          )}
          {/* Level Filter */}
          <Select
            value={filters.level || 'all'}
            onValueChange={handleLevelChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.all_levels')}</SelectItem>
              <SelectItem value="STARTER">{t('filters.starter')}</SelectItem>
              <SelectItem value="INTERMEDIATE">
                {t('filters.intermediate')}
              </SelectItem>
              <SelectItem value="EXPERT">{t('filters.expert')}</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Filter */}
          <Select
            value={`${filters.sortBy || 'title'}-${filters.sortOrder || 'asc'}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">
                {t('filters.sort_by')} A-Z
              </SelectItem>
              <SelectItem value="title-desc">
                {t('filters.sort_by')} Z-A
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CourseFiltersComponent;
