import { CheckCircle, XCircle, Slash, Clock, Circle } from 'lucide-react';
import React from 'react';

export type CourseStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'DRAFT'
  | 'ARCHIVED'
  | string;

export interface CourseStatusMeta {
  key: CourseStatus;
  label: string;
  bgClass: string;
  textClass?: string;
  Icon: React.ElementType;
  description: string;
}

export const COURSE_STATUSES: Record<string, CourseStatusMeta> = {
  ACTIVE: {
    key: 'ACTIVE',
    label: 'Kích hoạt',
    bgClass: 'bg-green-500',
    textClass: 'text-white',
    Icon: CheckCircle,
    description: 'Kích hoạt',
  },
  INACTIVE: {
    key: 'INACTIVE',
    label: 'Chưa kích hoạt',
    bgClass: 'bg-gray-300',
    textClass: 'text-gray-800',
    Icon: Slash,
    description: 'Chưa kích hoạt',
  },
  DRAFT: {
    key: 'DRAFT',
    label: 'Bản nháp',
    bgClass: 'bg-yellow-400',
    textClass: 'text-black',
    Icon: Clock,
    description: 'Bản nháp',
  },
  ARCHIVED: {
    key: 'ARCHIVED',
    label: 'Đã lưu trữ',
    bgClass: 'bg-rose-500',
    textClass: 'text-white',
    Icon: XCircle,
    description: 'Đã lưu trữ',
  },
};

export const DEFAULT_STATUS: CourseStatusMeta = {
  key: 'UNKNOWN',
  label: 'N/A',
  bgClass: 'bg-gray-100',
  textClass: 'text-gray-700',
  Icon: Circle,
  description: 'Không xác định',
};

export function getCourseStatusMeta(status?: string): CourseStatusMeta {
  if (!status) return DEFAULT_STATUS;
  const key = String(status).toUpperCase();
  return (
    COURSE_STATUSES[key] ?? { ...DEFAULT_STATUS, key: status, label: status }
  );
}

export const CourseStatusBadge: React.FC<{
  status?: string;
  className?: string;
}> = ({ status, className = '' }) => {
  const meta = getCourseStatusMeta(status);
  const Icon = meta.Icon;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-[14px] font-semibold ${meta.bgClass} ${meta.textClass} ${className}`}
      title={meta.description}
    >
      <Icon className="h-3.5 w-3.5 opacity-90" />
      <span>{meta.label}</span>
    </div>
  );
};

export default CourseStatusBadge;
