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
    return <div className="text-center text-gray-500">No grid available</div>;
  }

  //   const size = grid.length;

  return (
    <div className="inline-block bg-gray-200 p-4 rounded-lg">
      {/* Column targets header */}
      <div className="flex mb-2">
        <div className="w-12"></div> {/* Empty corner space */}
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
