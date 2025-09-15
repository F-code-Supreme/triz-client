import { useTranslation } from 'react-i18next';

import RegisterForm from '@/features/auth/components/register-form';
import { DefaultLayout } from '@/layouts/default-layout';

const RegisterPage = () => {
  const { t } = useTranslation('pages.sign_up');

  return (
    <DefaultLayout
      meta={{
        title: t('page_meta_title'),
      }}
      headerVisible={false}
    >
      <RegisterForm />
    </DefaultLayout>
  );
};

export default RegisterPage;
