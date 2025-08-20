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
  const getCellClass = () => {
    let baseClass =
      'w-12 h-12 border border-gray-300 flex items-center justify-center text-lg font-semibold transition-colors';

    if (disabled) {
      baseClass += ' cursor-not-allowed bg-gray-100';
    } else if (isRemoved) {
      baseClass += ' bg-gray-100 cursor-not-allowed';
    } else if (showError) {
      baseClass += ' bg-red-500 text-white cursor-pointer animate-bounce';
    } else if (gameMode === 'remove') {
      baseClass += ' bg-white hover:bg-blue-50 cursor-pointer';
    } else {
      baseClass += ' bg-white cursor-pointer';
    }

    return baseClass;
  };

  const handleClick = () => {
    if (!disabled && !isRemoved) {
      onClick(row, col);
    }
  };

  return (
    <div
      className={getCellClass()}
      onClick={handleClick}
      data-testid={`cell-${row}-${col}`}
      style={
        showError
          ? {
              animation: 'shake 0.5s ease-in-out',
            }
          : {}
      }
    >
      {isRemoved ? '' : value}

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </div>
  );
};

export default GridCell;
