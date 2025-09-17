import { Link } from '@tanstack/react-router';
import * as React from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import HamburgerIcon from '@/assets/hamburger-icon';
import LocaleSwitcher from '@/components/locale-switcher';
import { Button } from '@/components/ui/button';
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
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib/utils';

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
    const { t } = useTranslation('header');

    // Default navigation links if none provided
    const defaultNavigationLinks: Navbar03NavItem[] = [
      { href: '/', label: t('home'), active: true },
      { href: '#', label: t('learn_triz') },
      { href: '#', label: t('quiz') },
      { href: '#', label: t('forum') },
      { href: '#', label: t('chat_ai') },
    ];

    const navLinks = navigationLinks || defaultNavigationLinks;
    const isMobile = useMediaQuery('(max-width: 767px)'); // 767px is md breakpoint
    const containerRef = useRef<HTMLElement>(null);

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
                          {link.href === '/' ? (
                            <Link
                              to={link.href}
                              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                            >
                              {link.label}
                            </Link>
                          ) : (
                            <a
                              href={link.href}
                              className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer no-underline"
                            >
                              {link.label}
                            </a>
                          )}
                        </NavigationMenuItem>
                      ))}
                      <div className="w-full border-t pt-2 mt-2">
                        <NavigationMenuItem className="w-full">
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
                      </div>
                    </NavigationMenuList>
                  </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}
            {/* Logo Title */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    T
                  </span>
                </div>
                <span className="hidden font-bold text-lg sm:inline-block">
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
                        {link.href === '/' ? (
                          <Link to={link.href}>{link.label}</Link>
                        ) : (
                          <a href={link.href}>{link.label}</a>
                        )}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Auth Buttons & Locale Switcher */}
            <div className="flex items-center space-x-4">
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
              </div>

              <LocaleSwitcher />
            </div>
          </div>
        </div>
      </header>
    );
  },
);

Navbar03.displayName = 'Navbar03';
