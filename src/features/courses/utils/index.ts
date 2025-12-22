import type { CourseLevel } from '../types';

export const getLevelColor = (level?: CourseLevel | string) => {
  switch (level) {
    case 'STARTER':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'INTERMEDIATE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'ADVANCED':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getLevelText = (level?: CourseLevel | string) => {
  switch (level) {
    case 'STARTER':
      return 'Cơ bản';
    case 'INTERMEDIATE':
      return 'Trung cấp';
    case 'ADVANCED':
      return 'Nâng cao';
    default:
      return 'Chưa xác định';
  }
};

export const formatDuration = (minutes?: number) => {
  if (!minutes) return '0h';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
};

export const formatDurationVietnamese = (minutes?: number) => {
  if (!minutes) return '0 giờ';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) {
    return `${h} giờ ${m} phút`;
  } else if (h > 0) {
    return `${h} giờ`;
  } else {
    return `${m} phút`;
  }
};
