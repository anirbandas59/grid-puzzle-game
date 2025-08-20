/**
 * Game Setup Component
 */

import DifficultySelector from './DifficultySelector';

const GameSetup = ({ difficulty, onDifficultyChange, onStartGame }) => {
  return (
    <div>
      <p className="text-gray-600 mb-4">Choose difficulty and Play!</p>
      <DifficultySelector
        currentDifficulty={difficulty}
        onDifficultyChange={onDifficultyChange}
      />

      <button
        onClick={onStartGame}
        className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 transition-colors"
        data-testid="start-game-btn"
      >
        Start Game
      </button>
    </div>
  );
};

export default GameSetup;
