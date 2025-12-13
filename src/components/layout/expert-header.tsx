import { useTranslation } from 'react-i18next';

import LocaleSwitcher from '@/components/locale-switcher';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from '@/components/ui/shadcn-io/theme-switcher';
import { SidebarTrigger } from '@/components/ui/sidebar';

import { ExpertSearch } from './expert-search';
import { useTheme } from '../theme/theme-provider';

export const ExpertHeader = () => {
  const { t } = useTranslation('pages.admin');
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6">
        {/* Left side - Sidebar trigger, separator, and search */}
        <div className="flex items-center gap-2">
          <SidebarTrigger variant="outline" className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <ExpertSearch placeholder={`${t('common.search')}...`} />
        </div>

        {/* Right side - Theme and locale switchers */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher value={theme} onChange={setTheme} />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
};
