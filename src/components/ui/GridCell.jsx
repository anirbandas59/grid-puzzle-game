/**
 * Individual Grid cell Component
 */


const GridCell = ({
  value,
  row,
  col,
  isRemoved,
  showError,
  gameMode,
  onClick,
  disabled = false,
}) => {
  const getCustomCellClass = () => {
    let classes = 'w-14 h-14 flex items-center justify-center font-bold text-xl transition-all duration-300 cursor-pointer rounded-xl border-2 shadow-sm hover:shadow-md transform hover:scale-105';
    
    if (disabled) {
      classes += ' cursor-not-allowed bg-slate-200 text-slate-500 border-slate-300';
    } else if (isRemoved) {
      classes += ' bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200 opacity-50 scale-95';
    } else if (showError) {
      classes += ' bg-gradient-to-br from-red-500 to-red-600 text-white animate-shake border-red-700 shadow-lg';
    } else if (gameMode === 'remove') {
      classes += ' bg-gradient-to-br from-white to-slate-50 hover:from-blue-50 hover:to-blue-100 text-slate-900 border-slate-300 hover:border-blue-400 hover:shadow-lg';
    } else {
      classes += ' bg-gradient-to-br from-white to-slate-50 hover:from-purple-50 hover:to-purple-100 text-slate-900 border-slate-300 hover:border-purple-400 hover:shadow-lg';
    }

    return classes;
  };

  const handleClick = () => {
    if (!disabled && !isRemoved) {
      onClick(row, col);
    }
  };

  return (
    <div
      className={getCustomCellClass()}
      onClick={handleClick}
      data-testid={`cell-${row}-${col}`}
    >
      <span className={isRemoved ? 'opacity-0' : 'opacity-100 transition-opacity duration-200'}>
        {value}
      </span>
    </div>
  );
};

export default GridCell;
