import { useGoogleLogin } from '@react-oauth/google';
import { ReactSVG } from 'react-svg';

import GoogleIcon from '@/assets/google-icon.svg';

import { Button } from '../ui/button';

type GoogleSignInButtonProps = {
  title: string;
};

const GoogleSignInButton = ({ title }: GoogleSignInButtonProps) => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => console.log(codeResponse),
    flow: 'auth-code',
  });

  return (
    <Button onClick={() => login()}>
      <ReactSVG src={GoogleIcon} className="mr-2" />
      {title}
    </Button>
  );
};

export default GoogleSignInButton;
