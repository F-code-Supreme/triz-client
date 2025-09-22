import type { Formatter } from 'i18next';

export const upperCaseFormatter: Parameters<Formatter['add']>[1] = (value) => {
  return value.toUpperCase();
};
