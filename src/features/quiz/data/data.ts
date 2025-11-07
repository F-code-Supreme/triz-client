import {
  CheckCircledIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';

export const quizStatuses = [
  {
    value: 'active',
    label: 'Active',
    icon: CheckCircledIcon,
  },
  {
    value: 'draft',
    label: 'Draft',
    icon: QuestionMarkCircledIcon,
  },
  {
    value: 'inactive',
    label: 'Inactive',
    icon: CrossCircledIcon,
  },
  {
    value: 'scheduled',
    label: 'Scheduled',
    icon: StopwatchIcon,
  },
];

export const quizDifficulties = [
  {
    value: 'easy',
    label: 'Easy',
  },
  {
    value: 'medium',
    label: 'Medium',
  },
  {
    value: 'hard',
    label: 'Hard',
  },
];

export const questionTypes = [
  {
    value: 'SINGLE_CHOICE',
    label: 'Single Choice',
  },
  {
    value: 'MULTIPLE_CHOICE',
    label: 'Multiple Choice',
  },
];
