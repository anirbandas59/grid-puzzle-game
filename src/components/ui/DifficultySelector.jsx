/**
 * Difficulty selector
 */


const DifficultySelector = ({
  currentDifficulty,
  onDifficultyChange,
  disabled = false,
}) => {
  const difficultyOptions = [
    { key: 'easy', label: '4×4 Grid', size: 4, color: 'emerald', icon: '🟢', desc: 'Perfect for beginners' },
    { key: 'medium', label: '5×5 Grid', size: 5, color: 'amber', icon: '🟡', desc: 'Moderate challenge' },
    { key: 'hard', label: '6×6 Grid', size: 6, color: 'red', icon: '🔴', desc: 'Expert level' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      {difficultyOptions.map(({ key, label, icon, desc }) => (
        <button
          key={key}
          onClick={() => onDifficultyChange(key)}
          disabled={disabled}
          className={`group relative p-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 min-w-[160px] ${
            currentDifficulty === key
              ? (key === 'easy' ? 'bg-emerald-600 text-white shadow-xl border-2 border-emerald-700' :
                 key === 'medium' ? 'bg-amber-600 text-white shadow-xl border-2 border-amber-700' :
                 'bg-red-600 text-white shadow-xl border-2 border-red-700')
              : disabled
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : (key === 'easy' ? 'bg-white text-slate-700 hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-300 shadow-md hover:shadow-lg' :
                 key === 'medium' ? 'bg-white text-slate-700 hover:bg-amber-50 border-2 border-slate-200 hover:border-amber-300 shadow-md hover:shadow-lg' :
                 'bg-white text-slate-700 hover:bg-red-50 border-2 border-slate-200 hover:border-red-300 shadow-md hover:shadow-lg')
          }`}
          data-testid={`difficulty-${key}`}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <span className="text-lg font-bold">{label}</span>
            <span className={`text-sm opacity-75 ${
              currentDifficulty === key ? 'text-white' : 'text-slate-500'
            }`}>
              {desc}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
