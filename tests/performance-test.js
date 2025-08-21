// Performance and edge case testing for generatePuzzle
import { generatePuzzle, validateSolution } from '../src/utils/GameLogic.js';

function testPerformance() {
  console.log('🚀 Performance Testing generatePuzzle method\n');

  const difficulties = ['easy', 'medium', 'hard'];
  const iterations = 50;

  for (const difficulty of difficulties) {
    console.log(
      `Testing ${difficulty.toUpperCase()} performance (${iterations} iterations)`
    );

    const startTime = Date.now();
    let totalCorePositions = 0;
    let validSolutions = 0;
    let errors = 0;

    for (let i = 0; i < iterations; i++) {
      try {
        const puzzle = generatePuzzle(difficulty);
        totalCorePositions += puzzle.corePositions.size;

        // Test if the correct solution works
        const correctSolution = new Set();
        for (let row = 0; row < puzzle.grid.length; row++) {
          for (let col = 0; col < puzzle.grid.length; col++) {
            const position = `${row},${col}`;
            if (!puzzle.corePositions.has(position)) {
              correctSolution.add(position);
            }
          }
        }

        if (validateSolution(puzzle.grid, puzzle.targets, correctSolution)) {
          validSolutions++;
        }
      } catch (error) {
        errors++;
        console.log(`  Error in iteration ${i + 1}: ${error.message}`);
      }
    }

    const endTime = Date.now();
    const avgTime = (endTime - startTime) / iterations;
    const avgCorePositions = totalCorePositions / (iterations - errors);

    console.log(`  ⏱️  Average time: ${avgTime.toFixed(2)}ms per puzzle`);
    console.log(
      `  ✅ Success rate: ${(
        ((iterations - errors) / iterations) *
        100
      ).toFixed(1)}%`
    );
    console.log(
      `  🎯 Valid solutions: ${validSolutions}/${iterations - errors} (${(
        (validSolutions / (iterations - errors)) *
        100
      ).toFixed(1)}%)`
    );
    console.log(`  📊 Average core positions: ${avgCorePositions.toFixed(1)}`);
    console.log('');
  }
}

function testEdgeCases() {
  console.log('🔍 Edge Case Testing\n');

  // Test invalid difficulty
  try {
    generatePuzzle('invalid');
    console.log('❌ Should have failed with invalid difficulty');
  } catch (error) {
    console.log('✅ Correctly handled invalid difficulty:', error.message);
  }

  // Test if core positions guarantee solvability
  console.log('\n📝 Testing core position constraints:');

  const difficulties = ['easy', 'medium', 'hard'];
  for (const difficulty of difficulties) {
    console.log(`\n${difficulty.toUpperCase()} difficulty analysis:`);

    let minCores = Infinity;
    let maxCores = 0;
    let minPercentage = Infinity;
    let maxPercentage = 0;
    const coreDistribution = {};

    for (let i = 0; i < 20; i++) {
      const puzzle = generatePuzzle(difficulty);
      const coreCount = puzzle.corePositions.size;
      const totalCells = puzzle.grid.length * puzzle.grid.length;
      const percentage = (coreCount / totalCells) * 100;

      minCores = Math.min(minCores, coreCount);
      maxCores = Math.max(maxCores, coreCount);
      minPercentage = Math.min(minPercentage, percentage);
      maxPercentage = Math.max(maxPercentage, percentage);

      if (!coreDistribution[coreCount]) {
        coreDistribution[coreCount] = 0;
      }
      coreDistribution[coreCount]++;
    }

    console.log(`  Core range: ${minCores}-${maxCores} positions`);
    console.log(
      `  Percentage range: ${minPercentage.toFixed(1)}%-${maxPercentage.toFixed(
        1
      )}%`
    );
    console.log(
      `  Distribution: ${Object.entries(coreDistribution)
        .map(([cores, count]) => `${cores}(${count})`)
        .join(', ')}`
    );
  }
}

function testUniquenessProperty() {
  console.log('\n🧩 Testing Solution Uniqueness Property\n');

  // For a few puzzles, test if there are multiple valid solutions
  const difficulties = ['easy', 'medium'];

  for (const difficulty of difficulties) {
    console.log(`Testing ${difficulty.toUpperCase()} uniqueness:`);

    const puzzle = generatePuzzle(difficulty);
    const size = puzzle.grid.length;
    const totalPositions = size * size;

    console.log(`  Grid size: ${size}x${size}`);
    console.log(
      `  Core positions: ${puzzle.corePositions.size}/${totalPositions}`
    );
    console.log(
      `  Non-core positions: ${totalPositions - puzzle.corePositions.size}`
    );

    // The correct solution
    const correctSolution = new Set();
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const position = `${row},${col}`;
        if (!puzzle.corePositions.has(position)) {
          correctSolution.add(position);
        }
      }
    }

    const isCorrectValid = validateSolution(
      puzzle.grid,
      puzzle.targets,
      correctSolution
    );
    console.log(`  ✅ Correct solution valid: ${isCorrectValid}`);

    // Test a few alternative solutions (removing some core positions)
    let alternativeFound = false;
    if (puzzle.corePositions.size > size) {
      // Only test if we have excess cores
      const coreArray = Array.from(puzzle.corePositions);
      for (let i = 0; i < Math.min(3, coreArray.length); i++) {
        const altSolution = new Set(correctSolution);
        altSolution.add(coreArray[i]); // Try removing a core position

        if (validateSolution(puzzle.grid, puzzle.targets, altSolution)) {
          alternativeFound = true;
          break;
        }
      }
    }

    console.log(
      `  🔍 Alternative solution found: ${
        alternativeFound ? 'YES (not unique)' : 'NO (appears unique)'
      }`
    );
    console.log('');
  }
}

// Run all tests
testPerformance();
testEdgeCases();
testUniquenessProperty();
