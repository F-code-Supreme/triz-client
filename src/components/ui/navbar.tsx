import { Link, useMatchRoute } from '@tanstack/react-router';
import {
  User,
  LogOut,
  BookOpen,
  Wallet,
  CalendarSync,
  CircleDollarSign,
  GraduationCap,
  BookCheck,
  Lightbulb,
  Grid3x3,
  Gamepad2,
  Footprints,
  Newspaper,
} from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import HamburgerIcon from '@/assets/hamburger-icon';
import LocaleSwitcher from '@/components/locale-switcher';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useAuth from '@/features/auth/hooks/use-auth';
import useLogout from '@/features/auth/hooks/use-logout';
import { useGetWalletByUserQuery } from '@/features/payment/wallet/services/queries';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';
import { formatTriziliumShort } from '@/utils';

import { ThemeSwitcher } from './shadcn-io/theme-switcher';
import { useTheme } from '../theme/theme-provider';

// Types
export interface Navbar03NavItem {
  href?: string;
  label: string;
  active?: boolean;
}

export interface LearnTrizNavItem {
  href: string;
  labelKey: string;
  icon: React.ElementType;
}

export interface ToolsNavItem {
  href: string;
  labelKey: string;
  icon: React.ElementType;
}

export interface Navbar03Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar03NavItem[];
  learnTrizLinks?: LearnTrizNavItem[];
  toolsLinks?: ToolsNavItem[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

// Configuration for navigation links
const MAIN_NAV_LINKS = (t: (key: string) => string): Navbar03NavItem[] => [
  { href: '/', label: t('home'), active: true },
  { href: '/forum', label: t('forum') },
  { href: '/packages', label: t('packages') },
];

const AUTH_NAV_LINKS = (t: (key: string) => string): Navbar03NavItem[] => [
  { href: '/chat-triz', label: t('chat_ai') },
];

// Configuration for Learn TRIZ dropdown links
const LEARN_TRIZ_LINKS: LearnTrizNavItem[] = [
  { href: '/course', labelKey: 'learn_triz.course', icon: GraduationCap },
  { href: '/games', labelKey: 'learn_triz.games', icon: Gamepad2 },
  { href: '/books', labelKey: 'learn_triz.books', icon: BookOpen },
];

const AUTH_LEARN_TRIZ_LINKS: LearnTrizNavItem[] = [
  { href: '/quiz', labelKey: 'learn_triz.quiz', icon: BookCheck },
];

// Configuration for Tools dropdown links
const TOOLS_LINKS: ToolsNavItem[] = [
  {
    href: '/6-steps',
    labelKey: 'tools.six_steps',
    icon: Footprints,
  },
  { href: '/learn-triz', labelKey: 'tools.principles', icon: Lightbulb },
  { href: '/matrix-triz', labelKey: 'tools.matrix', icon: Grid3x3 },
];

// Active link styling
const activeLinkClass =
  'before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary before:scale-x-100 text-primary';
const hoverLinkClass =
  'relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:bg-primary before:scale-x-0 before:transition-transform before:duration-300 hover:before:scale-x-100';

export const Navbar03 = React.forwardRef<HTMLElement, Navbar03Props>(
  (
    { className, navigationLinks, learnTrizLinks, toolsLinks, ...props },
    ref,
  ) => {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation('header');
    const { isAuthenticated, user } = useAuth();
    const logout = useLogout();
    const matchRoute = useMatchRoute();

    // Fetch active subscription and wallet
    const { data: wallet } = useGetWalletByUserQuery(user?.id);

    // Use provided links or fall back to default configuration
    const baseNavLinks =
      navigationLinks || MAIN_NAV_LINKS(t as (key: string) => string);
    const authOnlyNavLinks = AUTH_NAV_LINKS(t as (key: string) => string);
    const navLinks = isAuthenticated
      ? [...baseNavLinks, ...authOnlyNavLinks]
      : baseNavLinks;

    const baseLearnTrizLinks = learnTrizLinks || LEARN_TRIZ_LINKS;
    const authOnlyLearnTrizLinks = AUTH_LEARN_TRIZ_LINKS;
    const learnTrizNavLinks = isAuthenticated
      ? [...baseLearnTrizLinks, ...authOnlyLearnTrizLinks]
      : baseLearnTrizLinks;

    const toolsNavLinks = toolsLinks || TOOLS_LINKS;
    const isMobile = useMediaQuery('(max-width: 767px)'); // 767px is md breakpoint
    const containerRef = React.useRef<HTMLElement>(null);

    // Check if a link is active using TanStack Router's useMatchRoute
    const isLinkActive = (href?: string) => {
      if (!href || href === '#') return false;
      const match = matchRoute({ to: href, fuzzy: true });
      return !!match;
    };

    // Check if Learn TRIZ dropdown should be active
    const isLearnTrizActive = () => {
      return learnTrizNavLinks.some((link) => isLinkActive(link.href));
    };

    // Check if Tools dropdown should be active
    const isToolsActive = () => {
      return toolsNavLinks.some((link) => isLinkActive(link.href));
    };

    // Combine refs
    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        // Use a separate variable to avoid readonly assignment
        if (containerRef.current !== node) {
          (containerRef as React.MutableRefObject<HTMLElement | null>).current =
            node;
        }
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    return (
      <header
        ref={combinedRef}
        className={cn(
          'sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          className,
        )}
        {...props}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            {isMobile && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground md:hidden"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-1">
                  <NavigationMenu className="max-w-none">
                    <NavigationMenuList className="flex-col items-start gap-0">
                      {navLinks.map((link, index) => (
                        <NavigationMenuItem key={index} className="w-full">
                          <Link
                            to={link.href}
                            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuItem>
                      ))}
                      {/* Learn TRIZ submenu items */}
                      <div className="w-full border-t pt-2">
                        <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                          {t('learn_triz')}
                        </div>
                        {learnTrizNavLinks.map((link, index) => {
                          const Icon = link.icon;
                          return (
                            <NavigationMenuItem key={index} className="w-full">
                              <Link
                                to={link.href}
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline pl-6"
                              >
                                <Icon className="mr-2 h-4 w-4" />
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {t(link.labelKey as any)}
                              </Link>
                            </NavigationMenuItem>
                          );
                        })}
                      </div>
                      {/* Tools submenu items */}
                      <div className="w-full border-t pt-2">
                        <div className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                          {t('tools')}
                        </div>
                        {toolsNavLinks.map((link, index) => {
                          const Icon = link.icon;
                          return (
                            <NavigationMenuItem key={index} className="w-full">
                              <Link
                                to={link.href}
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline pl-6"
                              >
                                <Icon className="mr-2 h-4 w-4" />
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {t(link.labelKey as any)}
                              </Link>
                            </NavigationMenuItem>
                          );
                        })}
                      </div>
                      <div className="w-full border-t">
                        {isAuthenticated ? (
                          <>
                            <NavigationMenuItem className="w-full">
                              <Link
                                to="/profile"
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                              >
                                <User className="mr-2 h-4 w-4" />
                                Profile
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full">
                              <Link
                                to="/books/me"
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                              >
                                <BookOpen className="mr-2 h-4 w-4" />
                                {t('dropdown_menu.my_books')}
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full">
                              <Link
                                to="/course/my-course"
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                              >
                                <GraduationCap className="mr-2 h-4 w-4" />
                                {t('dropdown_menu.my_courses')}
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full">
                              <Link
                                to="/journals"
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                              >
                                <Newspaper className="mr-2 h-4 w-4" />
                                {t('dropdown_menu.journals')}
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full">
                              <Link
                                to="/wallet"
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                              >
                                <Wallet className="mr-2 h-4 w-4" />
                                {t('dropdown_menu.wallet')}
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full border-b mb-2">
                              <Link
                                to="/subscription"
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                              >
                                <CalendarSync className="mr-2 h-4 w-4" />
                                {t('dropdown_menu.subscriptions')}
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full mb-2">
                              <ThemeSwitcher
                                value={theme}
                                onChange={setTheme}
                              />
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full border-b pb-2">
                              <LocaleSwitcher />
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full">
                              <button
                                onClick={logout}
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline text-left"
                              >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                              </button>
                            </NavigationMenuItem>
                          </>
                        ) : (
                          <>
                            <NavigationMenuItem className="w-full mb-2">
                              <ThemeSwitcher
                                value={theme}
                                onChange={setTheme}
                              />
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full">
                              <LocaleSwitcher />
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full border-t mt-2">
                              <Link
                                search={{
                                  redirect: window.location.pathname,
                                }}
                                to="/login"
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                              >
                                {t('sign_in')}
                              </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem className="w-full">
                              <Link
                                search={{
                                  redirect: window.location.pathname,
                                }}
                                to="/register"
                                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                              >
                                {t('sign_up')}
                              </Link>
                            </NavigationMenuItem>
                          </>
                        )}
                      </div>
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Logo Title */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-white flex items-center justify-center rounded-md">
                  <img src="/logo.svg" alt="TRIZ Logo" className="h-8 w-8" />
                </div>
                <span className="hidden font-bold text-[16px] sm:inline-block max-w-56">
                  {t('logo_title')}
                </span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:flex items-center gap-1">
              {/* Home Link */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      data-active={cn(isLinkActive('/'))}
                      asChild
                      className={cn(
                        navigationMenuTriggerStyle(),
                        hoverLinkClass,
                        isLinkActive('/') && activeLinkClass,
                      )}
                    >
                      <Link to="/">{t('home')}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Learn TRIZ Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        hoverLinkClass,
                        isLearnTrizActive() && activeLinkClass,
                      )}
                    >
                      {t('learn_triz')}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[200px] gap-3 p-4">
                        {learnTrizNavLinks.map((link, index) => {
                          const Icon = link.icon;
                          return (
                            <li key={index}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={link.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    <div className="text-sm font-medium leading-none">
                                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                      {t(link.labelKey as any)}
                                    </div>
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Tools Dropdown */}
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        hoverLinkClass,
                        isToolsActive() && activeLinkClass,
                      )}
                    >
                      {t('tools')}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[280px] gap-3 p-4">
                        {toolsNavLinks.map((link, index) => {
                          const Icon = link.icon;
                          return (
                            <li key={index}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={link.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <Icon className="h-4 w-4" />
                                    <div className="text-sm font-medium leading-none">
                                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                      {t(link.labelKey as any)}
                                    </div>
                                  </div>
                                  <p className="text-xs leading-snug text-muted-foreground">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {t(`${link.labelKey}_desc` as any)}
                                  </p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Other Navigation Links */}
              <NavigationMenu>
                <NavigationMenuList>
                  {navLinks.slice(1).map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        asChild
                        className={cn(
                          navigationMenuTriggerStyle(),
                          hoverLinkClass,
                          isLinkActive(link.href) && activeLinkClass,
                        )}
                      >
                        <Link to={link.href}>{link.label}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Auth Buttons & Locale Switcher */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center space-x-4">
                  {/* Token Count Display */}
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-md">
                    <CircleDollarSign className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium">
                      {formatTriziliumShort(wallet?.balance || 0)}
                    </span>
                  </div>
                  {/* User Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <User className="h-4 w-4" />
                        <span className="sr-only">Open user menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          {t('dropdown_menu.profile')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/books/me" className="cursor-pointer">
                          <BookOpen className="mr-2 h-4 w-4" />
                          {t('dropdown_menu.my_books')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/course/my-course" className="cursor-pointer">
                          <GraduationCap className="mr-2 h-4 w-4" />
                          {t('dropdown_menu.my_courses')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/journals" className="cursor-pointer">
                          <Newspaper className="mr-2 h-4 w-4" />
                          {t('dropdown_menu.journals')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/wallet" className="cursor-pointer">
                          <Wallet className="mr-2 h-4 w-4" />
                          {t('dropdown_menu.wallet')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/subscription" className="cursor-pointer">
                          <CalendarSync className="mr-2 h-4 w-4" />
                          {t('dropdown_menu.subscriptions')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="mb-2">
                        <ThemeSwitcher value={theme} onChange={setTheme} />
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <LocaleSwitcher />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={logout}
                        className="cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('dropdown_menu.sign_out')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link
                      search={{
                        redirect: window.location.pathname,
                      }}
                      to="/login"
                    >
                      {t('sign_in')}
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link
                      search={{
                        redirect: window.location.pathname,
                      }}
                      to="/register"
                    >
                      {t('sign_up')}
                    </Link>
                  </Button>
                  <ThemeSwitcher value={theme} onChange={setTheme} />
                  <LocaleSwitcher />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  },
);

Navbar03.displayName = 'Navbar03';
