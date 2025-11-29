import { format } from 'date-fns';
import { MoreHorizontal, Eye, Trash2, Edit } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
}

export const createQuizColumns = ({
  onEdit,
  onDelete,
  onViewDetail,
}: QuizColumnsProps = {}): ColumnDef<Quiz>[] => [
  {
    accessorKey: 'imageSource',
    header: 'Image',
    cell: ({ row }) => {
      const imageSource = row.getValue('imageSource') as string | null;
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={imageSource || undefined}
            alt={row.original.title}
          />
          <AvatarFallback>
            {row.original.title.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'title',
    header: 'Title',
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
    header: 'Questions',
    cell: ({ row }) => {
      const questions = row.getValue('questions') as Quiz['questions'];
      return (
        <Badge variant="secondary">
          {questions.length} question{questions.length !== 1 ? 's' : ''}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'durationInMinutes',
    header: 'Duration',
    cell: ({ row }) => {
      const duration = row.getValue('durationInMinutes') as number | null;
      return duration ? (
        <Badge variant="outline">{duration} min</Badge>
      ) : (
        <span className="text-muted-foreground">No limit</span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
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
    header: 'Updated',
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {onViewDetail && (
              <DropdownMenuItem onClick={() => onViewDetail(quiz)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(quiz)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit quiz
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(quiz)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete quiz
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const quizColumns = createQuizColumns();
