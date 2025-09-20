import { GoogleLogin } from '@react-oauth/google';

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
    />
  );
};

export default GoogleSignInButton;
