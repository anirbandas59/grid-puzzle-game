/**
 * Main Game Interface Component
 */

import GameControls from './GameControls';
import GameGrid from './GameGrid';
import GameInstructions from './GameInstructions';
import GameResults from './GameResults';
import GameSetup from './GameSetup';
import GameStatus from './GameStatus';

const GameInterface = ({
  gameState,
  difficulty,
  onDifficultyChange,
  onStartGame,
  onCellClick,
  onModeToggle,
  onConfirmSolution,
  onPlayAgain,
  onTryAgain,
}) => {
  const {
    status,
    grid,
    targets,
    removedPositions,
    errorPosition,
    mode,
    lifelines,
  } = gameState;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        {/* Game Status Based Content */}
        {status === 'setup' && (
          <GameSetup
            difficulty={difficulty}
            onDifficultyChange={onDifficultyChange}
            onStartGame={onStartGame}
          />
        )}

        {status === 'playing' && (
          <>
            <GameStatus lifelines={lifelines} gameMode={mode} />

            <GameControls
              gameMode={mode}
              onModeToggle={onModeToggle}
              onConfirmSolution={onConfirmSolution}
            />
          </>
        )}

        {(status === 'won' || status === 'lost') && (
          <GameResults
            status={status}
            onPlayAgain={onPlayAgain}
            onTryAgain={onTryAgain}
          />
        )}
      </div>

      {/* Game Grid */}
      {status === 'playing' && (
        <div className="flex justify-center">
          <GameGrid
            grid={grid}
            targets={targets}
            removedPositions={removedPositions}
            errorPosition={errorPosition}
            gameMode={mode}
            onCellClick={onCellClick}
            disabled={status !== 'playing'}
          />
        </div>
      )}

      {/* Instructions */}
      {status === 'playing' && <GameInstructions />}
    </div>
  );
};

export default GameInterface;
