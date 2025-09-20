import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import AlertError from '@/components/alert/alert-error';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import VerifyOtpForm from '@/features/otp/components/verify-otp-form';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from '@/features/otp/services/mutations';
import { OtpPurpose } from '@/features/otp/services/mutations/types';
import { AuthLayout } from '@/layouts/auth-layout';
import { Route } from '@/routes/forgot-password.verify-otp';

const VerifyOtpPage = () => {
  const { t } = useTranslation('pages.forgot_password.verify_otp');
  const { email } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { auth } = Route.useRouteContext();

  const {
    mutate: sendOtpMutate,
    isPending: isSendingOtp,
    error: sendOtpError,
  } = useSendOtpMutation();

  const { mutate: verifyOtpMutate, isPending: isVerifyingOtp } =
    useVerifyOtpMutation();

  useEffect(() => {
    if (email) {
      sendOtpMutate(
        { email, purpose: OtpPurpose.PASSWORD_RESET },
        {
          onSuccess: () => {
            toast.info(
              'Check your email for the OTP to reset your password. The OTP is only valid for 10 minutes.',
            );
          },
          onError: (error) => {
            toast.error(
              error.response?.data.message ||
                'Failed to send OTP. Please try again.',
            );
          },
        },
      );
    }
  }, [email, sendOtpMutate]);

  if (!email) {
    return (
      <AuthLayout
        meta={{
          title: t('page_meta_title'),
        }}
      >
        <AlertError
          title="Invalid Access"
          description="Email parameter is missing. Please start the password reset process again."
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      meta={{
        title: t('page_meta_title'),
      }}
    >
      {sendOtpError && (
        <AlertError
          title="OTP Error"
          description={
            (sendOtpError as { response?: { data?: { message?: string } } })
              ?.response?.data?.message ||
            'Error sending OTP. Please try again.'
          }
        />
      )}

      {isSendingOtp ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Spinner variant="ellipsis" />
        </div>
      ) : (
        <VerifyOtpForm
          email={email}
          purpose={OtpPurpose.PASSWORD_RESET}
          isVerifying={isVerifyingOtp}
          onVerify={(otp) => {
            verifyOtpMutate(
              {
                email,
                otp,
                purpose: OtpPurpose.PASSWORD_RESET,
              },
              {
                onSuccess: (response) => {
                  if (response?.data?.accessToken) {
                    // Store the access token temporarily
                    auth.verifyOtpPasswordReset(response.data.accessToken);

                    // Navigate to new password page
                    navigate({
                      to: '/forgot-password/new-password',
                    });
                  } else {
                    toast.error('No access token received. Please try again.');
                  }
                },
                onError: (error) => {
                  const errorMessage = (
                    error as { response?: { data?: { message?: string } } }
                  )?.response?.data?.message;
                  toast.error(
                    errorMessage ||
                      'OTP verification failed. Please try again.',
                  );
                },
              },
            );
          }}
        />
      )}
    </AuthLayout>
  );
};

export default VerifyOtpPage;
