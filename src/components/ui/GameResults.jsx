/**
 * Game Results Component
 */


const GameResults = ({ status, onPlayAgain, onTryAgain }) => {
  if (status === 'won') {
    return (
      <div className="text-center p-10 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 rounded-2xl border-2 border-green-300 shadow-2xl max-w-md mx-auto">
        <div className="mb-8">
          <div className="text-8xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-4xl font-bold text-green-900 mb-4 tracking-tight">Victory!</h2>
          <p className="text-xl text-green-800 font-medium leading-relaxed">Amazing! You successfully solved the puzzle with skill and strategy!</p>
        </div>

        <button
          onClick={onPlayAgain}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          data-testid="play-again-btn"
        >
          🎮 Play Again
        </button>
      </div>
    );
  }

  if (status === 'lost') {
    return (
      <div className="text-center p-10 bg-gradient-to-br from-red-50 via-rose-50 to-red-100 rounded-2xl border-2 border-red-300 shadow-2xl max-w-md mx-auto">
        <div className="mb-8">
          <div className="text-8xl mb-4">😔</div>
          <h2 className="text-4xl font-bold text-red-900 mb-4 tracking-tight">Game Over!</h2>
          <p className="text-xl text-red-800 font-medium leading-relaxed">Don't give up! Every puzzle is solvable with the right strategy.</p>
        </div>
        
        <button
          onClick={onTryAgain}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
          data-testid="try-again-btn"
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default GameResults;
