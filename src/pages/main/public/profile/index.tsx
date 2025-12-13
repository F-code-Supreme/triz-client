import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetUserAchievementsQuery } from '@/features/achievement/services/queries';
import { ProfileView } from '@/features/user/components';
import { useGetUserByIdQuery } from '@/features/user/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';
import { Route } from '@/routes/users.$userId';

const PublicProfilePage = () => {
  const { t } = useTranslation('pages.profile');
  const { userId } = Route.useParams();

  const { data, isLoading } = useGetUserByIdQuery(userId);

  const [pagination] = useState({ pageIndex: 0, pageSize: 100 });
  const [sorting] = useState([{ id: 'earnedAt', desc: true }]);

  const { data: achievementsData, isLoading: achievementsLoading } =
    useGetUserAchievementsQuery(userId, pagination, sorting);

  return (
    <DefaultLayout
      meta={{
        title: `${data?.fullName || 'User'} - ${t('page_meta_title')}`,
      }}
      showFooter={true}
      showFooterCTA={false}
    >
      <ProfileView
        userData={data}
        isLoadingUser={isLoading}
        achievementsData={achievementsData}
        isLoadingAchievements={achievementsLoading}
        isOwnProfile={false}
      />
    </DefaultLayout>
  );
};

export default PublicProfilePage;
