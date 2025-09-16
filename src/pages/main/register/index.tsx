import { useTranslation } from 'react-i18next';

import RegisterForm from '@/features/auth/components/register-form';
import { AuthLayout } from '@/layouts/auth-layout';

const RegisterPage = () => {
  const { t } = useTranslation('pages.sign_up');

  return (
    <AuthLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
