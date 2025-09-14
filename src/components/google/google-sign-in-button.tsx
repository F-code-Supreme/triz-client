import { useGoogleLogin } from '@react-oauth/google';
import { ReactSVG } from 'react-svg';

import GoogleIcon from '@/assets/google-icon.svg';

import { SecondaryButton } from '../forms/buttons/secondary-button';

type GoogleSignInButtonProps = {
  title: string;
};

const GoogleSignInButton = ({ title }: GoogleSignInButtonProps) => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    flow: 'auth-code',
  });

  return (
    <SecondaryButton onClick={() => login()}>
      <ReactSVG src={GoogleIcon} className="mr-2" />
      {title}
    </SecondaryButton>
  );
};

export default GoogleSignInButton;
