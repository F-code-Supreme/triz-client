import { Link } from '@tanstack/react-router';
import { Newspaper, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetJournalsByUserQuery } from '@/features/6-steps/services/queries';
import useAuth from '@/features/auth/hooks/use-auth';
import { DefaultLayout } from '@/layouts/default-layout';

const JournalsPage = () => {
  const { t } = useTranslation('pages.journals');
  const { user } = useAuth();

  const { data, isLoading, error } = useGetJournalsByUserQuery(user?.id);

  const journals = data?.content || [];

  const getStatusBadge = (status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED') => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="default" className="bg-green-600">
            {t('status_completed')}
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="default" className="bg-blue-600">
            {t('status_in_progress')}
          </Badge>
        );
      case 'DRAFT':
        return (
          <Badge variant="outline" className="border-gray-500">
            {t('status_draft')}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStepProgress = (stepData: Record<string, unknown>) => {
    const steps = [
      'step1Understand',
      'step2Objectives',
      'step3Analysis',
      'step4Contradiction',
      'step5Ideas',
      'step6Decision',
    ];
    const completedSteps = steps.filter((step) => stepData[step]).length;
    return { completed: completedSteps, total: 6 };
  };

  return (
    <DefaultLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      <div className="space-y-8 py-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Newspaper className="h-8 w-8" />
            {t('title')}
          </h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>

        {/* Journals Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
            <h3 className="text-lg font-semibold text-destructive mb-2">
              {t('error_title')}
            </h3>
            <p className="text-destructive/80 mb-4">{t('error_description')}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="destructive"
            >
              {t('retry')}
            </Button>
          </div>
        ) : journals.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/50 p-12 text-center">
            <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t('no_journals')}
            </h3>
            <p className="text-muted-foreground">
              {t('no_journals_description')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journals.map((journal) => {
              const progress = getStepProgress(journal.stepData || {});

              return (
                <Card
                  key={journal.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  <CardContent className="relative p-6 flex-1 flex flex-col">
                    <div className="absolute top-3 left-6">
                      {getStatusBadge(journal.status)}
                    </div>
                    <h3 className="text-xl font-semibold mt-6 mb-3 line-clamp-2">
                      {journal.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{t('progress')}</span>
                        <span>
                          {progress.completed}/{progress.total}{' '}
                          {t('steps_completed')}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${(progress.completed / progress.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground mt-auto">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {t('created_date')}:{' '}
                          {new Date(journal.createdAt).toLocaleDateString(
                            'vi-VN',
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {t('updated_date')}:{' '}
                          {new Date(journal.updatedAt).toLocaleDateString(
                            'vi-VN',
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full" asChild>
                      <Link
                        to="/journals/$journalId"
                        params={{ journalId: journal.id }}
                      >
                        {t('read_more')}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default JournalsPage;
