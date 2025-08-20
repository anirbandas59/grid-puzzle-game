/**
 *
 * Target Display Component (for row/column targets)
 */
const TargetDisplay = ({ value, type = 'row' }) => {
  const targetClass =
    type === 'row'
      ? 'w-12 h-12 flex items-center justify-center font-bold text-blue-600 mr-2'
      : 'w-12 h-8 flex items-center justify-center font-bold text-blue-600';

  return (
    <div className={targetClass} data-testid={`target-${type}-${value}`}>
      {value}
    </div>
  );
};

export default TargetDisplay;
