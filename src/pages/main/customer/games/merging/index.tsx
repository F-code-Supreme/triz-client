import { useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  FlaskConical,
  Flame,
  Droplets,
  Mountain,
  Wind,
  CloudRain,
  Sprout,
  Waves,
  Zap,
  Trash2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { DefaultLayout } from '@/layouts/default-layout';

// --- CẤU HÌNH DỮ LIỆU ---

// 1. Định nghĩa các nguyên tố
const ELEMENTS_DB: Record<
  string,
  { name: string; color: string; icon: any; bg: string }
> = {
  // Cơ bản
  fire: {
    name: 'Lửa',
    color: 'text-red-500',
    bg: 'bg-red-100 border-red-300',
    icon: Flame,
  },
  water: {
    name: 'Nước',
    color: 'text-blue-500',
    bg: 'bg-blue-100 border-blue-300',
    icon: Droplets,
  },
  earth: {
    name: 'Đất',
    color: 'text-amber-700',
    bg: 'bg-amber-100 border-amber-300',
    icon: Mountain,
  },
  air: {
    name: 'Khí',
    color: 'text-sky-400',
    bg: 'bg-sky-100 border-sky-300',
    icon: Wind,
  },

  // Kết hợp cấp 1
  steam: {
    name: 'Hơi nước',
    color: 'text-gray-400',
    bg: 'bg-gray-100 border-gray-300',
    icon: CloudRain,
  },
  mud: {
    name: 'Bùn',
    color: 'text-amber-900',
    bg: 'bg-stone-300 border-stone-400',
    icon: Waves,
  },
  lava: {
    name: 'Dung nham',
    color: 'text-orange-600',
    bg: 'bg-orange-200 border-orange-400',
    icon: Flame,
  },
  dust: {
    name: 'Bụi',
    color: 'text-stone-500',
    bg: 'bg-stone-100 border-stone-300',
    icon: Wind,
  },
  rain: {
    name: 'Mưa',
    color: 'text-blue-400',
    bg: 'bg-blue-100 border-blue-300',
    icon: CloudRain,
  },

  // Kết hợp cấp 2 (Ví dụ thêm)
  plant: {
    name: 'Cây cối',
    color: 'text-green-600',
    bg: 'bg-green-100 border-green-300',
    icon: Sprout,
  },
  energy: {
    name: 'Năng lượng',
    color: 'text-yellow-500',
    bg: 'bg-yellow-100 border-yellow-300',
    icon: Zap,
  },
  swamp: {
    name: 'Đầm lầy',
    color: 'text-green-800',
    bg: 'bg-green-200 border-green-400',
    icon: Waves,
  },
};

// 2. Định nghĩa công thức (A + B = C)
// Lưu ý: Key nên sắp xếp alphabet để fire+water giống water+fire
const RECIPES: Record<string, string> = {
  'fire-water': 'steam',
  'earth-water': 'mud',
  'earth-fire': 'lava',
  'air-earth': 'dust',
  'water-water': 'rain',
  'earth-rain': 'plant', // Ví dụ logic khác
  'air-fire': 'energy',
  'mud-plant': 'swamp', // Ví dụ mở rộng...
};

const MergingGamePage = () => {
  const navigate = useNavigate();

  // State
  const [discovered, setDiscovered] = useState<string[]>([
    'fire',
    'water',
    'earth',
    'air',
  ]);
  const [mixingSlot, setMixingSlot] = useState<string[]>([]); // Chứa tối đa 2 items
  const [notification, setNotification] = useState<{
    msg: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [successAnim, setSuccessAnim] = useState(false);

  // Tính toán progress
  const totalElements = Object.keys(ELEMENTS_DB).length;
  const progress = Math.round((discovered.length / totalElements) * 100);

  // Xử lý kéo thả
  const handleDragStart = (e: React.DragEvent, elementId: string) => {
    e.dataTransfer.setData('elementId', elementId);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementId = e.dataTransfer.getData('elementId');

    if (mixingSlot.length < 2) {
      setMixingSlot((prev) => [...prev, elementId]);
    } else {
      showNotify('Nồi pha chế đã đầy! Hãy xóa bớt.', 'error');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Cho phép drop
  };

  // Logic kết hợp
  useEffect(() => {
    if (mixingSlot.length === 2) {
      // Đợi 1 chút cho animation drop xong
      setTimeout(() => {
        combineElements(mixingSlot[0], mixingSlot[1]);
      }, 500);
    }
  }, [mixingSlot]);

  const combineElements = (id1: string, id2: string) => {
    // Tạo key cho recipe (sắp xếp a-z để không quan trọng thứ tự)
    const key = [id1, id2].sort().join('-');
    const result = RECIPES[key];

    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);

      if (result) {
        // CÓ CÔNG THỨC
        if (!discovered.includes(result)) {
          // Khám phá mới
          setDiscovered((prev) => [...prev, result]);
          showNotify(
            `Tuyệt vời! Bạn đã tạo ra: ${ELEMENTS_DB[result].name}`,
            'success',
          );
          setSuccessAnim(true);
          setTimeout(() => setSuccessAnim(false), 1000);
        } else {
          showNotify(
            `Bạn đã tạo ra ${ELEMENTS_DB[result].name} (Đã có)`,
            'info',
          );
        }
        // Reset nồi pha chế
        setMixingSlot([]);
      } else {
        // SAI CÔNG THỨC
        showNotify('Kết hợp này không tạo ra gì cả...', 'error');
        setMixingSlot([]); // Hoặc giữ lại tùy logic
      }
    }, 600); // Thời gian rung lắc
  };

  const showNotify = (msg: string, type: 'success' | 'error' | 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromMix = (index: number) => {
    const newSlot = [...mixingSlot];
    newSlot.splice(index, 1);
    setMixingSlot(newSlot);
  };

  const clearMix = () => setMixingSlot([]);

  return (
    <DefaultLayout
      meta={{ title: 'Nguyên Tắc Kết Hợp: Giả Kim Thuật' }}
      className=""
    >
      <section className="relative sm:overflow-hidden flex flex-col justify-center items-center bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 h-[calc(100svh-4rem-1px)]">
        <div className="container w-full max-w-8xl p-4 sm:p-16 mx-auto">
          {/* Header Navigation & Progress */}
          <div className=" flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <button
              className="flex items-center text-gray-500 hover:text-gray-800 font-bold transition-colors"
              onClick={() => navigate({ to: '/learn-triz' })}
            >
              <ArrowLeft className="mr-2" size={24} /> Quay lại
            </button>

            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200 w-full md:w-auto">
              <BookOpen size={20} className="text-blue-500" />
              <div className="flex-1 min-w-[200px]">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>Tiến độ khám phá</span>
                  <span>
                    {discovered.length} / {totalElements}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Game Area */}
          <div className=" flex-1 flex flex-col md:flex-row gap-6">
            {/* LEFT: Mixing Area (Nồi pha chế) */}
            <div className="flex-1 order-2 md:order-1">
              <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-100 p-8 h-full flex flex-col items-center justify-center relative overflow-hidden">
                <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                  <FlaskConical className="text-purple-500" /> Khu Vực Kết Hợp
                </h2>

                {/* Drop Zone */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Khu vực kết hợp, kéo hai nguyên tố vào đây"
                  onClick={(e) => (e.currentTarget as HTMLElement).focus()}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      (e.currentTarget as HTMLElement).focus();
                    }
                  }}
                  onTouchStart={(e) => (e.currentTarget as HTMLElement).focus()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className={`
                        w-64 h-64 rounded-full border-4 border-dashed transition-all duration-300 flex items-center justify-center relative
                        ${isShaking ? 'animate-shake border-red-400 bg-red-50' : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50'}
                        ${successAnim ? 'ring-8 ring-green-200 border-green-500 scale-105' : ''}
                    `}
                >
                  {/* Background Icon */}
                  {mixingSlot.length === 0 && (
                    <div className="text-slate-300 flex flex-col items-center animate-pulse">
                      <Sparkles size={48} />
                      <span className="text-sm font-semibold mt-2">
                        Kéo nguyên tố vào đây
                      </span>
                    </div>
                  )}

                  {/* Items inside Mix */}
                  <div className="flex gap-2 z-10">
                    {mixingSlot.map((id, index) => {
                      const item = ELEMENTS_DB[id];
                      const Icon = item.icon;
                      return (
                        <div
                          key={index}
                          role="button"
                          tabIndex={0}
                          aria-label={`Xóa ${item.name}`}
                          className="relative group cursor-pointer focus:outline-none"
                          onClick={() => removeFromMix(index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              removeFromMix(index);
                            }
                          }}
                          onTouchStart={(e) =>
                            (e.currentTarget as HTMLElement).focus()
                          }
                        >
                          <div
                            className={`w-20 h-20 rounded-2xl shadow-lg flex items-center justify-center transform transition-all hover:scale-105 ${item.bg}`}
                          >
                            <Icon size={32} className={item.color} />
                          </div>
                          <button
                            type="button"
                            aria-label={`Xóa ${item.name}`}
                            onClick={(ev) => {
                              ev.stopPropagation();
                              removeFromMix(index);
                            }}
                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow border focus:outline-none hover:bg-red-50"
                          >
                            <Trash2 size={12} className="text-red-500" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mixing Animation Effect */}
                  {isShaking && (
                    <div className="absolute inset-0 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center z-20">
                      <RefreshCwSpin className="text-purple-600 w-10 h-10" />
                    </div>
                  )}
                </div>

                <div className="mt-8 text-center text-slate-400 text-sm">
                  Kéo 2 nguyên tố vào vòng tròn để tạo hợp chất mới.
                </div>

                {mixingSlot.length > 0 && (
                  <button
                    onClick={clearMix}
                    className="mt-4 text-slate-500 hover:text-red-500 font-bold text-sm underline"
                  >
                    Làm sạch nồi
                  </button>
                )}

                {/* Notification Toast */}
                {notification && (
                  <div
                    className={`absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg font-bold text-white text-sm animate-bounce-in z-50 whitespace-nowrap
                        ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
                    `}
                  >
                    {notification.msg}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Inventory (Kho nguyên liệu) */}
            <div className="w-full md:w-80 order-1 md:order-2 h-[300px] md:h-auto flex flex-col">
              <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-slate-700">
                    Kho Nguyên Liệu
                  </h3>
                </div>

                <div
                  className="overflow-y-auto h-[500px] p-4"
                  style={{ scrollbarWidth: 'thin' }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {discovered.map((id) => {
                      const item = ELEMENTS_DB[id];
                      if (!item) return null;
                      const Icon = item.icon;
                      return (
                        <div
                          key={id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, id)}
                          role="button"
                          tabIndex={0}
                          aria-label={`Thêm ${item.name} vào nồi`}
                          onClick={() => {
                            if (mixingSlot.length < 2) {
                              setMixingSlot((prev) => [...prev, id]);
                            } else {
                              showNotify(
                                'Nồi pha chế đã đầy! Hãy xóa bớt.',
                                'error',
                              );
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              if (mixingSlot.length < 2) {
                                setMixingSlot((prev) => [...prev, id]);
                              } else {
                                showNotify(
                                  'Nồi pha chế đã đầy! Hãy xóa bớt.',
                                  'error',
                                );
                              }
                            }
                          }}
                          onTouchStart={(e) =>
                            (e.currentTarget as HTMLElement).focus()
                          }
                          className={`
                                        cursor-grab active:cursor-grabbing
                                        flex flex-col items-center justify-center p-3 rounded-xl border-2 border-transparent hover:border-blue-200 hover:shadow-md transition-all
                                        bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200
                                    `}
                        >
                          <div
                            className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center ${item.bg}`}
                          >
                            <Icon size={24} className={item.color} />
                          </div>
                          <span className="text-xs font-bold text-slate-600 text-center">
                            {item.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
         @keyframes shake {
            0%, 100% { transform: translateX(0) rotate(0); }
            20% { transform: translateX(-5px) rotate(-5deg); }
            40% { transform: translateX(5px) rotate(5deg); }
            60% { transform: translateX(-5px) rotate(-5deg); }
            80% { transform: translateX(5px) rotate(5deg); }
         }
         .animate-shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
         }
         @keyframes bounceIn {
            0% { transform: translate(-50%, -20px); opacity: 0; }
            60% { transform: translate(-50%, 5px); opacity: 1; }
            100% { transform: translate(-50%, 0); }
         }
         .animate-bounce-in {
            animation: bounceIn 0.3s ease-out forwards;
         }
         .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
         }
         .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9; 
         }
         .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1; 
            border-radius: 10px;
         }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; 
         }
      `}</style>
    </DefaultLayout>
  );
};

// Component loading nhỏ cho hiệu ứng xoay
const RefreshCwSpin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`animate-spin ${className}`}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);

export default MergingGamePage;
