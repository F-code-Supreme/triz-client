import { useNavigate } from '@tanstack/react-router';
import { CheckCircle, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BackgroundBeams } from '@/components/ui/shadcn-io/background-beams';
import { Skeleton } from '@/components/ui/skeleton';
import TokenDisplay from '@/components/ui/token-display';
import useAuth from '@/features/auth/hooks/use-auth';
import { useGetActivePackagesQuery } from '@/features/packages/services/queries';
import { useGetWalletByUserQuery } from '@/features/payment/wallet/services/queries';
import { PurchaseInvoiceDialog } from '@/features/subscription/components';
import { useGetSubscriptionsByUserQuery } from '@/features/subscription/services/queries';
import { SubscriptionStatus } from '@/features/subscription/types';
import { DefaultLayout } from '@/layouts/default-layout';
import { formatTrizilium, formatDailyTrizilium } from '@/utils';

import type { Package } from '@/features/packages/types';

// Check if a package has a specific feature
// Larger packages include all features of smaller packages
const packageHasFeature = (
  pkgs: Package[],
  pkg: Package,
  featureName: string,
) => {
  // Direct feature check
  const hasDirectFeature = pkg.features.some(
    (f) => f.description === featureName,
  );
  if (hasDirectFeature) return true;

  // Check if this feature belongs to a cheaper package
  const pkgIndex = pkgs.findIndex((p) => p.id === pkg.id);
  if (pkgIndex === -1) return false;

  // Check all cheaper packages
  for (let i = 0; i < pkgIndex; i++) {
    const cheaperPkg = pkgs[i];
    if (cheaperPkg.features.some((f) => f.description === featureName)) {
      return true; // Higher tier includes lower tier features
    }
  }

  return false;
};

// Skeleton loader for package cards
const PackageCardSkeleton = () => (
  <Card className="flex flex-col border-2">
    <CardHeader className="text-center space-y-4">
      <div>
        <Skeleton className="h-8 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-20 mx-auto" />
        <Skeleton className="h-4 w-16 mx-auto" />
      </div>
      <div className="space-y-1">
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardHeader>
    <CardContent className="flex-1 space-y-4">
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const PackagesPricingPage = () => {
  const { t } = useTranslation('pages.packages');
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { data: packages = [], isLoading } = useGetActivePackagesQuery();
  const { data: wallet } = useGetWalletByUserQuery(user?.id);
  const { data: subscriptionsData } = useGetSubscriptionsByUserQuery(
    { pageIndex: 0, pageSize: 1 },
    [
      {
        id: 'startDate',
        desc: true,
      },
      {
        id: 'priceInTokens',
        desc: true,
      },
    ],
    user?.id,
  );

  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const walletBalanceInTrizilium = useMemo(() => {
    return wallet?.balance || 0;
  }, [wallet]);

  // Check if user has an active subscription
  const hasActiveSubscription = useMemo(() => {
    if (!subscriptionsData?.content) return false;
    return subscriptionsData.content.some(
      (sub) => sub.status === SubscriptionStatus.ACTIVE,
    );
  }, [subscriptionsData]);

  // Handle "Get Started" button click
  const handleGetStarted = (pkg: Package) => {
    if (!isAuthenticated) {
      navigate({ to: '/login' });
      return;
    }

    if (hasActiveSubscription) {
      navigate({ to: '/subscription' });
      return;
    }

    setSelectedPackage(pkg);
    setInvoiceOpen(true);
  };

  // Get all unique features across packages
  const allFeatures = useMemo(() => {
    const featuresMap = new Map<string, string>();
    packages.forEach((pkg) => {
      pkg.features.forEach((feature) => {
        featuresMap.set(feature.description, feature.description);
      });
    });
    return Array.from(featuresMap.values());
  }, [packages]);

  // Find the most popular package (highest priced or first)
  const mostPopularId = useMemo(() => {
    if (packages.length === 0) return null;
    return packages[0].id;
  }, [packages]);

  return (
    <DefaultLayout meta={{ title: t('page_meta_title') }}>
      <BackgroundBeams className="absolute inset-0" />
      <div className="relative z-10">
        <section className="w-full py-4">
          <div className="container mx-auto px-4 md:px-6">
            {/* Header */}
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                {t('title')}
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                {t('description')}
              </p>
            </div>

            {/* Active Subscription Alert */}
            {isAuthenticated && hasActiveSubscription && (
              <Alert className="mb-8 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800">
                <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                <AlertDescription className="text-blue-800 dark:text-blue-400">
                  {t('active_subscription_alert')}{' '}
                  <button
                    onClick={() => navigate({ to: '/subscription' })}
                    className="font-semibold underline hover:opacity-80"
                  >
                    {t('subscription_page')}
                  </button>{' '}
                  {t('to_manage')}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="grid gap-8 max-w-6xl mx-auto md:grid-cols-3">
                <PackageCardSkeleton />
                <PackageCardSkeleton />
                <PackageCardSkeleton />
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  {t('no_packages')}
                </p>
              </div>
            ) : (
              <>
                {/* Pricing Cards Grid */}
                <div
                  className={`grid gap-8 max-w-6xl mx-auto ${
                    packages.length === 1
                      ? 'md:grid-cols-1'
                      : packages.length === 2
                        ? 'md:grid-cols-2'
                        : 'md:grid-cols-3'
                  }`}
                >
                  {packages.map((pkg) => {
                    const isPopular = pkg.id === mostPopularId;
                    return (
                      <Card
                        key={pkg.id}
                        className={`flex flex-col border-2 relative transition-all hover:shadow-lg ${
                          isPopular
                            ? 'border-primary md:scale-105'
                            : 'border-border'
                        }`}
                      >
                        {/* Popular Badge */}
                        {isPopular && packages.length > 1 && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="px-4 py-1">
                              {t('most_popular')}
                            </Badge>
                          </div>
                        )}

                        {/* Header */}
                        <CardHeader className="text-center space-y-4">
                          <div>
                            <CardTitle className="text-2xl">
                              {pkg.name}
                            </CardTitle>
                            <p className="text-muted-foreground">
                              {t('duration_days', {
                                count: pkg.durationInDays,
                              })}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="text-4xl font-bold">
                              {formatTrizilium(pkg.priceInTokens, {
                                showSymbol: false,
                              })}
                            </div>
                            <div className="text-muted-foreground">
                              {t('trizilium')}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <TokenDisplay
                              isShortForm={false}
                              content={formatDailyTrizilium(
                                pkg.chatTokenPerDay,
                                {
                                  shortForm: true,
                                },
                              )}
                            />
                          </div>
                          <Button
                            className="w-full"
                            size="lg"
                            onClick={() => handleGetStarted(pkg)}
                            disabled={isAuthenticated && hasActiveSubscription}
                          >
                            {isAuthenticated && hasActiveSubscription
                              ? t('view_subscription')
                              : t('get_started')}
                          </Button>
                        </CardHeader>

                        {/* Features */}
                        <CardContent className="flex-1 space-y-4">
                          <div className="space-y-3">
                            {pkg.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="flex-shrink-0 mt-0.5">
                                  {feature.iconUrl ? (
                                    <img
                                      src={feature.iconUrl}
                                      alt={feature.description}
                                      className="h-5 w-5"
                                    />
                                  ) : (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  )}
                                </div>
                                <span className="text-sm">
                                  {feature.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Features Comparison Table */}
                {packages.length > 1 && allFeatures.length > 0 && (
                  <div className="mt-20 max-w-6xl mx-auto">
                    <h3 className="text-2xl font-bold text-center mb-8">
                      {t('detailed_comparison')}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-4 px-4 font-semibold">
                              {t('features')}
                            </th>
                            {packages.map((pkg) => (
                              <th
                                key={pkg.id}
                                className="text-center py-4 px-4 font-semibold"
                              >
                                {pkg.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {allFeatures.map((feature, idx) => (
                            <tr
                              key={idx}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="py-4 px-4 text-left">{feature}</td>
                              {packages.map((pkg) => (
                                <td
                                  key={pkg.id}
                                  className="text-center py-4 px-4"
                                >
                                  {packageHasFeature(packages, pkg, feature) ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                                  ) : (
                                    <X className="h-5 w-5 text-muted-foreground mx-auto" />
                                  )}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Purchase Invoice Dialog */}
        <PurchaseInvoiceDialog
          open={invoiceOpen}
          onOpenChange={setInvoiceOpen}
          package={selectedPackage}
          walletBalance={walletBalanceInTrizilium}
        />
      </div>
    </DefaultLayout>
  );
};

export default PackagesPricingPage;
