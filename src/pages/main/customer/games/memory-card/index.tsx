import MemoryMatchGame from '@/components/ui/memory-match-game';
import { DefaultLayout } from '@/layouts/default-layout';

const MemoryCardPage = () => {
  return (
    <DefaultLayout meta={{ title: 'Ghi Nhớ Thẻ Bài' }}>
      <div className="grid grid-cols-4 items-center gap-7">
        <div className="col-span-3">
          <div className="bg-gradient-to-b from-[#2563EB] to-[#1E40AF] py-6 pl-8 text-white text-3xl font-medium rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[8px] rounded-br-[8px]">
            Ghi Nhớ Thẻ Bài
          </div>
          <div className="bg-white p-8">
            <MemoryMatchGame />
          </div>
        </div>
        <div className="col-span-1">
          <div className="bg-white"></div>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default MemoryCardPage;
