import { QuizCreateDialog } from './quiz-create-dialog';
import { QuizEditDialog } from './quiz-edit-dialog';

interface QuizFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz?: any;
  quizId?: string;
  onSuccess?: () => void;
}

export function QuizFormDialog({
  open,
  onOpenChange,
  quiz,
  quizId,
  onSuccess,
}: QuizFormDialogProps) {
  const isEdit = !!quiz || !!quizId;
  const editQuizId = quizId || quiz?.id;

  if (isEdit && editQuizId) {
    return (
      <QuizEditDialog
        open={open}
        onOpenChange={onOpenChange}
        quizId={editQuizId}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <QuizCreateDialog
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}
