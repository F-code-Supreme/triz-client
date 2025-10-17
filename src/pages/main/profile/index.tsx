import { format } from 'date-fns';
import { vi, enUS } from 'date-fns/locale';
import {
  User,
  Mail,
  Calendar,
  CreditCard,
  Trophy,
  HelpCircle,
  ChevronRight,
  Star,
  Shield,
  Settings,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DefaultLayout } from '@/layouts/default-layout';
import { Route } from '@/routes/_auth.profile';

const COLORS = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#607D8B',
];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function getAvatarColor(identifier: string) {
  const hash = Math.abs(hashString(identifier));
  return COLORS[hash % COLORS.length];
}

const ProfilePage = () => {
  const { t, i18n } = useTranslation('pages.profile');
  const { auth } = Route.useRouteContext();

  const getUserInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const locale = i18n.language === 'vi' ? vi : enUS;
    return format(date, 'dd MMMM, yyyy', { locale });
  };

  // fake date
  const creationDate = '2025-10-06T00:00:00.000Z';

  const userEmail = auth.user?.email || '';
  const userName = auth.user?.name || '';
  const userInitials = userName
    ? userName.trim().charAt(0).toUpperCase()
    : getUserInitials(userEmail);
  const avatarColor = getAvatarColor(userName || userEmail);

  return (
    <DefaultLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 to-blue-300 p-8 mb-8 text-white">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 md:w-28 md:h-28 ring-4 ring-white/20 shadow-2xl">
                <AvatarFallback
                  className="text-white text-2xl md:text-3xl font-bold"
                  style={{ backgroundColor: avatarColor }}
                >
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">
                  {userName || userEmail}
                </h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Premium User
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white hover:bg-white/30"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full"></div>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-500" />
                  {t('personal_info', 'Personal Information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium text-sm text-muted-foreground">
                        {t('email_label', 'Email')}
                      </span>
                    </div>
                    <p className="text-foreground font-semibold pl-11">
                      {userEmail}
                    </p>
                  </div>

                  <div className="group p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800">
                        <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium text-sm text-muted-foreground">
                        {t('display_name_label', 'Display Name')}
                      </span>
                    </div>
                    <p className="text-muted-foreground italic pl-11">
                      {t('display_name_placeholder', 'Not updated')}
                    </p>
                  </div>

                  <div className="group p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-md transition-all md:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800">
                        <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="font-medium text-sm text-muted-foreground">
                        {t('created_date_label', 'Account Creation Date')}
                      </span>
                    </div>
                    <p className="text-foreground font-semibold pl-11">
                      {formatDate(creationDate)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <Settings className="w-6 h-6 text-purple-500" />
                {t('services_features', 'Services & Features')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="ghost"
                  className="h-auto p-6 flex-col items-start hover:bg-blue-50 dark:hover:bg-blue-900/20 group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                >
                  <div className="flex items-center gap-3 mb-2 w-full">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-800 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                  </div>
                  <div className="text-left w-full">
                    <p className="font-semibold text-foreground mb-1">
                      {t('payment_management', 'Payment Management')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('payment_desc', 'Manage payment methods')}
                    </p>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto p-6 flex-col items-start hover:bg-yellow-50 dark:hover:bg-yellow-900/20 group border border-transparent hover:border-yellow-200 dark:hover:border-yellow-800"
                >
                  <div className="flex items-center gap-3 mb-2 w-full">
                    <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-800 group-hover:scale-110 transition-transform">
                      <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                  </div>
                  <div className="text-left w-full">
                    <p className="font-semibold text-foreground mb-1">
                      {t('achievements', 'Achievements')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('achievements_desc', 'View achievements and rewards')}
                    </p>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="h-auto p-6 flex-col items-start hover:bg-green-50 dark:hover:bg-green-900/20 group border border-transparent hover:border-green-200 dark:hover:border-green-800"
                >
                  <div className="flex items-center gap-3 mb-2 w-full">
                    <div className="p-3 rounded-xl bg-green-100 dark:bg-green-800 group-hover:scale-110 transition-transform">
                      <HelpCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                  </div>
                  <div className="text-left w-full">
                    <p className="font-semibold text-foreground mb-1">
                      {t('support', 'Support')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('support_desc', 'Contact support team')}
                    </p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProfilePage;
