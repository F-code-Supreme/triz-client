import { RotateCcw, Clock } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import MemoryMatchStarted from '@/components/ui/memory-match-started';
import { principles } from '@/components/ui/principle-hero-section';

interface MemoryCard {
  id: number;
  image?: string;
  label?: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface LapTime {
  lap: number;
  time: number;
  moves: number;
}

const MemoryCardItem: React.FC<{
  card: MemoryCard;
  isFlipped: boolean;
  onClick: (id: number) => void;
  disabled: boolean;
}> = ({ card, isFlipped, onClick, disabled }) => {
  return (
    <button
      key={card.id}
      type="button"
      aria-label={card.label ? `Card ${card.label}` : `Card ${card.id}`}
      className="aspect-square transition-transform duration-300 cursor-pointer hover:scale-105"
      style={{ perspective: 1000 }}
      onClick={() => onClick(card.id)}
      disabled={disabled}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'none',
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg border border-white/30 bg-gradient-to-br from-sky-200 to-blue-500 text-white font-extrabold"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <span style={{ fontSize: '2rem' }}>?</span>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center rounded-lg border border-white/30 bg-white text-gray-800"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {card.image ? (
            <img
              src={card.image}
              alt={card.label || `Principle ${card.id}`}
              className="max-h-full max-w-full object-contain p-2"
              style={{
                transform: 'scale(0.9)',
              }}
            />
          ) : (
            <span style={{ fontSize: '2rem' }}>
              {card.label || `Principle ${card.id}`}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

const MemoryMatchGame: React.FC = () => {
  const [currentLap, setCurrentLap] = useState<number>(1);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [lapStartTime, setLapStartTime] = useState<number | null>(null);
  const [lapTime, setLapTime] = useState<number>(0);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && lapStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - lapStartTime) / 1000);
        setLapTime(elapsed);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, lapStartTime]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0 && !gameComplete) {
      completeLap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched, cards, gameComplete]);

  const initializeLap = (lap: number): void => {
    // Use exported `principles` as the source for card pairs.
    // Each principle has { id, image } — we create label fallback "Principle X".
    const selectedPrinciples = principles.slice(0, 8);
    const principleItems = [...selectedPrinciples, ...selectedPrinciples]
      .sort(() => Math.random() - 0.5)
      .map((p, index) => ({
        id: index,
        image: p.image,
        label: `Principle ${p.id}`,
        isFlipped: false,
        isMatched: false,
      })) as MemoryCard[];

    const shuffledCards: MemoryCard[] = principleItems;

    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setLapTime(0);
    setLapStartTime(Date.now());
    setIsRunning(true);
    setCurrentLap(lap);
  };

  const completeLap = (): void => {
    setIsRunning(false);
    if (!lapStartTime) return;

    const finalLapTime = Math.floor((Date.now() - lapStartTime) / 1000);
    const newLapTimes: LapTime[] = [
      ...lapTimes,
      { lap: currentLap, time: finalLapTime, moves },
    ];
    setLapTimes(newLapTimes);

    const newTotalTime = newLapTimes.reduce((sum, lt) => sum + lt.time, 0);
    setTotalTime(newTotalTime);

    setGameComplete(true);
  };

  const handleCardClick = (cardId: number): void => {
    if (
      flipped.length === 2 ||
      flipped.includes(cardId) ||
      matched.includes(cardId)
    ) {
      return;
    }

    const newFlipped = [...flipped, cardId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((card) => card.id === firstId);
      const secondCard = cards.find((card) => card.id === secondId);

      if (firstCard && secondCard && firstCard.image === secondCard.image) {
        setMatched([...matched, firstId, secondId]);
        setFlipped([]);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const isCardFlipped = (cardId: number): boolean => {
    return flipped.includes(cardId) || matched.includes(cardId);
  };

  const startGame = (): void => {
    setGameStarted(true);
    setGameComplete(false);
    setLapTimes([]);
    setTotalTime(0);
    initializeLap(1);
  };

  const resetGame = (): void => {
    setLapTimes([]);
    setTotalTime(0);
    setGameComplete(false);
    setGameStarted(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return <MemoryMatchStarted startGame={startGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Memory Match Challenge
          </h1>
          <div className="flex justify-center gap-4 text-white text-lg flex-wrap">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">{formatTime(lapTime)}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <span className="font-semibold">Moves: {moves}</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
              <span className="font-semibold">
                Matched: {matched.length / 2}/8
              </span>
            </div>
          </div>
        </div>

        {gameComplete && (
          <Alert className="mb-6 bg-green-500 border-green-600 text-white">
            <AlertDescription className="ml-2">
              <div className="text-lg font-semibold">
                🎉 Game Complete! Time: {formatTime(totalTime)} - {moves} moves
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div
          className="grid gap-4 mb-6 max-w-md mx-auto"
          style={{
            gridTemplateColumns: `repeat(4, minmax(0, 1fr))`,
          }}
        >
          {cards.map((card) => (
            <MemoryCardItem
              key={card.id}
              card={card}
              isFlipped={isCardFlipped(card.id)}
              onClick={handleCardClick}
              disabled={matched.includes(card.id)}
            />
          ))}
        </div>

        <div className="text-center space-y-3">
          <div>
            <Button
              onClick={resetGame}
              size="lg"
              className="bg-white text-sky-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Restart Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatchGame;
