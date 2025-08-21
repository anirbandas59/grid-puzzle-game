/**
 * Main Game Interface Component
 */

import { useState } from 'react';
import GameControls from './GameControls';
import GameGrid from './GameGrid';
import GameInstructions from './GameInstructions';
import GameResults from './GameResults';
import GameSetup from './GameSetup';
import GameStatus from './GameStatus';
import Modal from './Modal';

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
  const [showInstructions, setShowInstructions] = useState(false);
  
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
      {/* Help Button - Fixed position */}
      <button
        onClick={() => setShowInstructions(true)}
        className="fixed top-6 right-6 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40"
        aria-label="Show instructions"
      >
        💡
      </button>

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

      {/* Instructions Modal */}
      <Modal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="How to Play"
      >
        <GameInstructions />
      </Modal>
    </div>
  );
};

export default GameInterface;
