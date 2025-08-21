/**
 * Game Setup Component
 */

import DifficultySelector from './DifficultySelector';

const GameSetup = ({ difficulty, onDifficultyChange, onStartGame }) => {
  return (
    <div className="text-center max-w-2xl mx-auto bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Choose Your Challenge</h2>
        <p className="text-base sm:text-lg text-slate-600 font-medium">Select a difficulty level to begin</p>
      </div>
      
      <div className="mb-8 sm:mb-10">
        <DifficultySelector
          currentDifficulty={difficulty}
          onDifficultyChange={onDifficultyChange}
        />
      </div>

      <button
        onClick={onStartGame}
        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base sm:text-lg touch-manipulation"
        data-testid="start-game-btn"
      >
        🎮 Start Game
      </button>
    </div>
  );
};

export default GameSetup;
