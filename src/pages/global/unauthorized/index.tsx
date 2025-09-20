import { Link } from '@tanstack/react-router';
import { ArrowLeft, Home, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DefaultLayout } from '@/layouts/default-layout';

const UnauthorizedPage = () => {
  const { t } = useTranslation(['pages.unauthorized', 'common', 'action']);

  return (
    <DefaultLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-0 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-12 text-center space-y-8">
            {/* Large 403 Number with Shield Icon */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Shield className="h-16 w-16 text-destructive" />
                <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-destructive to-destructive/60 bg-clip-text">
                  403
                </h1>
              </div>
              <div className="h-1 w-32 bg-gradient-to-r from-destructive to-destructive/60 mx-auto rounded-full" />
            </div>

            {/* Error Messages */}
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-foreground">
                {t('unauthorized')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                {t('message')}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button asChild size="lg" className="min-w-[160px]">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {t('back_to_homepage')}
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => window.history.back()}
                className="min-w-[160px] flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('action:back')}
              </Button>

              <Button
                asChild
                variant="secondary"
                size="lg"
                className="min-w-[160px]"
              >
                <Link to="/login" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {t('sign_in')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default UnauthorizedPage;
