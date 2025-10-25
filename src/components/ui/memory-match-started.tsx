import { Button } from '@/components/ui/button';

const MemoryMatchStarted = ({ startGame }: { startGame: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-700 p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center">
          <div className="mb-5">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Memory Match Challenge
            </h1>
            <p className="text-md text-gray-600">
              Test your memory with this challenging game!
            </p>
          </div>

          <div className="space-y-6 mb-10 text-left max-w-md mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                <span className="text-3xl">🎯</span> How to Play
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span>1.</span>
                  <span>Click on cards to flip them </span>
                </li>
                <li className="flex items-start gap-3">
                  <span>2.</span>
                  <span>Find matching</span>
                </li>
                <li className="flex items-start gap-3">
                  <span>3.</span>
                  <span>Complete all pairs to finish the game</span>
                </li>
                <li className="flex items-start gap-3">
                  <span>4.</span>
                  <span>Complete the game as fast as you can!</span>
                </li>
              </ul>
            </div>
          </div>

          <Button
            onClick={startGame}
            size="lg"
            className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white font-bold px-12 py-8 text-2xl rounded-2xl shadow-lg transform transition hover:scale-105"
          >
            🚀 Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemoryMatchStarted;
