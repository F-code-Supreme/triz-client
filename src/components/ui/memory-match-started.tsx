import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

const MemoryMatchStarted = ({ startGame }: { startGame: () => void }) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center">
      <div className=" flex flex-col gap-4">
        <div>
          <button
            className="flex items-center text-gray-500 hover:text-gray-800 font-bold transition-colors"
            onClick={() => navigate({ to: '/games' })}
          >
            <ArrowLeft className="mr-2" size={24} /> Quay lại
          </button>
        </div>
        <div className=" items-center justify-center ">
          <div className="max-w-2xl w-full">
            <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center">
              <div className="mb-5">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Ghi nhớ thẻ bài
                </h1>
                <p className="text-md text-gray-600">
                  Thử thách trí nhớ của bạn với trò chơi ghi nhớ thẻ bài thú
                </p>
              </div>

              <div className="space-y-6 mb-10 text-left max-w-md mx-auto">
                <div>
                  <h3 className="text-2xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                    <span className="text-3xl">🎯</span> Cách chơi
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span>1.</span>
                      <span>Nhấn vào các thẻ để lật chúng</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span>2.</span>
                      <span>Tìm các cặp thẻ giống nhau</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span>3.</span>
                      <span>
                        Hoàn thành tất cả các cặp để kết thúc trò chơi
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span>4.</span>
                      <span>Hoàn thành trò chơi càng nhanh càng tốt!</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold px-12 py-8 text-xl rounded-2xl shadow-lg transform transition hover:scale-105"
              >
                🚀 Bắt đầu trò chơi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatchStarted;
