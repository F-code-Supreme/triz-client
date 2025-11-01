import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import AlertError from '@/components/alert/alert-error';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import VerifyOtpForm from '@/features/otp/components/verify-otp-form';
import { useSendOtpMutation } from '@/features/otp/services/mutations';
import { OtpPurpose } from '@/features/otp/services/mutations/types';
import { AuthLayout } from '@/layouts/auth-layout';
import { Route } from '@/routes/register.verify-otp';

const VerifyOtpPage = () => {
  const { t } = useTranslation('pages.sign_up.verify_otp');
  const { email } = Route.useSearch();
  const navigate = Route.useNavigate();
  const {
    mutate: sendOtpMutate,
    isPending: isSendingOtp,
    error,
  } = useSendOtpMutation();

  useEffect(() => {
    sendOtpMutate(
      { email, purpose: OtpPurpose.REGISTRATION },
      {
        onSuccess: () => {
          toast.info(
            'Check your email for the OTP to verify your account. The OTP is only valid for 10 minutes.',
          );
        },
      },
    );
  }, []);

  const handleSuccess = () => {
    navigate({ to: '/login' });
  };

  return (
    <AuthLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      {error && (
        <AlertError
          title="OTP Error"
          description={error.message || 'Error sending OTP. Please try again.'}
        />
      )}
      {isSendingOtp ? (
        <Spinner variant="ellipsis" />
      ) : (
        <VerifyOtpForm
          email={email}
          purpose={OtpPurpose.REGISTRATION}
          onSuccess={handleSuccess}
        />
      )}
    </AuthLayout>
  );
};

export default VerifyOtpPage;
