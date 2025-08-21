/**
 * Target Display Component (for row/column targets)
 */


const TargetDisplay = ({ value, type = 'row' }) => {
  const targetClass =
    type === 'row'
      ? 'w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center font-bold text-blue-900 mr-2 sm:mr-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl border-2 border-blue-300 shadow-md'
      : 'w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center font-bold text-blue-900 mb-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl border-2 border-blue-300 shadow-md';

  return (
    <div className={targetClass} data-testid={`target-${type}-${value}`}>
      <span className="text-sm sm:text-lg font-black">{value}</span>
    </div>
  );
};

export default TargetDisplay;
