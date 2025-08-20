/**
 * Game Results Component
 */

const GameResults = ({ status, onPlayAgain, onTryAgain }) => {
  if (status === 'won') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 You Won!</h2>

        <button
          onClick={onPlayAgain}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          data-testid="play-again-btn"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (status === 'lost') {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">💀 Game Over!</h2>
        <p className="text-gray-600 mb-4">You lost the game.</p>
        <button
          onClick={onTryAgain}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          data-testid="try-again-btn"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default GameResults;
