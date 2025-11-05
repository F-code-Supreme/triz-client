import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  RotateCcw,
  Search,
  BookOpen,
  Target,
  Eye,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuizLayout } from '@/layouts/quiz-layout';
import { useGetUserQuizAttemptsQuery } from '@/features/quiz/service/mutations';
import useAuth from '@/features/auth/hooks/use-auth';
import type { QuizAttempt } from '@/features/quiz/service/mutations/type';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} phút`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const getScoreColor = (score: number, passed: boolean) => {
  if (!passed) return 'text-red-600';
  if (score >= 80) return 'text-green-600';
  return 'text-yellow-600';
};

const getScoreBadgeVariant = (score: number, passed: boolean) => {
  if (!passed) return 'destructive';
  if (score >= 80) return 'default';
  return 'outline';
};

const HistoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const statusFilter = 'all';
  const [sortBy, setSortBy] = useState('recent');
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(
    null,
  );

  const { user } = useAuth();
  const { data, isLoading } = useGetUserQuizAttemptsQuery(user?.id || '');

  const displayAttempts: QuizAttempt[] = React.useMemo(() => {
    if (data && Array.isArray(data?.content)) {
      return data?.content as QuizAttempt[];
    }
    return [];
  }, [data]);

  const filteredAttempts = displayAttempts
    .filter((attempt: QuizAttempt) => {
      const matchesSearch =
        attempt.quizId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      const passed = (attempt.score || 0) >= 70;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'passed' && passed) ||
        (statusFilter === 'failed' && !passed);
      return matchesSearch && matchesStatus;
    })
    .sort((a: QuizAttempt, b: QuizAttempt) => {
      switch (sortBy) {
        case 'recent':
          return (
            new Date(b.startTime || '').getTime() -
            new Date(a.startTime || '').getTime()
          );
        case 'score-high':
          return (b.score || 0) - (a.score || 0);
        case 'score-low':
          return (a.score || 0) - (b.score || 0);
        default:
          return 0;
      }
    });

  const totalAttempts = displayAttempts.length;

  if (isLoading) {
    return (
      <QuizLayout meta={{ title: 'Lịch sử Quiz' }} showheader={true}>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          <div className="text-slate-600">Đang tải dữ liệu...</div>
        </div>
      </QuizLayout>
    );
  }

  return (
    <QuizLayout meta={{ title: 'Lịch sử Quiz' }} showheader={true}>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Lịch sử Quiz
              </h1>
              <p className="text-slate-600 mt-1">
                Theo dõi tiến độ học tập và kết quả làm bài của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <Card className="border shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Tổng bài làm
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalAttempts}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="shadow-md border-slate-200">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm quiz..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mới nhất</SelectItem>
                  <SelectItem value="score-high">Điểm cao nhất</SelectItem>
                  <SelectItem value="score-low">Điểm thấp nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Attempts List */}
        <div className="space-y-4">
          {filteredAttempts.length === 0 ? (
            <Card className="shadow-md border-slate-200">
              <CardContent className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                  <Target className="h-12 w-12 opacity-50 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  {searchTerm
                    ? 'Không tìm thấy kết quả'
                    : 'Chưa có lịch sử quiz'}
                </h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm các quiz khác'
                    : 'Bắt đầu làm quiz đầu tiên để xem lịch sử và theo dõi tiến độ học tập'}
                </p>
                {!searchTerm && (
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Khám phá Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAttempts.map((attempt: QuizAttempt) => {
              const passed = (attempt.score || 0) >= 70;
              const duration =
                attempt.startTime && attempt.completedAt
                  ? Math.round(
                      (new Date(attempt.completedAt).getTime() -
                        new Date(attempt.startTime).getTime()) /
                        (1000 * 60),
                    )
                  : 0;

              return (
                <Card
                  key={attempt.id}
                  className="shadow-md border-slate-200 hover:shadow-lg transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* Quiz Info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900">
                              Quiz ID: {attempt.quizId}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatDate(attempt.startTime || '')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {duration > 0
                                    ? formatDuration(duration)
                                    : '--'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Results */}
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div
                            className={`text-2xl font-bold ${getScoreColor(attempt.score || 0, passed)}`}
                          >
                            {attempt.score || 0}%
                          </div>
                        </div>

                        <Badge
                          variant={getScoreBadgeVariant(
                            attempt.score || 0,
                            passed,
                          )}
                        >
                          {passed ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                          )}
                          {passed ? 'Đạt' : 'Chưa đạt'}
                        </Badge>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedAttempt(attempt)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Chi tiết
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh]">
                              <DialogHeader>
                                <DialogTitle>Chi tiết kết quả Quiz</DialogTitle>
                                <DialogDescription>
                                  Xem kết quả chi tiết và các câu trả lời của
                                  bạn
                                </DialogDescription>
                              </DialogHeader>
                              {selectedAttempt && (
                                <ScrollArea className="h-full max-h-[60vh]">
                                  <div className="space-y-6">
                                    {/* Quiz Summary */}
                                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                      <h3 className="font-semibold text-lg mb-2 text-slate-900">
                                        Quiz ID: {selectedAttempt.quizId}
                                      </h3>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="text-center">
                                          <div
                                            className={`text-2xl font-bold ${getScoreColor(selectedAttempt.score || 0, (selectedAttempt.score || 0) >= 70)}`}
                                          >
                                            {selectedAttempt.score || 0}%
                                          </div>
                                          <div className="text-xs text-slate-500">
                                            Điểm số
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-slate-900">
                                            {formatDate(
                                              selectedAttempt.startTime || '',
                                            )}
                                          </div>
                                          <div className="text-xs text-slate-500">
                                            Thời gian làm
                                          </div>
                                        </div>
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-slate-900">
                                            {selectedAttempt.startTime &&
                                            selectedAttempt.completedAt
                                              ? formatDuration(
                                                  Math.round(
                                                    (new Date(
                                                      selectedAttempt.completedAt,
                                                    ).getTime() -
                                                      new Date(
                                                        selectedAttempt.startTime,
                                                      ).getTime()) /
                                                      (1000 * 60),
                                                  ),
                                                )
                                              : '--'}
                                          </div>
                                          <div className="text-xs text-slate-500">
                                            Thời gian
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Answers Details */}
                                    <div>
                                      <h4 className="font-semibold mb-4 text-slate-900">
                                        Chi tiết câu trả lời
                                      </h4>
                                      {selectedAttempt.answers &&
                                      selectedAttempt.answers.length > 0 ? (
                                        <div className="space-y-4">
                                          {selectedAttempt.answers.map(
                                            (answer, index) => (
                                              <Card
                                                key={answer.id}
                                                className="p-4 border-slate-200"
                                              >
                                                <div className="flex items-start gap-3">
                                                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-medium text-blue-700">
                                                      {index + 1}
                                                    </span>
                                                  </div>
                                                  <div className="flex-1">
                                                    <p className="font-medium mb-2 text-slate-900">
                                                      Câu hỏi {index + 1}
                                                    </p>
                                                    <p className="text-sm text-slate-500 mb-2">
                                                      ID câu hỏi:{' '}
                                                      {answer.questionId}
                                                    </p>
                                                    <p className="text-sm text-slate-600">
                                                      <span className="font-medium">
                                                        Câu trả lời đã chọn:
                                                      </span>{' '}
                                                      {answer.optionId}
                                                    </p>
                                                  </div>
                                                </div>
                                              </Card>
                                            ),
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-center py-8">
                                          <Target className="w-16 h-16 mx-auto mb-4 opacity-50 text-slate-400" />
                                          <p className="text-slate-600">
                                            Không có dữ liệu câu trả lời chi
                                            tiết
                                          </p>
                                          <p className="text-sm text-slate-500">
                                            Thông tin chi tiết sẽ được hiển thị
                                            cho các bài quiz mới
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </ScrollArea>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Làm lại
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </QuizLayout>
  );
};

export default HistoryPage;
