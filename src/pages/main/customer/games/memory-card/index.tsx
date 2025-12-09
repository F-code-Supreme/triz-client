import MemoryMatchGame from '@/components/ui/memory-match-game';
import { DefaultLayout } from '@/layouts/default-layout';

const MemoryCardPage = () => {
  return (
    <DefaultLayout meta={{ title: 'Ghi Nhớ Thẻ Bài' }}>
      <div>
        <div className="grid grid-cols-4 items-center gap-7 ">
          <div className="col-span-3">
            <MemoryMatchGame />
          </div>
          <div className="col-span-1">
            <div className="bg-white"></div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default MemoryCardPage;
