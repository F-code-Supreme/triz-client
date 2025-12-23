import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetUserAchievementsQuery } from '@/features/achievement/services/queries';
import useAuth from '@/features/auth/hooks/use-auth';
import { useGetMeQuery } from '@/features/auth/services/queries';
import { ProfileView } from '@/features/user/components';
import { DefaultLayout } from '@/layouts/default-layout';

const ProfilePage = () => {
  const { t } = useTranslation('pages.profile');
  const { user } = useAuth();
  const { data, isLoading } = useGetMeQuery();

  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });
  const [sorting] = useState([{ id: 'earnedAt', desc: true }]);

  const { data: achievementsData, isLoading: achievementsLoading } =
    useGetUserAchievementsQuery(user?.id, pagination, sorting);

  return (
    <DefaultLayout
      meta={{
        title: t('page_meta_title'),
      }}
      showFooter={true}
      showFooterCTA={false}
    >
      <ProfileView
        userData={data}
        isLoadingUser={isLoading}
        achievementsData={achievementsData}
        isLoadingAchievements={achievementsLoading}
        currentUser={user || undefined}
      />
    </DefaultLayout>
  );
};

export default ProfilePage;
