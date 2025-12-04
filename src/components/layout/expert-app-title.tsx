import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';

export const ExpertAppTitle = () => {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
          asChild
        >
          <div>
            <Link
              to={'/expert'}
              onClick={() => setOpenMobile(false)}
              className="flex items-center gap-2 flex-1 text-start text-sm leading-tight"
            >
              <img
                src="/logo.svg"
                alt="TRIZ Logo"
                className="h-8 w-8 shrink-0"
              />
              <div className="min-w-0">
                <span className="truncate font-bold block">TRIZ Expert</span>
                <span className="truncate text-xs text-muted-foreground block">
                  Expert Panel
                </span>
              </div>
            </Link>
            <ToggleSidebar className="md:hidden" />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

// Toggle component for mobile sidebar
const ToggleSidebar = ({ className }: { className?: string }) => {
  const { toggleSidebar, openMobile } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7', className)}
      onClick={toggleSidebar}
    >
      {openMobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};
