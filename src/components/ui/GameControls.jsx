/**
 * Game Controls Component
 */

const GameControls = ({
  gameMode,
  onModeToggle,
  onConfirmSolution,
  disabled = false,
}) => {
  return (
    <div className="flex justify-center gap-4 mb-6">
      <button
        onClick={onModeToggle}
        disabled={disabled}
        className={`px-4 py-2 rounded-md font-medium transition-colors ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        data-testid="mode-toggle-btn"
      >
        Switch to {gameMode === 'remove' ? ' Confirm' : 'Remove'} Mode
      </button>

      {gameMode === 'confirm' && (
        <button
          onClick={onConfirmSolution}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
          data-testid="confirm-solution-btn"
        >
          Confirm Solution
        </button>
      )}
    </div>
  );
};

export default GameControls;
