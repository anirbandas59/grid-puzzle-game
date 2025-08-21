/**
 * Game Controls Component - Modern styled control buttons
 */

const GameControls = ({
  gameMode,
  onModeToggle,
  onConfirmSolution,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
      <button
        onClick={onModeToggle}
        disabled={disabled}
        className={`${
          disabled
            ? 'px-8 py-4 rounded-xl font-bold bg-slate-200 text-slate-500 cursor-not-allowed border-2 border-slate-300'
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-blue-600'
        }`}
        data-testid="mode-toggle-btn"
      >
        <span className="flex items-center gap-2">
          <span>{gameMode === 'remove' ? '✅' : '❌'}</span>
          <span>Switch to {gameMode === 'remove' ? 'Confirm' : 'Remove'} Mode</span>
        </span>
      </button>

      {gameMode === 'confirm' && (
        <button
          onClick={onConfirmSolution}
          disabled={disabled}
          className={`${
            disabled
              ? 'px-8 py-4 rounded-xl font-bold bg-slate-200 text-slate-500 cursor-not-allowed border-2 border-slate-300'
              : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-green-600 animate-pulse'
          }`}
          data-testid="confirm-solution-btn"
        >
          <span className="flex items-center gap-2">
            <span>🏆</span>
            <span>Confirm Solution</span>
          </span>
        </button>
      )}
    </div>
  );
};

export default GameControls;
