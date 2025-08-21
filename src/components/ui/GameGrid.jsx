/**
 * Game Grid component
 */

import GridCell from './GridCell';
import TargetDisplay from './TargetDisplay';

const GameGrid = ({
  grid,
  targets,
  removedPositions,
  errorPosition,
  gameMode,
  onCellClick,
  disabled = false,
}) => {
  if (!grid || grid.length === 0) {
    return <div className="text-center text-slate-600">No grid available</div>;
  }

  return (
    <div className="inline-block bg-white p-6 rounded-2xl shadow-2xl border-2 border-slate-200 backdrop-blur-sm">
      {/* Column targets header */}
      <div className="flex mb-2">
        <div className="w-14 h-14 mr-3"></div> {/* Empty corner space */}
        {targets.cols.map((target, index) => (
          <TargetDisplay
            key={`col-target-${index}`}
            value={target}
            type="column"
          />
        ))}
      </div>

      {/* Grid rows with row targets */}
      {grid.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex">
          {/* Row target */}
          <TargetDisplay value={targets.rows[rowIndex]} type="row" />
          {/* Grid cells */}
          {row.map((cell, colIndex) => {
            const position = `${rowIndex},${colIndex}`;
            const isRemoved = removedPositions.has(position);
            const showError = errorPosition === position;

            return (
              <GridCell
                key={`cell-${rowIndex}-${colIndex}`}
                value={cell}
                row={rowIndex}
                col={colIndex}
                isRemoved={isRemoved}
                showError={showError}
                gameMode={gameMode}
                onClick={onCellClick}
                disabled={disabled}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
