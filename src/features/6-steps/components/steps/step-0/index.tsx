import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

import PrincipleLabel from './principle-label';
import Corner1 from '../../svg/corner-1';
import Corner2 from '../../svg/corner-2';
import Corner3 from '../../svg/corner-3';
import Corner4 from '../../svg/corner-4';
import LogoTriz from '../../svg/logo-triz';

interface Step0IntroductionProps {
  onStart: () => void;
}

export const Step0Introduction = ({ onStart }: Step0IntroductionProps) => {
  return (
    <div className="relative flex flex-col gap-12">
      <div className="h-[480px] relative overflow-hidden w-full py-4">
        {/* Center Logo with animations */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute z-10"
        >
          <LogoTriz />
          <motion.div
            initial={{
              opacity: 0,
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            animate={{ opacity: 1, transform: 'translate(-125%, -50%)' }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="absolute text-6xl leading-[72px] font-medium text-nowrap"
          >
            KHÁM PHÁ
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            animate={{ opacity: 1, transform: 'translate(125%, -50%)' }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="absolute text-6xl leading-[72px] font-medium text-nowrap"
          >
            SÁNG TẠO
          </motion.div>
        </motion.div>

        {/* Left side corners with staggered animations */}
        <div className="absolute left-0 w-1/2 h-full">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            className="absolute right-0"
          >
            <Corner1 />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1, ease: 'backOut' }}
              className="absolute left-1/4 -top-2"
            >
              <PrincipleLabel text="Phẩm chất cục bộ" principleNo={3} />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
            className="absolute top-1/2 right-0"
          >
            <Corner2 />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2, ease: 'backOut' }}
              className="absolute left-[40%] -bottom-2"
            >
              <PrincipleLabel text="Phân nhỏ" principleNo={1} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.3, ease: 'backOut' }}
              className="absolute left-1/2 -bottom-2"
            >
              <PrincipleLabel text="Phản đối xứng" principleNo={4} />
            </motion.div>
          </motion.div>
        </div>

        {/* Right side corners with staggered animations */}
        <div className="absolute left-1/2 w-1/2 h-full">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
            className="absolute"
          >
            <Corner3 />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1, ease: 'backOut' }}
              className="absolute right-1/2 -top-2"
            >
              <PrincipleLabel text="Phản trọng lượng" principleNo={8} />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: 'easeOut' }}
            className="absolute top-1/2"
          >
            <Corner4 />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4, ease: 'backOut' }}
              className="absolute left-[65%] -bottom-2"
            >
              <PrincipleLabel text="Phân nhỏ" principleNo={1} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5, ease: 'backOut' }}
              className="absolute right-0 -bottom-2"
            >
              <PrincipleLabel text="Gây ứng suất sơ bộ" principleNo={9} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.6, ease: 'backOut' }}
              className="absolute -right-[20%] -bottom-2"
            >
              <PrincipleLabel text="Đẳng thế" principleNo={12} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1, ease: 'easeOut' }}
        className="text-center justify-start text-slate-600 dark:text-slate-300 text-xl font-normal leading-8"
      >
        Từng bước tái hiện quá trình sáng tạo
        <br /> để khám phá quy luật ẩn sau.
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.2, ease: 'easeOut' }}
        className="flex justify-center"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" onClick={onStart}>
            Bắt Đầu Ngay <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
