import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  useGetReportByIdQuery,
  useReviewPostReportMutation,
} from '@/features/report/services/queries';
import { ReportStatus } from '@/features/report/types';
import { formatDateHour } from '@/utils/date/date';

interface ReviewPostReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

const ReviewPostReport = ({
  open,
  onOpenChange,
  reportId,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: ReviewPostReportDialogProps) => {
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [status, setStatus] = useState<ReportStatus | ''>(
    ReportStatus.RESOLVED,
  );
  const [reviewNote, setReviewNote] = useState('');

  const { data: reportResponse, isLoading } = useGetReportByIdQuery(reportId);
  const reviewMutation = useReviewPostReportMutation();

  const reports = reportResponse?.content || [];
  const selectedReport = reports.find((r) => r.id === selectedReportId);

  useEffect(() => {
    if (reports.length > 0 && !selectedReportId) {
      setSelectedReportId(reports[0].id);
    }
  }, [reports, selectedReportId]);

  useEffect(() => {
    if (selectedReport) {
      setStatus(
        (selectedReport.status as ReportStatus) || ReportStatus.RESOLVED,
      );
      setReviewNote(selectedReport.reviewNote || '');
    } else {
      setStatus(ReportStatus.RESOLVED);
    }
  }, [selectedReport, open]);

  const handleSubmit = () => {
    if (!selectedReportId) {
      toast.error('Vui lòng chọn một báo cáo để đánh giá');
      return;
    }

    if (
      !status ||
      status === ReportStatus.PENDING ||
      status === ReportStatus.IN_REVIEW
    ) {
      toast.error(
        'Vui lòng chọn trạng thái đánh giá (Đã giải quyết, Bị từ chối, hoặc Bị hủy)',
      );
      return;
    }

    if (!reviewNote.trim()) {
      toast.error('Vui lòng nhập ghi chú đánh giá');
      return;
    }

    reviewMutation.mutate(
      {
        reportId: selectedReportId,
        status,
        reviewNote: reviewNote.trim(),
      },
      {
        onSuccess: () => {
          toast.success('Đánh giá báo cáo thành công');
          onOpenChange(false);
          setSelectedReportId('');
          setStatus('');
          setReviewNote('');
        },
        onError: (error: unknown) => {
          toast.error(
            error instanceof Error ? error.message : 'Không thể gửi đánh giá',
          );
        },
      },
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!reviewMutation.isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setSelectedReportId('');
        setStatus(ReportStatus.RESOLVED);
        setReviewNote('');
      }
    }
  };

  const getStatusBadgeClass = (reportStatus: string) => {
    switch (reportStatus) {
      case ReportStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case ReportStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case ReportStatus.DISMISSED:
        return 'bg-gray-100 text-gray-800';
      case ReportStatus.IN_REVIEW:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getReasonLabel = (reason: string) => {
    const reasonMap: Record<string, string> = {
      OTHER: 'Khác',
      ADULT_CONTENT: 'Nội dung người lớn',
      HARASSMENT: 'Quấy rối',
      HATE_SPEECH: 'Lời nói thù hận',
      SPAM: 'Spam',
      VIOLENCE: 'Bạo lực',
      COPYRIGHT_VIOLATION: 'Vi phạm bản quyền',
      INAPPROPRIATE_CONTENT: 'Nội dung không phù hợp',
      FALSE_INFORMATION: 'Thông tin sai lệch',
    };
    return reasonMap[reason] || reason;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Đánh giá báo cáo bài đăng</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-2/3 rounded-lg mb-2" />
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>

              <div className="md:col-span-2 space-y-6">
                <Skeleton className="h-7 w-1/3 rounded mb-3" />
                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <Skeleton className="h-5 w-1/4 rounded" />
                  <Skeleton className="h-5 w-1/3 rounded" />
                  <Skeleton className="h-5 w-1/5 rounded" />
                  <Skeleton className="h-5 w-1/6 rounded" />
                </div>
                <div>
                  <Skeleton className="h-5 w-1/4 rounded mb-2" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-5 w-1/4 rounded mb-2" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cột trái: Danh sách báo cáo */}
            <div className="md:col-span-1 space-y-3">
              <h3 className="font-semibold text-sm">
                Danh sách báo cáo ({reports.length})
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedReportId === report.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          {report.reporterName}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadgeClass(
                            report.status,
                          )}`}
                        >
                          {report.status === ReportStatus.RESOLVED
                            ? 'Đã giải quyết'
                            : report.status === ReportStatus.REJECTED
                              ? 'Bị từ chối'
                              : report.status === ReportStatus.DISMISSED
                                ? 'Bị hủy'
                                : report.status === ReportStatus.IN_REVIEW
                                  ? 'Đang xem xét'
                                  : 'Chờ xử lý'}
                        </span>
                      </div>
                      <p className="text-sm font-medium">
                        {getReasonLabel(report.reason)}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {report.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString(
                          'vi-VN',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          },
                        )}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cột phải: Chi tiết báo cáo được chọn */}
            <div className="md:col-span-2">
              {selectedReport ? (
                <div className="space-y-6 max-h-[500px] overflow-y-auto">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3 text-base">
                      Chi tiết báo cáo
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-muted-foreground">
                          Người báo cáo:
                        </span>
                        <span className="col-span-2">
                          {selectedReport.reporterName}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-muted-foreground">
                          Lý do:
                        </span>
                        <span className="col-span-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-slate-200 text-slate-800 font-medium">
                            {getReasonLabel(selectedReport.reason)}
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-muted-foreground">
                          Trạng thái:
                        </span>
                        <span className="col-span-2">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeClass(
                              selectedReport.status,
                            )}`}
                          >
                            {selectedReport.status === ReportStatus.RESOLVED
                              ? 'Đã giải quyết'
                              : selectedReport.status === ReportStatus.REJECTED
                                ? 'Bị từ chối'
                                : selectedReport.status ===
                                    ReportStatus.DISMISSED
                                  ? 'Bị hủy'
                                  : selectedReport.status ===
                                      ReportStatus.IN_REVIEW
                                    ? 'Đang xem xét'
                                    : 'Chờ xử lý'}
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="font-medium text-muted-foreground">
                          Ngày tạo:
                        </span>
                        <span className="col-span-2">
                          {formatDateHour(new Date(selectedReport.createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                      Mô tả chi tiết
                    </h3>
                    <div className="border rounded-lg p-4 bg-white text-sm leading-relaxed">
                      {selectedReport.description || 'Không có mô tả'}
                    </div>
                  </div>

                  {selectedReport.reviewNote && (
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold mb-2 text-sm text-blue-700">
                        Ghi chú đánh giá trước đó
                      </h3>
                      <div className="border rounded-lg p-4 bg-blue-50/50 text-sm leading-relaxed">
                        {selectedReport.reviewNote}
                      </div>
                      {selectedReport.reviewedByName && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Đánh giá bởi:{' '}
                          <span className="font-medium">
                            {selectedReport.reviewedByName}
                          </span>
                          {selectedReport.reviewedAt &&
                            ` - ${new Date(selectedReport.reviewedAt).toLocaleDateString('vi-VN')}`}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-4 pt-4 border-t-2">
                    <div className="flex items-center gap-4 mb-4">
                      <Label className="text-base font-semibold">
                        Đánh giá
                      </Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className=" justify-between"
                          >
                            {status === ReportStatus.RESOLVED ? (
                              <span className="flex items-center gap-2">
                                {/* <CheckCircle className="h-5 w-5 text-green-600" /> */}
                                <span>Đã giải quyết</span>
                              </span>
                            ) : status === ReportStatus.REJECTED ? (
                              <span className="flex items-center gap-2">
                                {/* <ShieldAlert className="h-5 w-5 text-red-600" /> */}
                                <span>Bị từ chối</span>
                              </span>
                            ) : (
                              <span>Chọn trạng thái...</span>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem
                            onSelect={() => setStatus(ReportStatus.RESOLVED)}
                            className="flex items-center gap-2"
                          >
                            {/* <CheckCircle className="h-5 w-5 text-green-600" /> */}
                            <div>
                              <div className="font-medium">Đã giải quyết</div>
                              <div className="text-xs text-muted-foreground">
                                Report hợp lệ, đã xử lý
                              </div>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => setStatus(ReportStatus.REJECTED)}
                            className="flex items-center gap-2"
                          >
                            {/* <ShieldAlert className="h-5 w-5 text-red-600" /> */}
                            <div>
                              <div className="font-medium">Từ chối</div>
                              <div className="text-xs text-muted-foreground">
                                Report không hợp lệ
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div>
                      <Label
                        htmlFor="reviewNote"
                        className="text-base font-semibold"
                      >
                        Ghi chú đánh giá <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="reviewNote"
                        placeholder="Nhập ghi chú đánh giá về báo cáo này..."
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        rows={4}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 text-muted-foreground">
                  Chọn một báo cáo để xem chi tiết
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">Không tìm thấy báo cáo</p>
              <p className="text-sm text-muted-foreground mt-1">
                Bài viết này chưa có báo cáo nào
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={reviewMutation.isPending}
          >
            Đóng
          </Button>
          {selectedReport && (
            <Button
              onClick={handleSubmit}
              disabled={
                reviewMutation.isPending ||
                isLoading ||
                !!selectedReport.reviewNote
              }
              className="min-w-[120px]"
            >
              {reviewMutation.isPending
                ? 'Đang gửi...'
                : selectedReport.reviewNote
                  ? 'Đã đánh giá'
                  : 'Gửi đánh giá'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewPostReport;
