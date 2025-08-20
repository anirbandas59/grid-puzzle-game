// Test script for generatePuzzle method
import { generatePuzzle, validateSolution } from '../src/utils/GameLogic.js';

// Helper function to print a grid nicely
function printGrid(grid, title) {
  console.log(`\n${title}:`);
  grid.forEach(row => {
    console.log(row.map(cell => cell.toString().padStart(2)).join(' '));
  });
}

// Helper function to validate puzzle constraints
function validatePuzzleConstraints(puzzle, difficulty) {
  const { grid, targets, corePositions } = puzzle;
  const size = grid.length;
  const expectedSize = { easy: 4, medium: 5, hard: 6 }[difficulty];

  const issues = [];

  // Check grid size
  if (size !== expectedSize) {
    issues.push(
      `Expected ${expectedSize}x${expectedSize} grid, got ${size}x${size}`
    );
  }

  // Check that all cells have valid numbers (1-9)
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (grid[i][j] < 1 || grid[i][j] > 9) {
        issues.push(`Invalid number at (${i},${j}): ${grid[i][j]}`);
      }
    }
  }

  // Check that targets arrays have correct length
  if (targets.rows.length !== size) {
    issues.push(`Row targets length ${targets.rows.length}, expected ${size}`);
  }
  if (targets.cols.length !== size) {
    issues.push(
      `Column targets length ${targets.cols.length}, expected ${size}`
    );
  }

  // Check that each row and column has at least one core position
  const rowHasCore = Array(size).fill(false);
  const colHasCore = Array(size).fill(false);

  for (const position of corePositions) {
    const [row, col] = position.split(',').map(Number);
    rowHasCore[row] = true;
    colHasCore[col] = true;
  }

  for (let i = 0; i < size; i++) {
    if (!rowHasCore[i]) {
      issues.push(`Row ${i} has no core positions`);
    }
    if (!colHasCore[i]) {
      issues.push(`Column ${i} has no core positions`);
    }
  }

  // Check that core positions are reasonable (not too few, not too many)
  const totalCells = size * size;
  const coreCount = corePositions.size;
  const corePercentage = (coreCount / totalCells) * 100;

  if (corePercentage < 30) {
    issues.push(
      `Too few core positions: ${coreCount}/${totalCells} (${corePercentage.toFixed(
        1
      )}%)`
    );
  }
  if (corePercentage > 80) {
    issues.push(
      `Too many core positions: ${coreCount}/${totalCells} (${corePercentage.toFixed(
        1
      )}%)`
    );
  }

  return issues;
}

// Test a single difficulty multiple times
function testDifficulty(difficulty, iterations = 5) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(
    `Testing ${difficulty.toUpperCase()} difficulty (${iterations} iterations)`
  );
  console.log(`${'='.repeat(50)}`);

  const results = [];

  for (let i = 0; i < iterations; i++) {
    console.log(`\n--- Test ${i + 1} ---`);

    try {
      const puzzle = generatePuzzle(difficulty);
      const { grid, targets, corePositions } = puzzle;

      // Print basic info
      console.log(`Grid size: ${grid.length}x${grid.length}`);
      console.log(
        `Core positions: ${corePositions.size}/${grid.length * grid.length}`
      );
      console.log(
        `Core percentage: ${(
          (corePositions.size / (grid.length * grid.length)) *
          100
        ).toFixed(1)}%`
      );
      console.log(`Row targets: [${targets.rows.join(', ')}]`);
      console.log(`Col targets: [${targets.cols.join(', ')}]`);

      // Print grid with core positions marked
      printGrid(grid, 'Generated Grid');

      // Show core positions
      console.log(`\nCore positions: ${Array.from(corePositions).join(', ')}`);

      // Validate constraints
      const issues = validatePuzzleConstraints(puzzle, difficulty);

      if (issues.length === 0) {
        console.log('✅ All constraints satisfied');

        // Test if the puzzle has a valid solution (remove all non-core positions)
        const solutionTest = new Set();
        for (let row = 0; row < grid.length; row++) {
          for (let col = 0; col < grid.length; col++) {
            const position = `${row},${col}`;
            if (!corePositions.has(position)) {
              solutionTest.add(position);
            }
          }
        }

        const isValidSolution = validateSolution(grid, targets, solutionTest);
        console.log(
          `✅ Solution validation: ${isValidSolution ? 'VALID' : 'INVALID'}`
        );

        results.push({
          success: true,
          coreCount: corePositions.size,
          corePercentage:
            (corePositions.size / (grid.length * grid.length)) * 100,
          hasValidSolution: isValidSolution,
        });
      } else {
        console.log('❌ Constraint violations:');
        issues.forEach(issue => console.log(`   - ${issue}`));
        results.push({ success: false, issues });
      }
    } catch (error) {
      console.log('❌ Error generating puzzle:', error.message);
      results.push({ success: false, error: error.message });
    }
  }

  // Summary for this difficulty
  const successful = results.filter(r => r.success).length;
  console.log(`\n--- ${difficulty.toUpperCase()} Summary ---`);
  console.log(
    `Successful generations: ${successful}/${iterations} (${(
      (successful / iterations) *
      100
    ).toFixed(1)}%)`
  );

  if (successful > 0) {
    const successfulResults = results.filter(r => r.success);
    const avgCorePercentage =
      successfulResults.reduce((sum, r) => sum + r.corePercentage, 0) /
      successful;
    const validSolutions = successfulResults.filter(
      r => r.hasValidSolution
    ).length;

    console.log(`Average core percentage: ${avgCorePercentage.toFixed(1)}%`);
    console.log(
      `Valid solutions: ${validSolutions}/${successful} (${(
        (validSolutions / successful) *
        100
      ).toFixed(1)}%)`
    );
  }

  return results;
}

// Main test function
function runTests() {
  console.log('🎮 Testing generatePuzzle method with different complexities');
  console.log(
    'This will test puzzle generation constraints and solution validity'
  );

  const allResults = {
    easy: testDifficulty('easy', 10),
    medium: testDifficulty('medium', 10),
    hard: testDifficulty('hard', 10),
  };

  // Overall summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('OVERALL SUMMARY');
  console.log(`${'='.repeat(60)}`);

  Object.entries(allResults).forEach(([difficulty, results]) => {
    const successful = results.filter(r => r.success).length;
    const total = results.length;
    const successRate = ((successful / total) * 100).toFixed(1);

    console.log(
      `${difficulty.toUpperCase()}: ${successful}/${total} successful (${successRate}%)`
    );

    if (successful > 0) {
      const validSolutions = results.filter(
        r => r.success && r.hasValidSolution
      ).length;
      console.log(
        `  Valid solutions: ${validSolutions}/${successful} (${(
          (validSolutions / successful) *
          100
        ).toFixed(1)}%)`
      );
    }
  });

  // Recommendations
  console.log(`\n${'='.repeat(60)}`);
  console.log('ASSESSMENT & RECOMMENDATIONS');
  console.log(`${'='.repeat(60)}`);

  const totalTests = Object.values(allResults).flat().length;
  const totalSuccessful = Object.values(allResults)
    .flat()
    .filter(r => r.success).length;
  const overallSuccessRate = ((totalSuccessful / totalTests) * 100).toFixed(1);

  if (overallSuccessRate >= 90) {
    console.log('✅ EXCELLENT: Puzzle generation is highly reliable');
  } else if (overallSuccessRate >= 75) {
    console.log(
      '🟡 GOOD: Puzzle generation is mostly reliable with minor issues'
    );
  } else if (overallSuccessRate >= 50) {
    console.log(
      '🟠 FAIR: Puzzle generation has significant issues that need addressing'
    );
  } else {
    console.log(
      '❌ POOR: Puzzle generation is unreliable and needs major fixes'
    );
  }

  console.log(`Overall success rate: ${overallSuccessRate}%`);
}

// Run the tests
runTests();
