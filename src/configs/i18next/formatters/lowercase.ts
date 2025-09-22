import type { Formatter } from 'i18next';

export const lowerCaseFormatter: Parameters<Formatter['add']>[1] = (value) => {
  return value.toLowerCase();
};
