import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useGetCourseByIdQuery } from '@/features/courses/services/queries';
import { useGetModulesById } from '@/features/modules/services/queries';

interface DetailQuizDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedQuizData: any;
}

const DetailQuizDialog = ({
  open,
  setOpen,
  selectedQuizData,
}: DetailQuizDialogProps) => {
  const { t } = useTranslation('pages.admin');
  const { data: moduleData } = useGetModulesById(
    selectedQuizData?.moduleId || '',
  );

  const { data: courseData } = useGetCourseByIdQuery(
    moduleData?.courseId || '',
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('quizzes.detail_dialog.title')}</DialogTitle>
        </DialogHeader>
        {selectedQuizData && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedQuizData.title}
                </h3>
                <p className="text-muted-foreground">
                  {selectedQuizData.description}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('quizzes.detail_dialog.duration', {
                    duration: selectedQuizData.durationInMinutes,
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Điểm tối thiểu: {selectedQuizData.passingScore}
                </p>
              </div>
            </div>

            {moduleData && (
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">
                      {t('quizzes.detail_dialog.course')}:{' '}
                      {courseData?.title || t('quizzes.detail_dialog.loading')}
                    </p>
                    {moduleData && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Cấp độ:{' '}
                        {moduleData.level === 'EASY'
                          ? 'Dễ'
                          : moduleData.level === 'MEDIUM'
                            ? 'Trung bình'
                            : 'Khó'}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {t('quizzes.detail_dialog.module')}:{' '}
                      {moduleData?.name || t('quizzes.detail_dialog.loading')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-semibold">
                {t('quizzes.detail_dialog.questions_title', {
                  count: selectedQuizData.questions?.length || 0,
                })}
              </h4>
              {selectedQuizData.questions?.map((question: any, idx: number) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="font-medium mb-2">
                    {t('quizzes.detail_dialog.question_number', {
                      number: idx + 1,
                      content: question.content,
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Loại câu hỏi:{' '}
                    {question.questionType === 'MULTIPLE_CHOICE'
                      ? 'Chọn nhiều đáp án'
                      : 'Chọn một đáp án'}
                  </div>
                  <div className="space-y-1">
                    {question.options?.map((option: any, optIdx: number) => (
                      <div
                        key={option.id}
                        className={`p-2 rounded text-sm ${
                          option.isCorrect
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}. {option.content}
                        {option.isCorrect && (
                          <span className="ml-2 text-green-600 font-medium">
                            {t('quizzes.detail_dialog.correct_answer')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            {t('quizzes.detail_dialog.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailQuizDialog;
