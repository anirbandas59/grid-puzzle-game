import { useState } from 'react';
import { generatePuzzle, validateSolution } from '../utils/GameLogic';
import GameInterface from './ui/GameInterface';

const GridGame = () => {
  // Game State
  const [difficulty, setDifficulty] = useState('easy');
  const [gameState, setGameState] = useState({
    grid: [],
    targets: { rows: [], cols: [] },
    corePositions: new Set(),
    removedPositions: new Set(), // Track permanently removed numbers
    errorPosition: null, // Track position showing error animation
    mode: 'remove', // 'remove' or 'confirm'
    lifelines: 3,
    status: 'setup', // 'setup', 'playing', 'won', 'lost'
  });

  // Start new Game
  const startGame = () => {
    const { grid, targets, corePositions } = generatePuzzle(difficulty);

    setGameState({
      grid,
      targets,
      corePositions,
      removedPositions: new Set(),
      errorPosition: null,
      mode: 'remove',
      lifelines: 3,
      status: 'playing',
    });
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (gameState.status !== 'playing' || gameState.mode !== 'remove') return;

    const position = `${row},${col}`;

    // Skip if already removed
    if (gameState.removedPositions.has(position)) return;

    // Check if this is a core position (should not be removed)
    if (gameState.corePositions.has(position)) {
      // Core number clicked - show error animation and lose lifeline
      const newLifelines = gameState.lifelines - 1;

      setGameState(prev => ({
        ...prev,
        errorPosition: position,
        lifelines: newLifelines,
        status: newLifelines === 0 ? 'lost' : 'playing',
      }));

      // Clear error animation after 500ms
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          errorPosition: null,
        }));
      }, 500);
    } else {
      // Decoy number - remove it permanently
      const newRemovedPositions = new Set(gameState.removedPositions);
      newRemovedPositions.add(position);

      setGameState(prev => ({
        ...prev,
        removedPositions: newRemovedPositions,
      }));
    }
  };

  // Toggle game mode
  const toggleMode = () => {
    if (gameState.status !== 'playing') return;

    setGameState(prev => ({
      ...prev,
      mode: prev.mode === 'remove' ? 'confirm' : 'remove',
    }));
  };

  // Confirm solution
  const confirmSolution = () => {
    if (gameState.status !== 'playing' || gameState.mode !== 'confirm') return;

    // Validate solution by checking if remaining numbers match targers
    // const size = gameState.grid.length;
    const isValid = validateSolution(
      gameState.grid,
      gameState.targets,
      gameState.removedPositions
    );

    setGameState(prev => ({
      ...prev,
      status: isValid ? 'won' : 'lost',
    }));
  };

  // Handle play again or try again
  const handleResetGame = () => {
    setGameState(prev => ({
      ...prev,
      status: 'setup',
    }));
  };

  return (
    <GameInterface
      gameState={gameState}
      difficulty={difficulty}
      onDifficultyChange={setDifficulty}
      onStartGame={startGame}
      onCellClick={handleCellClick}
      onModeToggle={toggleMode}
      onConfirmSolution={confirmSolution}
      onPlayAgain={handleResetGame}
      onTryAgain={handleResetGame}
    />
  );
};

export default GridGame;
