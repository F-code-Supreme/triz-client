import { Link } from '@tanstack/react-router';
import {
  User,
  LogOut,
  BookOpen,
  Wallet,
  CalendarSync,
  Zap,
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
import { useGetActiveSubscriptionByUserQuery } from '@/features/subscription/services/queries';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';

import { ThemeSwitcher } from './shadcn-io/theme-switcher';
import { useTheme } from '../theme/theme-provider';

// Types
export interface Navbar03NavItem {
  href?: string;
  label: string;
  active?: boolean;
}

export interface Navbar03Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar03NavItem[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  onSignInClick?: () => void;
  onCtaClick?: () => void;
}

export const Navbar03 = React.forwardRef<HTMLElement, Navbar03Props>(
  ({ className, navigationLinks, ...props }, ref) => {
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation('header');
    const { isAuthenticated, user } = useAuth();
    const logout = useLogout();

    // Fetch active subscription and wallet
    const { data: activeSubscription } = useGetActiveSubscriptionByUserQuery(
      user?.id,
    );
    const { data: wallet } = useGetWalletByUserQuery(user?.id);

    // Get token count from active subscription or wallet balance
    const tokenBalance =
      activeSubscription?.tokensPerDayRemaining ?? wallet?.balance ?? 0;

    // Default navigation links if none provided
    const defaultNavigationLinks: Navbar03NavItem[] = [
      { href: '/', label: t('home'), active: true },
      { href: '/learn-triz', label: t('learn_triz') },
      { href: '/course', label: t('course') },
      { href: '/quiz', label: t('quiz') },
      { href: '#', label: t('forum') },
      { href: '/chat-triz', label: t('chat_ai') },
    ];

    const navLinks = navigationLinks || defaultNavigationLinks;
    const isMobile = useMediaQuery('(max-width: 767px)'); // 767px is md breakpoint
    const containerRef = React.useRef<HTMLElement>(null);

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
                <img src="/logo.svg" alt="TRIZ Logo" className="h-8 w-8" />
                <span className="hidden font-bold text-[16px] sm:inline-block max-w-56">
                  {t('logo_title')}
                </span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="hidden md:flex">
              <NavigationMenu>
                <NavigationMenuList>
                  {navLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        asChild
                        className={cn(navigationMenuTriggerStyle())}
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
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-accent/50">
                    <Zap className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium">
                      {tokenBalance.toLocaleString()}
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
