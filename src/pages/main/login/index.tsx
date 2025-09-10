import { LoginForm } from '@/components/forms/login/login-form';
import { DefaultLayout } from '@/layouts/default-layout';

const LoginPage = () => {
  const meta = {
    title: 'Login Page - Triz',
  };
  return (
    <DefaultLayout meta={meta}>
      <div className="border rounded-lg p-6 bg-card space-y-8">
        <LoginForm />
      </div>
    </DefaultLayout>
  );
};

export default LoginPage;
