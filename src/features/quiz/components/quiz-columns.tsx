import { format } from 'date-fns';
import { MoreHorizontal, Eye, Trash2, Edit } from 'lucide-react';

// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { ColumnDef } from '@tanstack/react-table';
import type { TFunction } from 'i18next';

export type Quiz = {
  id: string;
  title: string;
  description: string;
  imageSource: string | null;
  durationInMinutes: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  questions: Array<{
    id: string;
    content: string;
    questionType: string;
    createdAt: string;
    updatedAt: string;
    quizId: string;
    options: Array<{
      id: string;
      content: string;
      isCorrect: boolean;
      createdAt: string;
      updatedAt: string;
      questionId: string;
    }>;
  }>;
};

interface QuizColumnsProps {
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
  onViewDetail?: (quiz: Quiz) => void;
  t: TFunction<'pages.admin'>;
}

export const createQuizColumns = ({
  onEdit,
  onDelete,
  onViewDetail,
  t,
}: QuizColumnsProps): ColumnDef<Quiz>[] => [
  // {
  //   accessorKey: 'imageSource',
  //   header: 'Image',
  //   cell: ({ row }) => {
  //     const imageSource = row.getValue('imageSource') as string | null;
  //     return (
  //       <Avatar className="h-10 w-10">
  //         <AvatarImage
  //           src={imageSource || undefined}
  //           alt={row.original.title}
  //         />
  //         <AvatarFallback>
  //           {row.original.title.slice(0, 2).toUpperCase()}
  //         </AvatarFallback>
  //       </Avatar>
  //     );
  //   },
  //   enableSorting: false,
  // },
  {
    accessorKey: 'title',
    header: () => t('quizzes.columns.title'),
    cell: ({ row }) => {
      const title = row.getValue('title') as string;
      return (
        <div className="max-w-[200px]">
          <div className="font-medium">{title}</div>
          {/* <div className="text-sm text-muted-foreground line-clamp-2">
            {row.original.description}
          </div> */}
        </div>
      );
    },
  },
  {
    accessorKey: 'questions',
    header: () => t('quizzes.columns.questions'),
    cell: ({ row }) => {
      const questions = row.getValue('questions') as Quiz['questions'];
      const count = questions.length;
      return (
        <Badge variant="secondary">
          {t(
            count === 1
              ? 'quizzes.columns.question_count'
              : 'quizzes.columns.question_count_plural',
            { count },
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'durationInMinutes',
    header: () => t('quizzes.columns.duration'),
    cell: ({ row }) => {
      const duration = row.getValue('durationInMinutes') as number | null;
      return duration ? (
        <Badge variant="outline">
          {t('quizzes.columns.duration_minutes', { count: duration })}
        </Badge>
      ) : (
        <span className="text-muted-foreground">
          {t('quizzes.columns.no_limit')}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => t('quizzes.columns.created'),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return (
        <div className="text-sm">
          {format(date, 'MMM dd, yyyy')}
          <div className="text-muted-foreground">{format(date, 'HH:mm')}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: () => t('quizzes.columns.updated'),
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      return (
        <div className="text-sm">
          {format(date, 'MMM dd, yyyy')}
          <div className="text-muted-foreground">{format(date, 'HH:mm')}</div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const quiz = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {t('quizzes.columns.actions')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onViewDetail && (
              <DropdownMenuItem onClick={() => onViewDetail(quiz)}>
                <Eye className="mr-2 h-4 w-4" />
                {t('quizzes.actions.view_details')}
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(quiz)}>
                <Edit className="mr-2 h-4 w-4" />
                {t('quizzes.actions.edit_quiz')}
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(quiz)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('quizzes.actions.delete_quiz')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
