import { useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Bot,
  RefreshCw,
  Trophy,
  Star,
  ArrowRight,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { DefaultLayout } from '@/layouts/default-layout';

const SegmentationGamePage = () => {
  const navigate = useNavigate();
  // State quản lý danh sách các viên gạch
  const [bricks, setBricks] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  // State logic game
  const [targetHeight, setTargetHeight] = useState(12); // Đích có thể thay đổi
  const [isShaking, setIsShaking] = useState(false); // Trạng thái rung
  const [showSuccess, setShowSuccess] = useState(false); // Trạng thái chiến thắng

  const UNIT_HEIGHT = 23.3333;

  // Tính tổng chiều cao hiện tại
  const currentHeight = useMemo(() => {
    return bricks.reduce((acc, curr) => acc + curr, 0);
  }, [bricks]);

  // Xử lý logic khi nhấn thêm gạch
  const handleAddBrick = (value: number) => {
    // Nếu đang thắng thì không cho bấm tiếp
    if (showSuccess) return;

    const newHeight = currentHeight + value;

    if (newHeight > targetHeight) {
      // TRƯỜNG HỢP 1: Vượt quá đích -> Rung lắc
      setIsShaking(true);
      // Tắt rung sau 500ms để có thể rung lại lần sau
      setTimeout(() => setIsShaking(false), 500);
    } else {
      // Thêm gạch bình thường
      setBricks([...bricks, value]);

      // TRƯỜNG HỢP 2: Vừa đúng đích -> Chiến thắng
      if (newHeight === targetHeight) {
        handleWin();
      }
    }
  };

  const handleWin = () => {
    // Cộng điểm
    setScore((prev) => prev + 10);
    // Hiện màn hình chúc mừng
    setShowSuccess(true);
  };

  const handleNextLevel = () => {
    // Reset gạch
    setBricks([]);
    // Ẩn màn hình chiến thắng
    setShowSuccess(false);
    // Random đích mới (từ 8 đến 15) để game thú vị hơn
    const newTarget = Math.floor(Math.random() * (15 - 8 + 1)) + 8;
    setTargetHeight(newTarget);
  };

  const removeTopBrick = () => {
    if (bricks.length > 0 && !showSuccess) {
      setBricks(bricks.slice(0, -1));
    }
  };

  const resetGame = () => {
    setBricks([]);
    setShowSuccess(false);
    setIsShaking(false);
  };

  const getBrickStyle = (value: number) => {
    switch (value) {
      case 1:
        return { height: `${UNIT_HEIGHT}px`, colorClass: 'bg-stone-300' };
      case 2:
        return { height: `${UNIT_HEIGHT * 2}px`, colorClass: 'bg-stone-400' };
      case 3:
        return { height: `${UNIT_HEIGHT * 3}px`, colorClass: 'bg-stone-500' };
      default:
        return { height: `${UNIT_HEIGHT}px`, colorClass: 'bg-stone-300' };
    }
  };

  return (
    <DefaultLayout meta={{ title: 'Trò Chơi Xây Tháp' }} className="">
      <section className="h-[calc(100svh-4rem-1px)] relative sm:overflow-hidden flex flex-col justify-center items-center bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ">
        <div className="w-full max-w-8xl p-4 sm:p-16 mx-auto">
          <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 relative z-10">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <button
                className="flex items-center text-gray-500 hover:text-gray-800 font-bold transition-colors"
                onClick={() => navigate({ to: '/learn-triz' })}
              >
                <ArrowLeft className="mr-2" size={24} /> Quay lại
              </button>
              <div className="bg-yellow-100 px-4 py-2 rounded-lg text-yellow-700 font-bold flex items-center gap-2 transition-all transform hover:scale-105">
                <Trophy size={18} /> Điểm: {score}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-6 border-b-8 border-gray-200 relative">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Xây tháp cao bằng {targetHeight}!
              </h2>

              {/* Game Area Container - THÊM ANIMATE SHAKE Ở ĐÂY */}
              <div
                className={`w-full max-w-lg mx-auto transition-transform ${isShaking ? 'animate-shake' : ''}`}
              >
                <div
                  className="relative bg-gradient-to-b from-sky-300 to-sky-100 border-4 border-gray-400 rounded-t-[100px] rounded-b-xl overflow-hidden shadow-2xl"
                  style={{ height: '400px' }}
                >
                  {/* Clouds */}
                  <div className="absolute top-10 left-10 w-16 h-8 bg-white/50 rounded-full blur-sm animate-pulse"></div>
                  <div className="absolute top-20 right-20 w-24 h-10 bg-white/40 rounded-full blur-md"></div>

                  {/* Target Line */}
                  <div
                    className="absolute w-full flex items-center justify-center transition-all duration-500 z-20"
                    style={{ bottom: `${targetHeight * UNIT_HEIGHT}px` }}
                  >
                    <div className="border-t-4 border-red-500 w-full absolute opacity-50 border-dashed"></div>
                    <div className="bg-red-500 text-white font-bold px-3 py-1 text-sm rounded-full shadow-lg relative z-10 flex items-center gap-1">
                      🚩 Đích: {targetHeight}
                    </div>
                  </div>

                  {/* Current Height Indicator */}
                  <div
                    className="absolute w-full text-center pointer-events-none transition-all duration-300 z-30"
                    style={{ bottom: `${currentHeight * UNIT_HEIGHT}px` }}
                  >
                    <span
                      className={`bg-black/60 text-white backdrop-blur px-2 py-1 rounded-full text-xs font-bold shadow transition-colors duration-300 ${
                        currentHeight === targetHeight
                          ? 'bg-green-600 scale-125'
                          : ''
                      } ${currentHeight > targetHeight ? 'bg-red-600' : ''}`}
                    >
                      {currentHeight}
                    </span>
                  </div>

                  {/* The Tower */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 flex flex-col-reverse transition-all z-10">
                    {bricks.map((val, index) => {
                      const { height, colorClass } = getBrickStyle(val);
                      return (
                        <div
                          key={index}
                          className={`w-full relative flex items-center justify-center text-white font-bold border-x-4 border-t-2 border-black/20 shadow-sm animate-bounce-in castle-brick ${colorClass}`}
                          style={{
                            height: height,
                            backgroundImage:
                              'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.05) 10px, rgba(0, 0, 0, 0.05) 20px)',
                          }}
                        >
                          {val >= 2 && (
                            <div className="flex gap-4">
                              <div className="w-4 h-6 bg-black/40 rounded-t-full border-b-2 border-white/20"></div>
                            </div>
                          )}
                          <span className="absolute right-2 bottom-1 text-xs opacity-50">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                    <div className="w-52 h-4 bg-green-700 rounded-t-lg mx-auto -mb-1 shadow-lg border-t-4 border-green-800 absolute bottom-[-10px] left-1/2 -translate-x-1/2 z-[-1]"></div>
                  </div>
                </div>
                {/* Controls */}
                <div className="mt-6 flex flex-col items-center gap-4">
                  <div className="flex justify-center gap-4 w-full">
                    {[1, 2, 3].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleAddBrick(val)}
                        disabled={showSuccess}
                        className="flex-1 bg-stone-100 border-b-4 border-stone-400 active:border-b-0 active:translate-y-1 hover:border-orange-400 hover:bg-orange-50 py-4 rounded-xl text-xl font-bold shadow-lg transition-all disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4"
                      >
                        +{val}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={removeTopBrick}
                      disabled={bricks.length === 0 || showSuccess}
                      className="text-gray-500 hover:text-red-500 font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-30"
                    >
                      Xóa 1 tầng
                    </button>
                    <button
                      onClick={resetGame}
                      className="flex items-center gap-2 text-gray-500 hover:text-blue-500 font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-30"
                    >
                      <RefreshCw size={16} /> Làm lại
                    </button>
                  </div>
                </div>
              </div>

              {/* SUCCESS OVERLAY */}
              {showSuccess && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
                  <div className="bg-white p-8 rounded-3xl shadow-2xl text-center transform animate-bounce-in border-4 border-yellow-400 max-w-sm w-full mx-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4 text-yellow-500 shadow-inner">
                      <Star
                        size={40}
                        fill="currentColor"
                        className="animate-spin-slow"
                      />
                    </div>
                    <h3 className="text-3xl font-extrabold text-gray-800 mb-2">
                      Tuyệt Vời!
                    </h3>
                    <p className="text-gray-500 mb-6 font-medium">
                      Bạn đã hoàn thành xuất sắc.
                    </p>
                    <div className="text-xl font-bold text-yellow-600 mb-6 bg-yellow-50 py-2 rounded-xl">
                      +10 Điểm
                    </div>
                    <button
                      onClick={handleNextLevel}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                    >
                      Màn tiếp theo <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* CSS Animations */}
              <style>{`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  20%, 60% { transform: translateX(-10px); }
                  40%, 80% { transform: translateX(10px); }
                }
                .animate-shake {
                  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                }
                @keyframes bounceIn {
                   0% { transform: scale(0.8) translateY(20px); opacity: 0; }
                   60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
                   100% { transform: scale(1) translateY(0); }
                }
                .animate-bounce-in {
                    animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                .animate-fade-in {
                  animation: fadeIn 0.3s ease-out forwards;
                }
                @keyframes spinSlow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                  animation: spinSlow 3s linear infinite;
                }
              `}</style>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-4 right-4 z-50">
              <button className="bg-yellow-400 hover:brightness-110 text-white p-4 rounded-full shadow-lg transition-all transform hover:scale-105 border-4 border-white">
                <Bot size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default SegmentationGamePage;
