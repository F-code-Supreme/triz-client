import { GoogleLogin } from '@react-oauth/google';

import i18n from '@/configs/i18next';
import useAuth from '@/features/auth/hooks/use-auth';

type GoogleSignInButtonProps = {
  onSuccess?: () => void;
};

const GoogleSignInButton = ({ onSuccess }: GoogleSignInButtonProps) => {
  const { loginGoogle } = useAuth();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
          loginGoogle({ idToken: credentialResponse.credential }, onSuccess);
        }
      }}
      useOneTap
      locale={i18n.language || 'vi'}
    />
  );
};

export default GoogleSignInButton;
