import { Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { principlesData } from '@/pages/main/public/learn-triz/components/principles-data';

type PrincipleLabelProps = {
  text: string;
  principleNo?: number;
};

const PrincipleLabel = ({ text, principleNo }: PrincipleLabelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find the principle data based on principleNo
  const principleData = principleNo
    ? principlesData.find((p) => p.number === principleNo)
    : null;

  const handleMouseEnter = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Set a delay before closing
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // 300ms delay
  };

  // If no principleNo is provided, render a simple button
  if (!principleNo || !principleData) {
    return (
      <button className="px-3 py-1 bg-white dark:bg-slate-800 rounded-3xl outline outline-1 outline-offset-[-1px] outline-slate-200 dark:outline-slate-700 inline-flex justify-center items-center gap-2.5 mx-auto transition-colors">
        <div className="justify-start text-slate-900 dark:text-slate-100 text-xs font-normal font-['Inter'] leading-5">
          {text}
        </div>
      </button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Link
          to="/learn-triz"
          hash={`principle-${principleNo}`}
          className="px-3 py-1 bg-white dark:bg-slate-800 rounded-3xl outline outline-1 outline-offset-[-1px] outline-slate-200 dark:outline-slate-700 inline-flex justify-center items-center gap-2.5 mx-auto transition-all hover:shadow-md hover:outline-blue-600 dark:hover:outline-blue-500 cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="justify-start text-slate-900 dark:text-slate-100 text-xs font-normal font-['Inter'] leading-5">
            {text}
          </div>
        </Link>
      </PopoverTrigger>
      <PopoverContent
        className="w-[500px] p-0 overflow-hidden border-slate-200 dark:border-slate-700 dark:bg-slate-900"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex">
          {/* Principle Image - Left Side */}
          {principleData.image && (
            <div className="w-48 flex-shrink-0 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={principleData.image}
                alt={principleData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content - Right Side */}
          <div className="flex-1 flex flex-col">
            {/* Principle Number and Title */}
            <div className="bg-blue-600 dark:bg-blue-700 text-white p-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white font-bold text-sm flex-shrink-0">
                  {principleNo}
                </span>
                <h4 className="font-semibold text-sm line-clamp-2">
                  {principleData.title}
                </h4>
              </div>
            </div>

            {/* Principle Description */}
            {principleData.description && (
              <div className="p-3 flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4">
                  {principleData.description}
                </p>
              </div>
            )}

            {/* Click hint */}
            <Link
              to="/learn-triz"
              hash={`principle-${principleNo}`}
              className="bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-center border-t dark:border-slate-700 mt-auto transition-colors block"
            >
              Click để xem chi tiết
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PrincipleLabel;
