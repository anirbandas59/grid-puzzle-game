// Game Logic - Core puzzle generation and validation algorithms

/**
 * Main puzzle generation function
 * @param {string} difficulty = 'easy', 'medium', or 'hard'
 * @returns {Object} - { grid, targets, corePositions }
 */
export function generatePuzzle(difficulty) {
  const difficultySettings = {
    easy: { size: 4 },
    medium: { size: 5 },
    hard: { size: 6 },
  };

  const size = difficultySettings[difficulty].size;

  // Step 1: Generate random numbers in all cells
  const originalGrid = generateRandomGrid(size);

  // Step 2: Create strategic core placement
  const coreGrid = createStrategicCoreGrid(originalGrid, size);

  // Step 3: Calculate targets from core numbers
  const targets = calculateTargets(coreGrid);

  // Step 4: Create final grid with decoys
  const grid = addStrategicDecoys(coreGrid, originalGrid);

  // Step 5: Extract core positions
  const corePositions = extractCorePositions(coreGrid);

  return { grid, targets, corePositions };
}

/**
 * Generate grid filled random numbers 1-9
 * @param {number} size - Grid size (4, 5 or 6)
 * @returns {Array} - 2D array with random numbers
 */
function generateRandomGrid(size) {
  const grid = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(Math.floor(Math.random() * 9) + 1);
    }
    grid.push(row);
  }

  return grid;
}

/**
 * Create strategic core grid using constraint satisfaction
 * @param {Array} originalGrid - Grid with all random numbers
 * @param {number} size = Grid size
 * @returns {Array} - Grid with core numbers and zeros
 */
function createStrategicCoreGrid(originalGrid, size) {
  const coreGrid = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));

  // Step 1: Ensure minimum constraint - at least 1 core per row/column
  const guranteedCores = ensureMinimumConstraints(originalGrid, coreGrid, size);

  // Step 2: Add additional cores for complexity (30-50% of remaining cells)
  addComplexityCores(originalGrid, coreGrid, size, guranteedCores);

  // Step 3: Validate final constraints and fix if needed
  validateFinalConstraints(originalGrid, coreGrid, size);

  return coreGrid;
}

/**
 * Ensure minimum constraints: at least 1 core per row and column
 * @param {Array} originalGrid - Original grid with numbers
 * @param {Array} coreGrid - Core grid to modify
 * @param {number} size - Grid size
 * @returns {Set} - Set of positions used for guranteed cores
 */
function ensureMinimumConstraints(originalGrid, coreGrid, size) {
  const usedPositions = new Set();
  const rowHasCore = Array(size).fill(false);
  const colHasCore = Array(size).fill(false);

  // Strategy: Use a modified matching approach to avoid diagonal bias
  const positions = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      positions.push({ row: i, col: j });
    }
  }

  // Shuffle all positions to avoid systematic bias
  shuffleArray(positions);

  // First Pass: Try to place cores to satisfy both row and column constraints
  for (const { row, col } of positions) {
    if (!rowHasCore[row] && !colHasCore[col]) {
      coreGrid[row][col] = originalGrid[row][col];
      usedPositions.add(`${row},${col}`);
      rowHasCore[row] = true;
      colHasCore[col] = true;
    }
  }

  // Second pass: Handle any remaining rows without cores
  for (let i = 0; i < size; i++) {
    if (!rowHasCore[i]) {
      // Find a column that can accept another core
      for (let j = 0; j < size; j++) {
        if (coreGrid[i][j] === 0) {
          coreGrid[i][j] = originalGrid[i][j];
          usedPositions.add(`${i},${j}`);
          rowHasCore[i] = true;
          colHasCore[j] = true;
          break;
        }
      }
    }
  }

  // Third pass: Handle any remaining columns without cores
  for (let j = 0; j < size; j++) {
    if (!colHasCore[j]) {
      // Find a row that can accept another core
      for (let i = 0; i < size; i++) {
        if (coreGrid[i][j] === 0) {
          coreGrid[i][j] = originalGrid[i][j];
          usedPositions.add(`${i},${j}`);
          rowHasCore[i] = true;
          colHasCore[j] = true;
          break;
        }
      }
    }
  }

  return usedPositions;
}

/**
 * Add additional cores for puzzle complexity
 * @param {Array} originalGrid = Original grid with numbers
 * @param {Array} coreGrid - Core grid to modify
 * @param {number} size - Grid size
 * @returns {Set} guranteedCores - Positions already used for minimum constraints
 */
function addComplexityCores(originalGrid, coreGrid, size, guranteedCores) {
  const totalcells = size * size;
  const guranteedCount = guranteedCores.size;
  const remainingCells = totalcells - guranteedCount;

  // Add 30-50% of remaining cells as additional cores
  const additionalCores = Math.floor(
    remainingCells * (0.3 + Math.random() * 0.2)
  );

  // Get all empty positions
  const emptyPositions = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (coreGrid[i][j] === 0) {
        emptyPositions.push({ row: i, col: j });
      }
    }
  }

  // Shuffle and select positions for additional cores
  shuffleArray(emptyPositions);

  for (let i = 0; i < Math.min(additionalCores, emptyPositions.length); i++) {
    const { row, col } = emptyPositions[i];

    // Check if adding this core would violate constraints
    if (canAddCore(coreGrid, row, col, size)) {
      coreGrid[row][col] = originalGrid[row][col];
    }
  }
}

/**
 * Check if a core can be added without violating constraints
 * @param {Array} coreGrid - Current core grid
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {number} size - Grid size
 * @returns {boolean} - True if core can be safely added
 */
function canAddCore(coreGrid, row, col, size) {
  // Count current cores in this row and column
  let rowCores = 0;
  let colCores = 0;

  for (let j = 0; j < size; j++) {
    if (coreGrid[row][j] !== 0) rowCores++;
  }
  for (let i = 0; i < size; i++) {
    if (coreGrid[i][col] !== 0) colCores++;
  }

  // Ensure at least 1 empty cell remains in both row and column
  // Max cores = size - 1 (leaving empty for decoys)
  return rowCores < size - 1 && colCores < size - 1;
}

/**
 * Validate and fix final constraints after all core placement
 * @param {Array} originalGrid - Original grid with numbers
 * @param {Array} coreGrid - Core grid to validate and fix
 * @param {number} size - Grid size
 */
function validateFinalConstraints(originalGrid, coreGrid, size) {
  // Check each row - ensure at least 1 empty cell
  for (let i = 0; i < size; i++) {
    let rowCores = 0;
    let corePositions = [];

    for (let j = 0; j < size; j++) {
      if (coreGrid[i][j] !== 0) {
        rowCores++;
        corePositions.push[j];
      }
    }

    // If row is completely filled, remove one core randomly
    if (rowCores === size) {
      const randomIndex = Math.floor(Math.random() * corePositions.length);
      const colToRemove = corePositions[randomIndex];
      coreGrid[i][colToRemove] = 0;
    }
  }

  // Check each column - ensure at least 1 empty cell
  for (let j = 0; j < size; j++) {
    let colCores = 0;
    let corePositions = [];

    for (let i = 0; i < size; i++) {
      if (coreGrid[i][j] !== 0) {
        colCores++;
        corePositions.push(i);
      }
    }

    // If column is completely filled, remove one core randomly
    if (colCores === size) {
      const randomIndex = Math.floor(Math.random() * corePositions.length);
      const rowToRemove = corePositions[randomIndex];
      coreGrid[rowToRemove][j] = 0;
    }
  }

  // Final check: ensure every row and column has at least 1 core
  ensureMinimumCoresStillExist(originalGrid, coreGrid, size);
}

/**
 * Ensure minimum cores still exist after validation fixes
 *  @param {Array} originalGrid - Original grid with numbers
 * @param {Array} coreGrid - Core grid to validate and fix
 * @param {number} size - Grid size
 */
function ensureMinimumCoresStillExist(originalGrid, coreGrid, size) {
  // Check rows
  for (let i = 0; i < size; i++) {
    let hasCore = false;
    for (let j = 0; j < size; j++) {
      if (coreGrid[i][j] !== 0) {
        hasCore = true;
        break;
      }
    }

    // if row has no cores, add one randomly
    if (!hasCore) {
      const randomCol = Math.floor(Math.random() * size);
      coreGrid[i][randomCol] = originalGrid[i][randomCol];
    }
  }

  // Check columns
  for (let j = 0; j < size; j++) {
    let hasCore = false;
    for (let i = 0; i < size; i++) {
      if (coreGrid[i][j] !== 0) {
        hasCore = true;
        break;
      }
    }

    // If column has no cores, add one randomly
    if (!hasCore) {
      const randomRow = Math.floor(Math.random() * size);
      coreGrid[randomRow][j] = originalGrid[randomRow][j];
    }
  }
}

/**
 * Add strategic decoys to empty positions
 * @param {Array} coreGrid - Grid with core numbers and zeros
 * @param {Array} originalGrid - Original grid for reference
 * @returns {Array} - Complete grid with cores and decoys
 */
function addStrategicDecoys(coreGrid, originalGrid) {
  const size = coreGrid.length;
  const finalGrid = coreGrid.map(row => [...row]); // Copy core grid

  // Collect all core numbers for strategic decoy placement
  const coreNumbers = new Set();
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (coreGrid[i][j] !== 0) {
        coreNumbers.add(coreGrid[i][j]);
      }
    }
  }

  // Fill empty positions with decoys
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (finalGrid[i][j] === 0) {
        const decoyStrategy = Math.random();

        if (decoyStrategy < 0.4 && coreNumbers.size > 0) {
          // 40% chance: Use a core number as decoy
          const coreNumbersArray = Array.from(coreNumbers);
          finalGrid[i][j] =
            coreNumbersArray[
              Math.floor(Math.random() * coreNumbersArray.length)
            ];
        } else if (decoyStrategy < 0.6) {
          // 20% chance: Use original number
          finalGrid[i][j] = originalGrid[i][j];
        } else {
          // 40% chance: Use random number
          finalGrid[i][j] = Math.floor(Math.random() * 9) + 1;
        }
      }
    }
  }

  return finalGrid;
}

/**
 * Calculate target sums for rows and columns
 * @param {Array} grid - 2D grid with zeros and numbers
 * @returns {Object} - { rows: [], cols: [] }
 */
function calculateTargets(grid) {
  const size = grid.length;
  const targets = { rows: [], cols: [] };

  // Calculate row targers
  for (let i = 0; i < size; i++) {
    let rowSum = 0;
    for (let j = 0; j < size; j++) {
      rowSum += grid[i][j];
    }
    targets.rows.push(rowSum);
  }

  // Calculate column targers
  for (let i = 0; i < size; i++) {
    let colSum = 0;
    for (let j = 0; j < size; j++) {
      colSum += grid[j][i];
    }
    targets.cols.push(colSum);
  }

  return targets;
}

/**
 * Extract positions of core numbers (non-zero values)
 * @param {Array} grid - 2D grid with zeros and numbers
 * @returns {Set} - Set of position string "row, cell"
 */
function extractCorePositions(grid) {
  const corePositions = new Set();

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] !== 0) {
        corePositions.add(`${i},${j}`);
      }
    }
  }

  return corePositions;
}

/**
 * Validate if current solution is correct
 * @param {Array} grid - Current grid state
 * @param {Object} targets - Target sums { rows: [], cols: []}
 * @param {Set} markedForRemoval = Set of marked positions "row, col"
 * @returns {boolean} - True if solution is correct
 */
export function validateSolution(grid, targets, markedForRemoval) {
  const size = grid.length;

  // Check row sums
  for (let i = 0; i < size; i++) {
    let rowSum = 0;
    for (let j = 0; j < size; j++) {
      const position = `${i},${j}`;
      if (!markedForRemoval.has(position)) {
        rowSum += grid[i][j];
      }
    }
    if (rowSum !== targets.rows[i]) return false;
  }

  // Check column sums
  for (let j = 0; j < size; j++) {
    let colSum = 0;
    for (let i = 0; i < size; i++) {
      const position = `${i},${j}`;
      if (!markedForRemoval.has(position)) {
        colSum += grid[i][j];
      }
    }
    if (colSum !== targets.cols[j]) return false;
  }

  return true;
}

/**
 * Calculate current sums of remaining numbers
 * @param {Array} grid - Current grid state
 * @param {Set} markedForRemoval - Set of marked positions "row,col"
 * @returns {Object} - { rows: [], cols: [] }
 */
export function calculateCurrentSums(grid, markedForRemoval) {
  const size = grid.length;
  const sums = { rows: [], cols: [] };

  // Check row sums
  for (let i = 0; i < size; i++) {
    let rowSum = 0;
    for (let j = 0; j < size; j++) {
      const position = `${i},${j}`;
      if (!markedForRemoval.has(position)) {
        rowSum += grid[i][j];
      }
    }
    sums.rows.push(rowSum);
  }

  // Check column sums
  for (let j = 0; j < size; j++) {
    let colSum = 0;
    for (let i = 0; i < size; i++) {
      const position = `${i},${j}`;
      if (!markedForRemoval.has(position)) {
        colSum += grid[i][j];
      }
    }
    sums.cols.push(colSum);
  }

  return sums;
}

/**
 * Utility function to shuffle an array
 * @param {Array} array - Array to shuffle
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
