/**
 * Difficulty selector
 */

const DifficultySelector = ({
  currentDifficulty,
  onDifficultyChange,
  disabled = false,
}) => {
  const difficultyOptions = [
    { key: 'easy', label: '4x4 Grid', size: 4 },
    { key: 'medium', label: '5x5 Grid', size: 5 },
    { key: 'hard', label: '6x6 Grid', size: 6 },
  ];

  return (
    <div className="flex justify-center gap-4 mb-6">
      {difficultyOptions.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onDifficultyChange(key)}
          disabled={disabled}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            currentDifficulty === key
              ? 'bg-blue-600 text-white'
              : disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          data-testid={`difficulty-${key}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
