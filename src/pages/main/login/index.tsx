import { useTranslation } from 'react-i18next';

import LoginForm from '@/features/auth/components/login-form';
import { AuthLayout } from '@/layouts/auth-layout';

const LoginPage = () => {
  const { t } = useTranslation('pages.sign_in');

  return (
    <AuthLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
