/**
 * Game Status Display Component
 */

const GameStatus = ({ lifelines, gameMode }) => {
  return (
    <div className="flex justify-center items-center gap-6 mb-4">
      <div className="text-lg">
        <span className="font-medium">Lifelines:</span>
        <span
          className={`ml-2 font-bold ${
            lifelines <= 1
              ? 'text-red-600'
              : lifelines === 2
              ? 'text-orange-600'
              : 'text-green-600'
          }`}
        >
          {lifelines}
        </span>
      </div>

      <div className="text-lg">
        <span className="font-medium">Mode:</span>
        <span
          className={`ml-2 font-bold ${
            gameMode === 'remove' ? 'text-orange-600' : 'text-purple-600'
          }`}
        >
          {gameMode.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default GameStatus;
