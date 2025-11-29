import { useNavigate } from '@tanstack/react-router';
import {
  BookOpen,
  Brain,
  Gamepad2,
  Search,
  Sparkles,
  Target,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import { AsyncSelect } from '@/components/ui/async-select';
import { Card } from '@/components/ui/card';
import { DefaultLayout } from '@/layouts/default-layout';
import { principlesData } from '@/pages/main/public/learn-triz/components/principles-data';

interface Game {
  id: string;
  name: string;
  route: string;
  description: string;
  principleNumber: number;
  principleTitle?: string;
  principleImage?: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const GAMES: Game[] = [
  {
    id: 'memory-card',
    name: 'Ghi Nhớ Thẻ Bài',
    route: '/games/memory-card',
    description: 'Trò chơi rèn luyện trí nhớ và khả năng ghi nhớ',
    principleNumber: 10,
    icon: <Brain className="w-8 h-8" />,
    color: 'text-purple-600',
    bgGradient: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'merging-game',
    name: 'Giả Kim Thuật',
    route: '/games/merging-game',
    description: 'Kết hợp các nguyên tố để tạo ra sản phẩm mới',
    principleNumber: 5,
    icon: <Sparkles className="w-8 h-8" />,
    color: 'text-orange-600',
    bgGradient: 'from-orange-500 to-red-600',
  },
  {
    id: 'preliminary-game',
    name: 'Mê Cung Hướng Dẫn',
    route: '/games/preliminary-game',
    description: 'Lập kế hoạch và sắp xếp trước để vượt qua thử thách',
    principleNumber: 10,
    icon: <Target className="w-8 h-8" />,
    color: 'text-blue-600',
    bgGradient: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'segmentation-game',
    name: 'Xây Tháp',
    route: '/games/segmentation-game',
    description: 'Chia nhỏ vấn đề thành các phần để giải quyết',
    principleNumber: 1,
    icon: <Gamepad2 className="w-8 h-8" />,
    color: 'text-green-600',
    bgGradient: 'from-green-500 to-emerald-600',
  },
];

const GamesIndexPage = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState('');

  // Combine games with principles data using useMemo
  const gamesWithPrinciples = useMemo(() => {
    return GAMES.map((game) => {
      const principle = principlesData.find(
        (p) => p.number === game.principleNumber,
      );
      return {
        ...game,
        principleTitle: principle?.title || '',
        principleImage: principle?.image || '',
      };
    });
  }, []);

  // Fetcher function for AsyncSelect
  const fetchGames = async (query?: string): Promise<Game[]> => {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (!query) return gamesWithPrinciples;

    const lowerQuery = query.toLowerCase();
    return gamesWithPrinciples.filter(
      (game) =>
        game.name.toLowerCase().includes(lowerQuery) ||
        game.description.toLowerCase().includes(lowerQuery) ||
        game.principleTitle?.toLowerCase().includes(lowerQuery),
    );
  };

  const handleGameClick = (route: string) => {
    navigate({ to: route });
  };

  const handleGameSelect = (value: string) => {
    setSelectedGame(value);
    if (value) {
      const game = gamesWithPrinciples.find((g) => g.id === value);
      if (game) {
        navigate({ to: game.route });
      }
    }
  };

  return (
    <DefaultLayout meta={{ title: 'Trò Chơi TRIZ' }}>
      <div className="py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trò Chơi TRIZ
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá và học hỏi các nguyên tắc TRIZ thông qua các trò chơi thú
            vị
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-md mx-auto mb-12">
          <div className="flex items-center gap-3">
            <Search className="text-gray-400" />
            <AsyncSelect
              fetcher={fetchGames}
              preload={true}
              value={selectedGame}
              onChange={handleGameSelect}
              label="Tìm kiếm trò chơi"
              placeholder="Nhập tên trò chơi hoặc nguyên tắc..."
              width="400px"
              className="flex-1"
              getOptionValue={(game) => game.id}
              getDisplayValue={(game) => game.name}
              renderOption={(game) => (
                <div className="flex items-center gap-3">
                  <div className={game.color}>{game.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{game.name}</div>
                    <div className="text-sm text-gray-500">
                      {game.principleTitle}
                    </div>
                  </div>
                </div>
              )}
              filterFn={(game, query) => {
                const lowerQuery = query.toLowerCase();
                return (
                  game.name.toLowerCase().includes(lowerQuery) ||
                  game.description.toLowerCase().includes(lowerQuery) ||
                  (game.principleTitle?.toLowerCase().includes(lowerQuery) ??
                    false)
                );
              }}
              clearable={true}
              noResultsMessage="Không tìm thấy trò chơi nào"
            />
          </div>
        </div>

        {/* Games List */}
        <div className="max-w-5xl mx-auto space-y-6">
          {gamesWithPrinciples.map((game) => {
            return (
              <Card
                key={game.id}
                className="cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden group"
                onClick={() => handleGameClick(game.route)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Principle Image on the left */}
                  {game.principleImage ? (
                    <div className="md:w-64 md:flex-shrink-0 h-48 md:h-auto relative overflow-hidden bg-gray-100">
                      <img
                        src={game.principleImage}
                        alt={game.principleTitle}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div
                      className={`md:w-64 md:flex-shrink-0 h-48 md:h-auto bg-gradient-to-br ${game.bgGradient} flex items-center justify-center relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      <div className="text-white transform group-hover:scale-110 transition-transform duration-300">
                        {game.icon}
                      </div>
                    </div>
                  )}

                  {/* Information on the right */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {game.name}
                        </h3>
                        <p className="text-gray-600">{game.description}</p>
                      </div>
                      <div className={`${game.color} ml-4`}>{game.icon}</div>
                    </div>

                    {/* Principle Info */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">
                            Nguyên tắc TRIZ #{game.principleNumber}:{' '}
                            {game.principleTitle}
                          </div>
                          {principlesData.find(
                            (p) => p.number === game.principleNumber,
                          )?.description && (
                            <div className="text-sm text-gray-600 mt-2">
                              {
                                principlesData.find(
                                  (p) => p.number === game.principleNumber,
                                )?.description
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default GamesIndexPage;
