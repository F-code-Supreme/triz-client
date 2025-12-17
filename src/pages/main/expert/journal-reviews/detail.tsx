import { useParams } from '@tanstack/react-router';

import { ExpertLayout } from '@/layouts/expert-layout';

const ExpertJournalReviewDetailPage = () => {
  const { journalReviewId } = useParams({
    from: '/expert/journal-reviews/$journalReviewId',
  });

  return (
    <ExpertLayout meta={{ title: 'Chi tiết Đánh giá Nhật ký' }}>
      <div className="flex flex-col gap-8 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Chi tiết Đánh giá Nhật ký
          </h1>
          <p className="text-muted-foreground mt-2">ID: {journalReviewId}</p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="text-muted-foreground">
            Trang chi tiết sẽ được triển khai sau...
          </p>
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertJournalReviewDetailPage;
