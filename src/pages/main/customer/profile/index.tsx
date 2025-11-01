import { useTranslation } from 'react-i18next';

import { DefaultLayout } from '@/layouts/default-layout';
import { Route } from '@/routes/_auth.profile';

const ProfilePage = () => {
  const { t } = useTranslation('pages.profile');
  const { auth } = Route.useRouteContext();
  return (
    <DefaultLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      <div>
        <h1>Profile Page, {auth.user?.email}</h1>
      </div>
    </DefaultLayout>
  );
};

export default ProfilePage;
