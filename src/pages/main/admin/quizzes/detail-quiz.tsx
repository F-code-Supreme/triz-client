import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quiz Details</DialogTitle>
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
                  Duration: {selectedQuizData.durationInMinutes} minutes
                </p>
              </div>
              <div className="w-full h-32 bg-muted flex items-center justify-center rounded text-muted-foreground">
                Quiz Image
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">
                Questions ({selectedQuizData.questions?.length || 0})
              </h4>
              {selectedQuizData.questions?.map((question: any, idx: number) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="font-medium mb-2">
                    Question {idx + 1}: {question.content}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Type: {question.questionType.replace('_', ' ')}
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
                            ✓ Correct
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
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailQuizDialog;
