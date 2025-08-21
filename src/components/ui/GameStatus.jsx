/**
 * Game Status Display Component
 */


const GameStatus = ({ lifelines, gameMode }) => {
  const getLifelineColor = (count) => {
    if (count <= 1) return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: '♥️' };
    if (count === 2) return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', icon: '♥️' };
    return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', icon: '♥️' };
  };

  const getModeInfo = (mode) => {
    return mode === 'remove' 
      ? { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', icon: '❌', label: 'Remove' }
      : { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: '✅', label: 'Confirm' };
  };

  const lifelineStyle = getLifelineColor(lifelines);
  const modeStyle = getModeInfo(gameMode);

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-8 p-6 bg-white rounded-2xl shadow-lg border-2 border-slate-200">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-slate-900">Lifelines</span>
        <div className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xl border-2 ${lifelineStyle.bg} ${lifelineStyle.text} ${lifelineStyle.border}`}>
          <span>{lifelineStyle.icon}</span>
          <span>{lifelines}</span>
        </div>
      </div>

      <div className="hidden sm:block h-12 w-px bg-slate-300"></div>

      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-slate-900">Mode</span>
        <div className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-lg border-2 uppercase tracking-wider ${modeStyle.bg} ${modeStyle.text} ${modeStyle.border}`}>
          <span>{modeStyle.icon}</span>
          <span>{modeStyle.label}</span>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
