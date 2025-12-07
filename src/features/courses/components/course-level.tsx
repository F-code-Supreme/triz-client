import { Star, Zap, Award, Circle } from 'lucide-react';
import React from 'react';

export type CourseLevel =
  | 'STARTER'
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | string;

export interface CourseLevelMeta {
  key: CourseLevel;
  /** Short label shown in UI (localized string is recommended) */
  label: string;
  /** Tailwind classes for background */
  bgClass: string;
  /** Tailwind classes for text */
  textClass?: string;
  /** Icon component from lucide-react or custom icon */
  Icon: React.ElementType;
  /** Numeric difficulty or ordering */
  difficulty: number;
  /** Short description to explain the level */
  description: string;
}

// Design mapping for course levels. Adjust colors/labels/descriptions as needed.
export const COURSE_LEVELS: Record<string, CourseLevelMeta> = {
  STARTER: {
    key: 'STARTER',
    label: 'Cơ bản',
    bgClass: 'bg-green-50',
    textClass: 'text-green-800',
    Icon: Star,
    difficulty: 1,
    description: 'Giới thiệu cơ bản, phù hợp cho người mới bắt đầu.',
  },
  BEGINNER: {
    key: 'BEGINNER',
    label: 'Sơ cấp',
    bgClass: 'bg-emerald-100',
    textClass: 'text-emerald-900',
    Icon: Star,
    difficulty: 2,
    description: 'Kiến thức nền tảng, dành cho người đã có chút kinh nghiệm.',
  },
  INTERMEDIATE: {
    key: 'INTERMEDIATE',
    label: 'Trung cấp',
    bgClass: 'bg-yellow-100',
    textClass: 'text-yellow-900',
    Icon: Zap,
    difficulty: 3,
    description: 'Nâng cao, bao gồm các kỹ thuật/khái niệm quan trọng.',
  },
  ADVANCED: {
    key: 'ADVANCED',
    label: 'Nâng cao',
    bgClass: 'bg-rose-100',
    textClass: 'text-rose-900',
    Icon: Award,
    difficulty: 4,
    description: 'Chuyên sâu, dành cho người có nền tảng vững chắc.',
  },
};

export const DEFAULT_LEVEL: CourseLevelMeta = {
  key: 'UNKNOWN',
  label: 'N/A',
  bgClass: 'bg-gray-100',
  textClass: 'text-gray-700',
  Icon: Circle,
  difficulty: 0,
  description: 'Không xác định',
};

export function getCourseLevelMeta(level?: string): CourseLevelMeta {
  if (!level) return DEFAULT_LEVEL;
  const key = String(level).toUpperCase();
  return (
    COURSE_LEVELS[key] ?? {
      ...DEFAULT_LEVEL,
      key: level,
      label: level,
    }
  );
}

export const CourseLevelBadge: React.FC<{
  level?: string;
  className?: string;
}> = ({ level, className = '' }) => {
  const meta = getCourseLevelMeta(level);
  const Icon = meta.Icon;

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1 text-[14px] ${meta.bgClass} ${meta.textClass} ${className}`}
      title={meta.description}
    >
      <Icon className="h-3.5 w-3.5 opacity-90" />
      <span>{meta.label}</span>
    </div>
  );
};

export default CourseLevelBadge;
