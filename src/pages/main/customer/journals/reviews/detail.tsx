import { useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { ArrowLeft, MessageSquare, Star, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import useAuth from '@/features/auth/hooks/use-auth';
import { useGetReviewByIdQuery } from '@/features/journal-review/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';
import { Route } from '@/routes/(app)/journals/$journalId/reviews/$reviewId/route';

const DATE_FORMAT = 'dd/MM/yyyy HH:mm';

const JournalReviewDetailsPage = () => {
  const { journalId, reviewId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: review, isLoading } = useGetReviewByIdQuery(user?.id, reviewId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge variant="default" className="bg-green-600">
            Đã phê duyệt
          </Badge>
        );
      case 'REVIEWED':
        return (
          <Badge variant="secondary" className="bg-blue-600">
            Đã đánh giá
          </Badge>
        );
      case 'PROCESSING':
        return (
          <Badge variant="secondary" className="bg-yellow-600">
            Đang xử lý
          </Badge>
        );
      case 'PENDING':
        return <Badge variant="outline">Chờ xử lý</Badge>;
      case 'COMMENTED':
        return <Badge variant="secondary">Đã nhận xét</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DefaultLayout meta={{ title: 'Đang tải...' }}>
        <div className="py-8 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DefaultLayout>
    );
  }

  if (!review) {
    return (
      <DefaultLayout meta={{ title: 'Không tìm thấy' }}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <MessageSquare className="h-16 w-16 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-bold">Không tìm thấy đánh giá</h2>
          <p className="text-muted-foreground">
            Đánh giá này không tồn tại hoặc đã bị xóa.
          </p>
          <Button
            onClick={() =>
              navigate({
                to: '/journals/$journalId/reviews',
                params: { journalId },
              })
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout meta={{ title: 'Chi tiết đánh giá' }}>
      <div className="py-8 space-y-6">
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() =>
              navigate({
                to: '/journals/$journalId/reviews',
                params: { journalId },
              })
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách đánh giá
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <MessageSquare className="h-8 w-8" />
                Chi tiết đánh giá
              </h1>
              <p className="text-muted-foreground mt-2">
                Xem chi tiết đánh giá từ chuyên gia
              </p>
            </div>
            {review && getStatusBadge(review.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reviewer Info Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Người đánh giá</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={review.creatorAvatarUrl || ''} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.creatorFullName}</p>
                    <p className="text-sm text-muted-foreground">Chuyên gia</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ngày tạo</p>
                    <p className="font-medium">
                      {format(new Date(review.createdAt), DATE_FORMAT)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cập nhật lần cuối</p>
                    <p className="font-medium">
                      {format(new Date(review.updatedAt), DATE_FORMAT)}
                    </p>
                  </div>
                  {review.averageRating && (
                    <div>
                      <p className="text-muted-foreground">
                        Đánh giá trung bình
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-2xl font-bold">
                          {review.averageRating.toFixed(1)}
                        </span>
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Nội dung đánh giá</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{review.content}</p>
                </div>
              </CardContent>
            </Card>

            {/* Child Reviews / Replies */}
            {review.childReviews && review.childReviews.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Phản hồi ({review.childReviews.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {review.childReviews.map(
                      (
                        childReview: {
                          id: string;
                          creatorAvatarUrl: string | null;
                          creatorFullName: string;
                          content: string;
                          createdAt: string;
                          rating: number | null;
                        },
                        index: number,
                      ) => (
                        <div key={index} className="border-l-2 pl-4 py-2">
                          <div className="flex items-start gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={childReview.creatorAvatarUrl || ''}
                              />
                              <AvatarFallback>
                                {childReview.creatorFullName
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">
                                  {childReview.creatorFullName}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {format(
                                    new Date(childReview.createdAt),
                                    DATE_FORMAT,
                                  )}
                                </span>
                              </div>
                              <p className="text-sm mt-1 whitespace-pre-wrap">
                                {childReview.content}
                              </p>
                              {childReview.rating && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                  <span className="text-sm font-medium">
                                    {childReview.rating}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default JournalReviewDetailsPage;
