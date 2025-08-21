/**
 * Game Controls Component - Modern toggle switch and confirm button
 */

const GameControls = ({
  gameMode,
  onModeToggle,
  onConfirmSolution,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col items-center gap-6 mb-8">
      {/* Toggle Switch */}
      <div className="flex items-center gap-4">
        <span className={`text-lg font-semibold transition-colors ${
          gameMode === 'remove' ? 'text-orange-600' : 'text-slate-400'
        }`}>❌ Erase</span>
        
        <button
          onClick={onModeToggle}
          disabled={disabled}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            disabled 
              ? 'bg-slate-300 cursor-not-allowed'
              : gameMode === 'remove'
              ? 'bg-orange-500 focus:ring-orange-500'
              : 'bg-purple-500 focus:ring-purple-500'
          }`}
          data-testid="mode-toggle-btn"
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              gameMode === 'remove' ? 'translate-x-1' : 'translate-x-9'
            }`}
          />
        </button>
        
        <span className={`text-lg font-semibold transition-colors ${
          gameMode === 'confirm' ? 'text-purple-600' : 'text-slate-400'
        }`}>✅ Confirm</span>
      </div>

      {/* Confirm Solution Button */}
      {gameMode === 'confirm' && (
        <button
          onClick={onConfirmSolution}
          disabled={disabled}
          className={`${
            disabled
              ? 'px-10 py-4 rounded-xl font-bold bg-slate-200 text-slate-500 cursor-not-allowed border-2 border-slate-300'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-10 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-green-600 animate-pulse'
          }`}
          data-testid="confirm-solution-btn"
        >
          <span className="flex items-center gap-3">
            <span>🏆</span>
            <span className="text-lg">Submit Solution</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default GameControls;
