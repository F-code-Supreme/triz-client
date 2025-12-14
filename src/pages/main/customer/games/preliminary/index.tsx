import { useQueryClient } from '@tanstack/react-query';
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
  RefreshCw,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

import { useUpdateGameScoreMutation } from '@/features/game/services/mutations';
import { GamesEnumId } from '@/features/game/services/mutations/enum';
import { useGetGameLeaderboardByIdQuery } from '@/features/game/services/queries';
import { GameKeys } from '@/features/game/services/queries/keys';
import { DefaultLayout } from '@/layouts/default-layout';
import Leaderboard from '@/pages/main/customer/games/segmentation/components/Leaderboard';

// --- TYPES & CONFIG ---
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface CellConfig {
  x: number;
  y: number;
  dir: Direction;
  fixed: boolean;
}

interface LevelData {
  id: number;
  name: string;
  desc: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  layout: CellConfig[];
}

interface Cell {
  x: number;
  y: number;
  direction: Direction;
  isFixed: boolean;
}

const GRID_SIZE = 5;
const MAX_STEPS = 25; // Tăng nhẹ giới hạn bước

// --- HÀM HỖ TRỢ SINH MAP NGẪU NHIÊN ---

const getRandomDirection = (): Direction => {
  const dirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  return dirs[Math.floor(Math.random() * dirs.length)];
};

// Hàm tạo màn chơi ngẫu nhiên nhưng ĐẢM BẢO giải được
// eslint-disable-next-line sonarjs/cognitive-complexity
const generateRandomLevel = (levelIndex: number): LevelData => {
  const id = levelIndex + 1;

  // 1. Chọn điểm Start (thường ở cột trái) và End (thường ở cột phải)
  const start = { x: 0, y: Math.floor(Math.random() * GRID_SIZE) };
  const end = { x: GRID_SIZE - 1, y: Math.floor(Math.random() * GRID_SIZE) };

  // 2. Tạo đường đi hợp lệ (Self-Avoiding Walk)
  // Chúng ta sẽ giả lập một con bot đi từ Start -> End để tạo ra "Đáp án đúng"
  let path: { x: number; y: number; dir: Direction }[] = [];
  let current = { ...start };
  let attempts = 0;

  // Thử tạo đường đi, nếu kẹt thì làm lại (tối đa 100 lần thử)
  while (attempts < 100) {
    path = [];
    current = { ...start };
    const visited = new Set<string>();
    visited.add(`${current.x},${current.y}`);
    let stuck = false;

    while (current.x !== end.x || current.y !== end.y) {
      const moves: { x: number; y: number; dir: Direction }[] = [];

      // Các bước đi có thể
      if (current.y > 0)
        moves.push({ x: current.x, y: current.y - 1, dir: 'UP' });
      if (current.y < GRID_SIZE - 1)
        moves.push({ x: current.x, y: current.y + 1, dir: 'DOWN' });
      if (current.x > 0)
        moves.push({ x: current.x - 1, y: current.y, dir: 'LEFT' });
      if (current.x < GRID_SIZE - 1)
        moves.push({ x: current.x + 1, y: current.y, dir: 'RIGHT' });

      // Lọc các ô đã đi qua để tránh vòng lặp
      const validMoves = moves.filter((m) => !visited.has(`${m.x},${m.y}`));

      // Ưu tiên đi về phía đích để đường đi tự nhiên hơn
      validMoves.sort((a, b) => {
        const distA = Math.abs(a.x - end.x) + Math.abs(a.y - end.y);
        const distB = Math.abs(b.x - end.x) + Math.abs(b.y - end.y);
        // Random nhẹ để không đi đường thẳng tắp
        return distA - distB + (Math.random() * 2 - 1);
      });

      if (validMoves.length === 0) {
        stuck = true; // Bị kẹt vào ngõ cụt
        break;
      }

      // Chọn bước đi tốt nhất (hoặc random trong top tốt)
      const nextMove = validMoves[0];

      // Lưu lại hướng cho ô hiện tại (ô hiện tại phải trỏ về nextMove)
      path.push({ x: current.x, y: current.y, dir: nextMove.dir });

      current = { x: nextMove.x, y: nextMove.y };
      visited.add(`${current.x},${current.y}`);
    }

    if (!stuck) break; // Tìm được đường đi thành công
    attempts++;
  }

  // 3. Xây dựng Grid config
  const layout: CellConfig[] = [];
  const pathMap = new Map<string, Direction>();
  path.forEach((p) => pathMap.set(`${p.x},${p.y}`, p.dir));

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const key = `${x},${y}`;
      const isPath = pathMap.has(key);

      // Độ khó tăng dần theo level: Tỉ lệ xuất hiện tường chắn (Fixed cell)
      // Level 1: 10%, Level 10+: 40%
      const obstacleChance = Math.min(0.1 + levelIndex * 0.05, 0.4);

      if (isPath) {
        // Nếu là đường đi đúng:
        // - Không được Fixed (để người chơi xoay).
        // - Hướng ban đầu phải SAI (để người chơi phải tìm ra).
        let initialDir = getRandomDirection();
        // 50% cơ hội hướng bị sai ngẫu nhiên
        if (Math.random() > 0.5) {
          initialDir = getRandomDirection();
        }

        layout.push({ x, y, dir: initialDir, fixed: false });
      } else if (x === end.x && y === end.y) {
        // Ô đích: Hướng không quan trọng, nhưng cứ để fixed cho đẹp
        layout.push({ x, y, dir: 'DOWN', fixed: true });
      } else {
        // Các ô còn lại (Nhiễu)
        const isFixed = Math.random() < obstacleChance;
        layout.push({ x, y, dir: getRandomDirection(), fixed: isFixed });
      }
    }
  }

  return {
    id,
    name: `Thử thách #${id}`,
    desc:
      id === 1 ? 'Khởi động nhẹ nhàng.' : `Độ khó tăng dần. Cẩn thận các bẫy!`,
    start,
    end,
    layout,
  };
};

const PreliminaryGamePage = () => {
  const navigate = useNavigate();
  const updateScoreMutation = useUpdateGameScoreMutation();
  const queryClient = useQueryClient();
  const { data } = useGetGameLeaderboardByIdQuery(GamesEnumId.Preliminary);
  // --- STATE ---
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [levelData, setLevelData] = useState<LevelData | null>(null);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<Cell[]>([]);
  const [ballPos, setBallPos] = useState({ x: 0, y: 0 });
  const [milestone, setMilestone] = useState(0);
  const [startTime, setStartTime] = useState<number>(() => Date.now());
  // Status: PLANNING, RUNNING, WON, LOST
  const [status, setStatus] = useState<'PLANNING' | 'RUNNING' | 'WON' | 'LOST'>(
    'PLANNING',
  );
  const [failReason, setFailReason] = useState<string>('');
  const [stepCount, setStepCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- INITIAL LOAD & LEVEL GENERATION ---

  // Hàm nạp level
  const loadLevel = useCallback((index: number) => {
    // Sinh level mới
    const newLevel = generateRandomLevel(index);
    setLevelData(newLevel);

    // Parse layout thành grid state
    const newGrid: Cell[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const config = newLevel.layout.find((c) => c.x === x && c.y === y);
        newGrid.push({
          x,
          y,
          direction: config ? config.dir : 'RIGHT',
          isFixed: config ? config.fixed : false,
        });
      }
    }
    setGrid(newGrid);
    setBallPos(newLevel.start);
    setStatus('PLANNING');
    setStepCount(0);
  }, []);

  // Lần đầu chạy
  useEffect(() => {
    loadLevel(0);
  }, [loadLevel]);

  // --- ACTIONS ---

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
    const pointsGained = 10 + Math.floor(currentLevelIndex / 2); // Điểm thưởng tăng dần theo level
    const newTotal = score + pointsGained;
    const newMilestone = milestone + 1;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    setScore(newTotal);
    setMilestone(newMilestone);
    setStartTime(Date.now());

    // Tăng index và nạp màn mới
    const nextIndex = currentLevelIndex + 1;
    setCurrentLevelIndex(nextIndex);
    loadLevel(nextIndex);

    updateScoreMutation.mutate(
      {
        gameId: GamesEnumId.Preliminary,
        score: newTotal,
        timeTaken,
        milestone: newMilestone,
      },
      {
        onSuccess: () => {
          toast.success('Điểm số đã được cập nhật!');
          queryClient.invalidateQueries({
            queryKey: [
              GameKeys.GetGameLeaderboardById,
              GamesEnumId.Preliminary,
            ],
          });
        },
      },
    );
  };

  const handleRetry = () => {
    if (!levelData) return;
    setBallPos(levelData.start);
    setStatus('PLANNING');
    setStepCount(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // --- GAME LOOP ---
  useEffect(() => {
    if (status === 'RUNNING') {
      timerRef.current = setInterval(gameStep, 350); // Tăng tốc độ chút cho kịch tính
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, ballPos]);

  const gameStep = () => {
    if (!levelData) return;

    if (stepCount >= MAX_STEPS) {
      setFailReason('Bóng đi quá lâu (Hết nhiên liệu).');
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

      // 1. Va chạm biên
      if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
        setFailReason('Bóng lao ra ngoài vũ trụ!');
        setStatus('LOST');
        return curr;
      }

      // 2. Kiểm tra đích
      if (nextX === levelData.end.x && nextY === levelData.end.y) {
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

  if (!levelData) return null;

  return (
    <DefaultLayout
      meta={{ title: 'Game Thực hiện sơ bộ - Vô tận' }}
      className=""
    >
      <section className="relative sm:overflow-hidden flex flex-col justify-center items-center bg-gradient-to-t from-blue-200 via-white to-white dark:bg-gradient-to-t dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ">
        <div className=" w-full max-w-8xl grid grid-cols-3 p-4 sm:p-16 mx-auto">
          <div className=" col-span-2 max-w-4xl mx-auto w-full p-4 sm:p-8 relative z-10">
            <div className=" dark:bg-slate-900 flex flex-col items-center p-4">
              {/* TOP BAR */}
              <div className="w-full max-w-md flex justify-between items-center mb-6 mt-2">
                <button
                  onClick={() => navigate({ to: '/games' })}
                  className="flex items-center text-gray-500 hover:text-gray-800 font-bold transition-colors"
                >
                  <ArrowLeft className="mr-2" size={24} /> Thoát
                </button>

                <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-xl border border-yellow-200 shadow-sm">
                  <Trophy size={18} className="text-yellow-600" />
                  <span className="font-bold text-yellow-800">
                    Điểm: {score}
                  </span>
                </div>
              </div>

              {/* LEVEL INFO */}
              <div className="text-center mb-6">
                <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
                  LEVEL {levelData.id}
                </h2>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {levelData.name}
                </h1>
                <p className="text-slate-500 text-sm">{levelData.desc}</p>
              </div>

              {/* GAME AREA */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-2xl border-4 border-slate-100 dark:border-slate-700 relative">
                {/* OVERLAY: WON */}
                {status === 'WON' && (
                  <div className="absolute inset-0 z-50 bg-green-500/95 backdrop-blur-sm rounded-[1.7rem] flex flex-col items-center justify-center text-white animate-fade-in px-4 text-center">
                    <CheckCircle2 size={60} className="mb-3" />
                    <h2 className="text-3xl font-bold">Hoàn Thành!</h2>
                    <p className="mb-1 opacity-90">
                      Sẵn sàng cho thử thách khó hơn?
                    </p>
                    <div className="text-xl bg-white/20 px-4 py-1 rounded-lg mb-6">
                      +{10 + Math.floor(currentLevelIndex / 2)} Điểm
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
                    <p className="mb-6 opacity-90 text-sm  mx-auto">
                      {failReason}
                    </p>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={handleRetry}
                        className="flex-1 py-3 bg-white text-red-600 font-bold rounded-xl shadow-lg hover:scale-105 transition flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={18} /> Thử lại
                      </button>
                      {/* Nút bỏ qua nếu quá khó (trừ điểm) - tuỳ chọn thêm */}
                      <button
                        onClick={() => {
                          // Reset map khác nếu quá khó
                          loadLevel(currentLevelIndex);
                        }}
                        className="px-4 py-3 bg-red-700 text-white font-bold rounded-xl shadow-lg hover:bg-red-800 transition"
                        title="Đổi bản đồ khác"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </div>
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
                      cell.x === levelData.start.x &&
                      cell.y === levelData.start.y;
                    const isEnd =
                      cell.x === levelData.end.x && cell.y === levelData.end.y;
                    const isBall = ballPos.x === cell.x && ballPos.y === cell.y;

                    return (
                      <button
                        key={`${cell.x}-${cell.y}`}
                        type="button"
                        onClick={() => handleRotate(cell.x, cell.y)}
                        disabled={status !== 'PLANNING' || cell.isFixed}
                        className={`
                        aspect-square rounded-xl flex items-center justify-center relative transition-all duration-200
                        ${
                          cell.isFixed
                            ? 'bg-slate-100 border border-slate-200'
                            : status === 'PLANNING'
                              ? 'bg-white border-2 border-blue-500 cursor-pointer hover:bg-blue-50 shadow-[0_4px_0_rgba(99,102,241,0.2)] active:shadow-none active:translate-y-1'
                              : 'bg-white border border-slate-200'
                        }
                      `}
                      >
                        {/* Arrow Icon */}
                        <div
                          className={`transition-transform duration-300 ${cell.isFixed ? 'text-slate-300' : 'text-blue-600 font-bold'}`}
                        >
                          {getIcon(cell.direction)}
                        </div>

                        {/* Start/End Label */}
                        {isStart && (
                          <div className="absolute -top-2 -left-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10">
                            START
                          </div>
                        )}
                        {isEnd && (
                          <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow z-10">
                            ĐÍCH
                          </div>
                        )}

                        {/* Ball Animation */}
                        {isBall && status !== 'LOST' && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg border-2 border-white animate-bounce"></div>
                          </div>
                        )}

                        {/* Explosion Effect */}
                        {isBall && status === 'LOST' && (
                          <div className="absolute inset-0 flex items-center justify-center z-30">
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
                  Điều chỉnh các mũi tên màu xanh để dẫn bóng về đích.
                </p>
              </div>
            </div>
          </div>
          <div className="col-span-1 mx-auto w-full mt-auto">
            <Leaderboard entries={data} />
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
