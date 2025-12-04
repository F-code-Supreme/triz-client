import { ReactSVG } from 'react-svg';

import LogoSecondary from '@/assets/images/6-steps/logo-secondary.svg';

const LogoTriz = () => {
  return (
    <div className="w-64 h-64 bg-slate-50 rounded-[32px] border-2 border-slate-200 flex items-center justify-center">
      <ReactSVG src={LogoSecondary} className="object-contain p-4" />
    </div>
  );
};

export default LogoTriz;
