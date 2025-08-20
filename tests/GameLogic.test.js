import { describe, it, expect, beforeEach } from 'vitest';
import { generatePuzzle, validateSolution, calculateCurrentSums } from '../src/utils/GameLogic.js';

describe('GameLogic - Puzzle Generation', () => {
  describe('Basic Constraints', () => {
    it('should generate puzzle with correct grid size for each difficulty', () => {
      const easyPuzzle = generatePuzzle('easy');
      const mediumPuzzle = generatePuzzle('medium');
      const hardPuzzle = generatePuzzle('hard');

      expect(easyPuzzle.grid).toHaveLength(4);
      expect(easyPuzzle.grid[0]).toHaveLength(4);
      expect(mediumPuzzle.grid).toHaveLength(5);
      expect(mediumPuzzle.grid[0]).toHaveLength(5);
      expect(hardPuzzle.grid).toHaveLength(6);
      expect(hardPuzzle.grid[0]).toHaveLength(6);
    });

    it('should generate grids with numbers between 1-9', () => {
      const puzzle = generatePuzzle('easy');
      
      for (let i = 0; i < puzzle.grid.length; i++) {
        for (let j = 0; j < puzzle.grid[i].length; j++) {
          expect(puzzle.grid[i][j]).toBeGreaterThanOrEqual(1);
          expect(puzzle.grid[i][j]).toBeLessThanOrEqual(9);
        }
      }
    });

    it('should have correct target arrays length', () => {
      const puzzle = generatePuzzle('medium');
      expect(puzzle.targets.rows).toHaveLength(5);
      expect(puzzle.targets.cols).toHaveLength(5);
    });

    it('should ensure at least one core position per row and column', () => {
      const puzzle = generatePuzzle('hard');
      const size = puzzle.grid.length;
      
      // Check rows
      for (let i = 0; i < size; i++) {
        let hasCore = false;
        for (let j = 0; j < size; j++) {
          if (puzzle.corePositions.has(`${i},${j}`)) {
            hasCore = true;
            break;
          }
        }
        expect(hasCore).toBe(true);
      }

      // Check columns
      for (let j = 0; j < size; j++) {
        let hasCore = false;
        for (let i = 0; i < size; i++) {
          if (puzzle.corePositions.has(`${i},${j}`)) {
            hasCore = true;
            break;
          }
        }
        expect(hasCore).toBe(true);
      }
    });

    it('should have reasonable core position count (30-80% of total cells)', () => {
      const puzzle = generatePuzzle('medium');
      const totalCells = puzzle.grid.length * puzzle.grid.length;
      const coreCount = puzzle.corePositions.size;
      const percentage = (coreCount / totalCells) * 100;

      expect(percentage).toBeGreaterThanOrEqual(30);
      expect(percentage).toBeLessThanOrEqual(80);
    });
  });

  describe('Solvability', () => {
    it('should generate puzzles with valid solutions', () => {
      for (let i = 0; i < 5; i++) {
        const puzzle = generatePuzzle('easy');
        
        // Create the correct solution by removing all non-core positions
        const solution = new Set();
        for (let row = 0; row < puzzle.grid.length; row++) {
          for (let col = 0; col < puzzle.grid.length; col++) {
            const position = `${row},${col}`;
            if (!puzzle.corePositions.has(position)) {
              solution.add(position);
            }
          }
        }

        const isValid = validateSolution(puzzle.grid, puzzle.targets, solution);
        expect(isValid).toBe(true);
      }
    });

    it('should ensure at least one empty cell remains per row and column for decoys', () => {
      const puzzle = generatePuzzle('hard');
      const size = puzzle.grid.length;
      
      // Check rows - should have at least 1 non-core position
      for (let i = 0; i < size; i++) {
        let coreCount = 0;
        for (let j = 0; j < size; j++) {
          if (puzzle.corePositions.has(`${i},${j}`)) {
            coreCount++;
          }
        }
        expect(coreCount).toBeLessThan(size); // At least 1 empty for decoys
      }

      // Check columns - should have at least 1 non-core position
      for (let j = 0; j < size; j++) {
        let coreCount = 0;
        for (let i = 0; i < size; i++) {
          if (puzzle.corePositions.has(`${i},${j}`)) {
            coreCount++;
          }
        }
        expect(coreCount).toBeLessThan(size); // At least 1 empty for decoys
      }
    });
  });

  describe('Consistency and Randomness', () => {
    it('should generate different puzzles each time', () => {
      const puzzle1 = generatePuzzle('easy');
      const puzzle2 = generatePuzzle('easy');

      // Grids should be different
      let isDifferent = false;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (puzzle1.grid[i][j] !== puzzle2.grid[i][j]) {
            isDifferent = true;
            break;
          }
        }
        if (isDifferent) break;
      }

      expect(isDifferent).toBe(true);
    });

    it('should have varying core position counts across generations', () => {
      const coreCounts = [];
      for (let i = 0; i < 10; i++) {
        const puzzle = generatePuzzle('medium');
        coreCounts.push(puzzle.corePositions.size);
      }

      // Should have some variation in core counts
      const uniqueCounts = new Set(coreCounts);
      expect(uniqueCounts.size).toBeGreaterThan(1);
    });
  });
});

describe('GameLogic - Solution Validation', () => {
  let testPuzzle;

  beforeEach(() => {
    testPuzzle = generatePuzzle('easy');
  });

  describe('Correct Solutions', () => {
    it('should validate correct solution as true', () => {
      // Create correct solution
      const correctSolution = new Set();
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const position = `${i},${j}`;
          if (!testPuzzle.corePositions.has(position)) {
            correctSolution.add(position);
          }
        }
      }

      const result = validateSolution(testPuzzle.grid, testPuzzle.targets, correctSolution);
      expect(result).toBe(true);
    });

    it('should validate empty removal set (no numbers removed)', () => {
      // Calculate what the targets should be for full grid
      const fullGridTargets = {
        rows: [],
        cols: []
      };

      // Calculate row sums
      for (let i = 0; i < 4; i++) {
        let sum = 0;
        for (let j = 0; j < 4; j++) {
          sum += testPuzzle.grid[i][j];
        }
        fullGridTargets.rows.push(sum);
      }

      // Calculate column sums  
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let i = 0; i < 4; i++) {
          sum += testPuzzle.grid[i][j];
        }
        fullGridTargets.cols.push(sum);
      }

      const result = validateSolution(testPuzzle.grid, fullGridTargets, new Set());
      expect(result).toBe(true);
    });
  });

  describe('Incorrect Solutions', () => {
    it('should validate incorrect solution as false', () => {
      // Create incorrect solution by removing a core position
      const incorrectSolution = new Set();
      const firstCorePosition = Array.from(testPuzzle.corePositions)[0];
      incorrectSolution.add(firstCorePosition);

      const result = validateSolution(testPuzzle.grid, testPuzzle.targets, incorrectSolution);
      expect(result).toBe(false);
    });

    it('should validate partial incorrect solution as false', () => {
      // Create partially correct solution
      const partialSolution = new Set();
      const nonCorePositions = [];
      
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const position = `${i},${j}`;
          if (!testPuzzle.corePositions.has(position)) {
            nonCorePositions.push(position);
          }
        }
      }

      // Only remove half the non-core positions
      for (let i = 0; i < Math.floor(nonCorePositions.length / 2); i++) {
        partialSolution.add(nonCorePositions[i]);
      }

      const result = validateSolution(testPuzzle.grid, testPuzzle.targets, partialSolution);
      expect(result).toBe(false);
    });

    it('should validate over-removal as false', () => {
      // Remove more than necessary
      const overRemovalSolution = new Set();
      
      // Add all non-core positions
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const position = `${i},${j}`;
          if (!testPuzzle.corePositions.has(position)) {
            overRemovalSolution.add(position);
          }
        }
      }

      // Also add one core position
      const firstCore = Array.from(testPuzzle.corePositions)[0];
      overRemovalSolution.add(firstCore);

      const result = validateSolution(testPuzzle.grid, testPuzzle.targets, overRemovalSolution);
      expect(result).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty grid correctly', () => {
      const emptyGrid = [[1]];
      const targets = { rows: [1], cols: [1] };
      const result = validateSolution(emptyGrid, targets, new Set());
      expect(result).toBe(true);
    });

    it('should handle single cell removal correctly', () => {
      const singleGrid = [[5]];
      const targets = { rows: [0], cols: [0] };
      const result = validateSolution(singleGrid, targets, new Set(['0,0']));
      expect(result).toBe(true);
    });
  });
});

describe('GameLogic - Edge Cases', () => {
  describe('Minimum Core Requirements', () => {
    it('should handle minimum core scenario (1 per row/column)', () => {
      // Test multiple times to ensure consistency
      for (let i = 0; i < 5; i++) {
        const puzzle = generatePuzzle('easy');
        
        // Verify each row has at least 1 core
        for (let row = 0; row < 4; row++) {
          let hasCore = false;
          for (let col = 0; col < 4; col++) {
            if (puzzle.corePositions.has(`${row},${col}`)) {
              hasCore = true;
              break;
            }
          }
          expect(hasCore).toBe(true);
        }

        // Verify each column has at least 1 core
        for (let col = 0; col < 4; col++) {
          let hasCore = false;
          for (let row = 0; row < 4; row++) {
            if (puzzle.corePositions.has(`${row},${col}`)) {
              hasCore = true;
              break;
            }
          }
          expect(hasCore).toBe(true);
        }
      }
    });
  });

  describe('Diagonal Bias Prevention', () => {
    it('should not show systematic diagonal bias in core placement', () => {
      const diagonalCounts = { main: 0, anti: 0 };
      const iterations = 20;

      for (let i = 0; i < iterations; i++) {
        const puzzle = generatePuzzle('easy');
        
        // Count main diagonal cores (0,0), (1,1), (2,2), (3,3)
        let mainDiagonalCores = 0;
        for (let d = 0; d < 4; d++) {
          if (puzzle.corePositions.has(`${d},${d}`)) {
            mainDiagonalCores++;
          }
        }

        // Count anti-diagonal cores (0,3), (1,2), (2,1), (3,0)
        let antiDiagonalCores = 0;
        for (let d = 0; d < 4; d++) {
          if (puzzle.corePositions.has(`${d},${3-d}`)) {
            antiDiagonalCores++;
          }
        }

        if (mainDiagonalCores === 4) diagonalCounts.main++;
        if (antiDiagonalCores === 4) diagonalCounts.anti++;
      }

      // Should not always place cores on diagonals
      expect(diagonalCounts.main).toBeLessThan(iterations * 0.8);
      expect(diagonalCounts.anti).toBeLessThan(iterations * 0.8);
    });

    it('should distribute cores across different positions', () => {
      const positionCounts = {};
      const iterations = 50;

      for (let i = 0; i < iterations; i++) {
        const puzzle = generatePuzzle('easy');
        
        for (const position of puzzle.corePositions) {
          if (!positionCounts[position]) {
            positionCounts[position] = 0;
          }
          positionCounts[position]++;
        }
      }

      // Should use various positions, not just the same few
      const uniquePositions = Object.keys(positionCounts);
      expect(uniquePositions.length).toBeGreaterThan(8); // Should use more than half available positions
    });
  });

  describe('Invalid Inputs', () => {
    it('should handle invalid difficulty gracefully', () => {
      expect(() => generatePuzzle('invalid')).toThrow();
    });

    it('should handle undefined difficulty', () => {
      expect(() => generatePuzzle()).toThrow();
    });
  });
});

describe('GameLogic - Mathematical Correctness', () => {
  describe('Sum Calculations', () => {
    it('should calculate row targets correctly', () => {
      const puzzle = generatePuzzle('medium');
      
      // Manually calculate row sums and compare with targets
      for (let i = 0; i < 5; i++) {
        let expectedSum = 0;
        for (let j = 0; j < 5; j++) {
          const position = `${i},${j}`;
          if (puzzle.corePositions.has(position)) {
            expectedSum += puzzle.grid[i][j];
          }
        }
        expect(puzzle.targets.rows[i]).toBe(expectedSum);
      }
    });

    it('should calculate column targets correctly', () => {
      const puzzle = generatePuzzle('medium');
      
      // Manually calculate column sums and compare with targets
      for (let j = 0; j < 5; j++) {
        let expectedSum = 0;
        for (let i = 0; i < 5; i++) {
          const position = `${i},${j}`;
          if (puzzle.corePositions.has(position)) {
            expectedSum += puzzle.grid[i][j];
          }
        }
        expect(puzzle.targets.cols[j]).toBe(expectedSum);
      }
    });

    it('should calculate current sums correctly in validateSolution', () => {
      const puzzle = generatePuzzle('easy');
      const testRemovalSet = new Set(['0,0', '1,1']);
      
      // Calculate expected sums manually
      const expectedRowSums = [];
      const expectedColSums = [];
      
      // Calculate row sums
      for (let i = 0; i < 4; i++) {
        let sum = 0;
        for (let j = 0; j < 4; j++) {
          if (!testRemovalSet.has(`${i},${j}`)) {
            sum += puzzle.grid[i][j];
          }
        }
        expectedRowSums.push(sum);
      }

      // Calculate column sums
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let i = 0; i < 4; i++) {
          if (!testRemovalSet.has(`${i},${j}`)) {
            sum += puzzle.grid[i][j];
          }
        }
        expectedColSums.push(sum);
      }

      const currentSums = calculateCurrentSums(puzzle.grid, testRemovalSet);
      expect(currentSums.rows).toEqual(expectedRowSums);
      expect(currentSums.cols).toEqual(expectedColSums);
    });
  });

  describe('Target Sum Properties', () => {
    it('should have positive target sums for all rows and columns', () => {
      const puzzle = generatePuzzle('hard');
      
      for (const rowSum of puzzle.targets.rows) {
        expect(rowSum).toBeGreaterThan(0);
      }
      
      for (const colSum of puzzle.targets.cols) {
        expect(colSum).toBeGreaterThan(0);
      }
    });

    it('should have realistic target sums (not too high or too low)', () => {
      const puzzle = generatePuzzle('hard');
      const maxPossibleSum = 9 * 6; // 6 cells * max value 9
      const minReasonableSum = 1; // At least 1
      
      for (const rowSum of puzzle.targets.rows) {
        expect(rowSum).toBeGreaterThanOrEqual(minReasonableSum);
        expect(rowSum).toBeLessThanOrEqual(maxPossibleSum);
      }
      
      for (const colSum of puzzle.targets.cols) {
        expect(colSum).toBeGreaterThanOrEqual(minReasonableSum);
        expect(colSum).toBeLessThanOrEqual(maxPossibleSum);
      }
    });
  });

  describe('Numerical Consistency', () => {
    it('should maintain consistent grid values throughout generation', () => {
      const puzzle = generatePuzzle('medium');
      
      // Verify that all numbers are integers
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          expect(Number.isInteger(puzzle.grid[i][j])).toBe(true);
        }
      }
      
      // Verify targets are integers
      for (const target of [...puzzle.targets.rows, ...puzzle.targets.cols]) {
        expect(Number.isInteger(target)).toBe(true);
      }
    });

    it('should validate that removed positions correctly affect sums', () => {
      const puzzle = generatePuzzle('easy');
      const testPosition = '1,1';
      const testValue = puzzle.grid[1][1];
      
      // Calculate sums without removal
      const fullSums = calculateCurrentSums(puzzle.grid, new Set());
      
      // Calculate sums with test position removed
      const partialSums = calculateCurrentSums(puzzle.grid, new Set([testPosition]));
      
      // Row 1 should be reduced by testValue
      expect(partialSums.rows[1]).toBe(fullSums.rows[1] - testValue);
      
      // Column 1 should be reduced by testValue
      expect(partialSums.cols[1]).toBe(fullSums.cols[1] - testValue);
      
      // Other rows and columns should be unchanged
      for (let i = 0; i < 4; i++) {
        if (i !== 1) {
          expect(partialSums.rows[i]).toBe(fullSums.rows[i]);
          expect(partialSums.cols[i]).toBe(fullSums.cols[i]);
        }
      }
    });
  });
});