import { useTranslation } from 'react-i18next';

import { LoginForm } from '@/components/forms/login/login-form';
import { DefaultLayout } from '@/layouts/default-layout';

const LoginPage = () => {
  const { t } = useTranslation('pages.sign_in');

  return (
    <DefaultLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      <div className="border rounded-lg p-6 bg-card space-y-8">
        <LoginForm />
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
