import { useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft as ArrowIconLeft,
  CheckCircle2,
  Trophy,
  AlertOctagon,
  RotateCw,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { useUpdateGameScoreMutation } from '@/features/game/services/mutations';
import { GamesEnumId } from '@/features/game/services/mutations/enum';
import { DefaultLayout } from '@/layouts/default-layout';

// --- TYPES & CONFIG ---
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface CellConfig {
  x: number;
  y: number;
  dir: Direction;
  fixed: boolean; // True = Không thể xoay (Tường hoặc bẫy)
}

interface LevelData {
  id: number;
  name: string;
  desc: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  layout: CellConfig[]; // Cấu hình các ô đặc biệt
}

const GRID_SIZE = 5;
const MAX_STEPS = 20; // Giới hạn bước đi để chống vòng lặp

// --- DỮ LIỆU 5 LEVEL ---
const LEVELS: LevelData[] = [
  {
    id: 1,
    name: 'Khởi động',
    desc: 'Làm quen với việc xoay hướng.',
    start: { x: 0, y: 0 },
    end: { x: 4, y: 0 },
    layout: [
      { x: 0, y: 0, dir: 'RIGHT', fixed: true },
      // Tường chặn ở giữa, phải đi vòng xuống
      { x: 2, y: 0, dir: 'DOWN', fixed: true },
      { x: 2, y: 1, dir: 'RIGHT', fixed: true },
      { x: 3, y: 1, dir: 'UP', fixed: true },
      { x: 4, y: 0, dir: 'DOWN', fixed: true },
    ],
  },
  {
    id: 2,
    name: 'Ziczac',
    desc: 'Đừng để chóng mặt nhé.',
    start: { x: 0, y: 0 },
    end: { x: 4, y: 4 },
    layout: [
      { x: 0, y: 0, dir: 'DOWN', fixed: false },
      { x: 1, y: 1, dir: 'UP', fixed: true }, // Bẫy: Nếu đi vào đây sẽ bị đẩy ngược lên
      { x: 2, y: 2, dir: 'UP', fixed: true }, // Bẫy
      { x: 3, y: 3, dir: 'UP', fixed: true }, // Bẫy
      { x: 4, y: 4, dir: 'DOWN', fixed: true }, // Đích
    ],
  },
  {
    id: 3,
    name: 'Bức tường chắn',
    desc: 'Tìm đường luồn lách qua khe hở.',
    start: { x: 0, y: 2 },
    end: { x: 4, y: 2 },
    layout: [
      { x: 0, y: 2, dir: 'UP', fixed: false },
      // Một bức tường dọc chặn đường
      { x: 2, y: 0, dir: 'LEFT', fixed: true },
      { x: 2, y: 1, dir: 'LEFT', fixed: true },
      { x: 2, y: 3, dir: 'LEFT', fixed: true },
      { x: 2, y: 4, dir: 'LEFT', fixed: true },
      // Khe hở duy nhất ở (2,2) nhưng cần khéo léo
      { x: 2, y: 2, dir: 'RIGHT', fixed: false },
    ],
  },
  {
    id: 4,
    name: 'Xoắn ốc',
    desc: 'Đi vào tâm của cơn bão.',
    start: { x: 0, y: 0 },
    end: { x: 2, y: 2 }, // Đích ở chính giữa
    layout: [
      { x: 0, y: 0, dir: 'RIGHT', fixed: false },
      // Tạo khung tường bao quanh đích để ép đi vòng
      { x: 1, y: 1, dir: 'DOWN', fixed: true },
      { x: 2, y: 1, dir: 'LEFT', fixed: true },
      { x: 3, y: 1, dir: 'LEFT', fixed: true },
      { x: 1, y: 2, dir: 'DOWN', fixed: true },
      { x: 3, y: 2, dir: 'UP', fixed: true },
      { x: 1, y: 3, dir: 'RIGHT', fixed: true },
      { x: 2, y: 3, dir: 'RIGHT', fixed: true },
      { x: 3, y: 3, dir: 'UP', fixed: true },
    ],
  },
  {
    id: 5,
    name: 'Mê cung tử thần',
    desc: 'Thử thách cuối cùng. Rất nhiều bẫy!',
    start: { x: 0, y: 4 },
    end: { x: 4, y: 0 },
    layout: [
      { x: 0, y: 4, dir: 'UP', fixed: false },
      // Các ô cố định chĩa ra ngoài bản đồ (Bẫy chết người)
      { x: 0, y: 2, dir: 'LEFT', fixed: true }, // Bẫy
      { x: 2, y: 4, dir: 'DOWN', fixed: true }, // Bẫy
      { x: 4, y: 2, dir: 'RIGHT', fixed: true }, // Bẫy
      { x: 2, y: 0, dir: 'UP', fixed: true }, // Bẫy
      // Các ô chéo buộc phải đổi hướng
      { x: 1, y: 1, dir: 'DOWN', fixed: true },
      { x: 3, y: 3, dir: 'UP', fixed: true },
    ],
  },
];

interface Cell {
  x: number;
  y: number;
  direction: Direction;
  isFixed: boolean;
}

const PreliminaryGamePage = () => {
  const navigate = useNavigate();
  const updateScoreMutation = useUpdateGameScoreMutation();

  // --- STATE ---
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });

  // Status: PLANNING (Lập kế hoạch), RUNNING (Chạy), WON (Thắng), LOST (Thua)
  const [status, setStatus] = useState<'PLANNING' | 'RUNNING' | 'WON' | 'LOST'>(
    'PLANNING',
  );
  const [failReason, setFailReason] = useState<string>(''); // Lý do thua

  const [stepCount, setStepCount] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- LOAD LEVEL ---
  useEffect(() => {
    loadLevel(currentLevelIndex);
  }, [currentLevelIndex]);

  const loadLevel = (index: number) => {
    if (index >= LEVELS.length) {
      setIsGameFinished(true);
      return;
    }
    const levelData = LEVELS[index];
    const newGrid: Cell[] = [];

    // Tạo lưới
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const config = levelData.layout.find((c) => c.x === x && c.y === y);
        newGrid.push({
          x,
          y,
          direction: config ? config.dir : 'RIGHT', // Mặc định là RIGHT
          isFixed: config ? config.fixed : false,
        });
      }
    }
    setGrid(newGrid);
    setBallPos(levelData.start);
    setStatus('PLANNING');
    setStepCount(0);
  };

  // --- GAMEPLAY ACTIONS ---

  const handleRotate = (x: number, y: number) => {
    if (status !== 'PLANNING') return;
    setGrid((prev) =>
      prev.map((cell) => {
        if (cell.x === x && cell.y === y && !cell.isFixed) {
          const dirs: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT'];
          const next = dirs[(dirs.indexOf(cell.direction) + 1) % 4];
          return { ...cell, direction: next };
        }
        return cell;
      }),
    );
  };

  const handleStart = () => {
    setStatus('RUNNING');
    setStepCount(0);
  };

  const handleNextLevel = () => {
    const pointsGained = 10;
    const newTotal = score + pointsGained;
    setScore(newTotal); // Cộng điểm
    setCurrentLevelIndex((prev) => prev + 1);
    updateScoreMutation.mutate({
      gameId: GamesEnumId.Preliminary,
      score: newTotal,
    });
  };

  const handleRetry = () => {
    // Reset bóng về đầu, nhưng giữ nguyên hướng mũi tên người chơi đã chỉnh
    setBallPos(LEVELS[currentLevelIndex].start);
    setStatus('PLANNING');
    setStepCount(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // --- GAME LOOP ---
  useEffect(() => {
    if (status === 'RUNNING') {
      timerRef.current = setInterval(gameStep, 400); // Tốc độ chạy
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, ballPos]);

  const gameStep = () => {
    if (stepCount >= MAX_STEPS) {
      setFailReason('Bóng đi lòng vòng quá lâu (Hết xăng).');
      setStatus('LOST');
      return;
    }

    setBallPos((curr) => {
      const cell = grid.find((c) => c.x === curr.x && c.y === curr.y);
      if (!cell) return curr;

      let nextX = curr.x;
      let nextY = curr.y;

      switch (cell.direction) {
        case 'UP':
          nextY--;
          break;
        case 'DOWN':
          nextY++;
          break;
        case 'LEFT':
          nextX--;
          break;
        case 'RIGHT':
          nextX++;
          break;
      }

      // 1. Kiểm tra va chạm Tường/Biên (Thua ngay)
      if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
        setFailReason('Bóng đã lao ra khỏi bản đồ!');
        setStatus('LOST');
        return curr; // Giữ vị trí cũ để hiện hiệu ứng
      }

      // 2. Kiểm tra Đích (Thắng)
      const lvl = LEVELS[currentLevelIndex];
      if (nextX === lvl.end.x && nextY === lvl.end.y) {
        setStatus('WON');
        return { x: nextX, y: nextY };
      }

      setStepCount((s) => s + 1);
      return { x: nextX, y: nextY };
    });
  };

  // --- RENDER HELPERS ---
  const getIcon = (dir: Direction) => {
    switch (dir) {
      case 'UP':
        return <ArrowUp size={22} />;
      case 'DOWN':
        return <ArrowDown size={22} />;
      case 'LEFT':
        return <ArrowIconLeft size={22} />;
      case 'RIGHT':
        return <ArrowRight size={22} />;
    }
  };

  if (isGameFinished) {
    return (
      <DefaultLayout meta={{ title: 'Hoàn thành!' }}>
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex flex-col items-center justify-center p-4 text-center">
          <Trophy size={80} className="text-yellow-500 mb-6 animate-bounce" />
          <h1 className="text-4xl  text-slate-800 mb-2">
            CHIẾN THẮNG TUYỆT ĐỐI!
          </h1>
          <p className="text-slate-600 mb-8 text-lg">
            Bạn đã vượt qua cả 5 thử thách.
          </p>
          <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-yellow-300 mb-8 w-full max-w-xs">
            <div className="text-sm text-slate-400 uppercase font-bold">
              Tổng điểm
            </div>
            <div className="text-6xl  text-yellow-500">{score + 10}</div>
            {/* +10 vì điểm màn cuối chưa cộng trong handleNextLevel do màn hình này hiện ra trước */}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-800 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition"
          >
            Chơi lại từ đầu
          </button>
        </div>
      </DefaultLayout>
    );
  }

  const currentLevel = LEVELS[currentLevelIndex];

  return (
    <DefaultLayout meta={{ title: 'Game Thực hiện sơ bộ' }} className="">
      <section className="relative sm:overflow-hidden flex flex-col justify-center items-center bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ">
        <div className="container w-full max-w-8xl p-4 sm:p-16 mx-auto">
          <div className=" dark:bg-slate-900 flex flex-col items-center p-4">
            {/* TOP BAR */}
            <div className="w-full max-w-md flex justify-between items-center mb-6 mt-2">
              <button
                onClick={() => navigate({ to: '/learn-triz' })}
                className="flex items-center text-gray-500 hover:text-gray-800 font-bold transition-colors"
              >
                <ArrowLeft className="mr-2" size={24} /> Quay lại
              </button>

              <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-xl border border-yellow-200 shadow-sm">
                <Trophy size={18} className="text-yellow-600" />
                <span className="font-bold text-yellow-800">Điểm: {score}</span>
              </div>
            </div>

            {/* LEVEL INFO */}
            <div className="text-center mb-6">
              <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
                LEVEL {currentLevel.id}/5
              </h2>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                {currentLevel.name}
              </h1>
              <p className="text-slate-500 text-sm">{currentLevel.desc}</p>
            </div>

            {/* GAME AREA */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-2xl border-4 border-slate-100 dark:border-slate-700 relative">
              {/* OVERLAY: WON */}
              {status === 'WON' && (
                <div className="absolute inset-0 z-50 bg-green-500/95 backdrop-blur-sm rounded-[1.7rem] flex flex-col items-center justify-center text-white animate-fade-in px-4 text-center">
                  <CheckCircle2 size={60} className="mb-3" />
                  <h2 className="text-3xl font-bold">Làm Tốt Lắm!</h2>
                  <p className="mb-1 opacity-90">Kế hoạch sơ bộ hoàn hảo.</p>
                  <div className="text-xl  bg-white/20 px-4 py-1 rounded-lg mb-6">
                    +10 Điểm
                  </div>
                  <button
                    onClick={handleNextLevel}
                    className="w-full py-3 bg-white text-green-700 font-bold rounded-xl shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                  >
                    Màn tiếp theo <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {/* OVERLAY: LOST */}
              {status === 'LOST' && (
                <div className="absolute inset-0 z-50 bg-red-500/95 backdrop-blur-sm rounded-[1.7rem] flex flex-col items-center justify-center text-white animate-fade-in px-4 text-center">
                  <AlertOctagon size={60} className="mb-3" />
                  <h2 className="text-3xl font-bold">Thất Bại!</h2>
                  <p className="mb-6 opacity-90 text-sm max-w-[200px] mx-auto">
                    {failReason}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="w-full py-3 bg-white text-red-600 font-bold rounded-xl shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={20} /> Sửa lại (Giữ nguyên mũi tên)
                  </button>
                </div>
              )}

              {/* GRID MAP */}
              <div
                className="grid gap-2 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  width: '280px',
                }}
              >
                {grid.map((cell) => {
                  const isStart =
                    cell.x === currentLevel.start.x &&
                    cell.y === currentLevel.start.y;
                  const isEnd =
                    cell.x === currentLevel.end.x &&
                    cell.y === currentLevel.end.y;
                  const isBall = ballPos.x === cell.x && ballPos.y === cell.y;

                  return (
                    <button
                      key={`${cell.x}-${cell.y}`}
                      type="button"
                      onClick={() => handleRotate(cell.x, cell.y)}
                      disabled={status !== 'PLANNING' || cell.isFixed}
                      className={`aspect-square rounded-xl flex items-center justify-center relative transition-all duration-200 ${cell.isFixed ? 'bg-slate-100 border border-slate-200' : status === 'PLANNING' ? 'bg-white border-2 border-blue-500 cursor-pointer hover:bg-blue-50 shadow-[0_4px_0_rgba(99,102,241,0.2)] active:shadow-none active:translate-y-1' : 'bg-white border border-slate-200'}`}
                    >
                      {/* Arrow */}
                      <div
                        className={`transition-transform duration-300 ${cell.isFixed ? 'text-slate-300' : 'text-blue-600 font-bold'}`}
                      >
                        {getIcon(cell.direction)}
                      </div>

                      {/* Start/End Label */}
                      {isStart && (
                        <div className="absolute -top-2 -left-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          START
                        </div>
                      )}
                      {isEnd && (
                        <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          ĐÍCH
                        </div>
                      )}

                      {/* Ball */}
                      {isBall && status !== 'LOST' && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg border-2 border-white animate-bounce"></div>
                        </div>
                      )}

                      {/* Explosion Effect */}
                      {isBall && status === 'LOST' && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="text-4xl animate-ping">💥</div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CONTROLLER */}
            <div className="w-full max-w-md mt-8">
              {status === 'PLANNING' ? (
                <button
                  onClick={handleStart}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg"
                >
                  <Play fill="currentColor" size={24} /> THỰC THI SƠ BỘ
                </button>
              ) : (
                <div className="w-full py-4 bg-slate-200 text-slate-500 font-bold rounded-2xl flex items-center justify-center gap-2 animate-pulse">
                  <RotateCw className="animate-spin" size={20} /> Đang chạy...
                </div>
              )}

              <p className="text-center text-slate-400 text-sm mt-4 px-8">
                {status === 'PLANNING'
                  ? 'Hãy xoay các mũi tên về đúng hướng TRƯỚC KHI bấm nút.'
                  : 'Bạn không thể thay đổi hướng khi đã bắt đầu.'}
              </p>
            </div>
          </div>
        </div>

        <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
      </section>
    </DefaultLayout>
  );
};

export default PreliminaryGamePage;
