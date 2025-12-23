import { ExpertJournalReviewsTable } from '@/features/journal-review/components/expert-journal-reviews-table';
import { ExpertLayout } from '@/layouts/expert-layout';

const ExpertJournalReviewsPage = () => {
  return (
    <ExpertLayout meta={{ title: 'Quản lý Đánh giá Nhật ký' }}>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Quản lý Đánh giá Nhật ký
            </h1>
            <p className="text-muted-foreground mt-2">
              Xem xét và đánh giá các yêu cầu đánh giá nhật ký 6 bước từ người
              dùng
            </p>
          </div>
        </div>

        <ExpertJournalReviewsTable />
      </div>
    </ExpertLayout>
  );
};

export default ExpertJournalReviewsPage;
