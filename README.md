# Grid Number Puzzle Game

A strategic number elimination puzzle game where players must remove specific numbers from a grid to match target sums for each row and column.

## Game Description

**Objective**: Remove numbers from the grid so that the remaining numbers in each row and column sum to the target values displayed on the sides.

## Game Features

- **3 Difficulty Levels**: Easy (4x4), Medium (5x5), Hard (6x6)
- **Two Game Modes**: Remove (eliminate numbers) & Confirm (submit solution)
- **Lifeline System**: 3 lives - lose one for each incorrect removal
- **Unique Solutions**: Each puzzle has exactly one correct answer
- **Real-time Feedback**: Immediate penalty for wrong moves

## How to Play

1. **Choose Difficulty**: Select grid size (4x4, 5x5, or 6x6)
2. **Analyze the Grid**: Study numbers and target sums
3. **Remove Mode**: Click numbers you think should be eliminated
4. **Confirm Mode**: Submit your final solution
5. **Win Condition**: All row and column sums match targets

## Game Rules

- Each cell contains a random number (1-9)
- Removing a "core" number (should stay) costs 1 lifeline
- Game ends when lifelines reach 0 or puzzle is solved correctly

## Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- npm package manager
- Modern web browser with JavaScript enabled

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd grid-puzzle-game
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```
   Opens at http://localhost:5173

### Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests (Vitest)
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:e2e` - Run end-to-end tests (Playwright)

## Technical Details

### Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 7.1.2  
- **Styling**: Tailwind CSS 4.1.12
- **State Management**: React Hooks (useState)
- **Testing**: Vitest + React Testing Library + Playwright
- **Linting**: ESLint
- **Type Safety**: JSDoc comments

### Browser Compatibility

- Chrome 60+
- Firefox 60+  
- Safari 12+
- Edge 79+

## Project Structure

```
grid-puzzle-game/
├── public/                # Static assets
├── src/
│   ├── components/
│   │   ├── GridGame.jsx   # Main game component & state management
│   │   └── ui/            # Reusable UI components
│   │       ├── GameInterface.jsx    # Main game interface
│   │       ├── GameGrid.jsx        # Grid display
│   │       ├── GridCell.jsx        # Individual cells
│   │       ├── GameControls.jsx    # Mode toggle & confirm
│   │       ├── GameStatus.jsx      # Lifelines & status
│   │       ├── GameSetup.jsx       # Difficulty selection
│   │       ├── GameResults.jsx     # Win/lose screens
│   │       ├── GameInstructions.jsx # Help text
│   │       ├── DifficultySelector.jsx # Difficulty buttons
│   │       └── TargetDisplay.jsx   # Row/column targets
│   ├── utils/
│   │   └── GameLogic.js   # Puzzle generation & validation algorithms
│   ├── assets/            # Images, fonts, etc.
│   ├── App.jsx            # Root application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── tests/                 # Test suites
│   ├── GameLogic.test.js          # Unit tests for game logic
│   ├── components/                # Component tests
│   ├── integration/               # Integration tests
│   └── setup.js                   # Test configuration
├── coverage/              # Test coverage reports
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite build configuration
├── vitest.config.js       # Vitest test configuration
├── playwright.config.js   # E2E test configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

## Development & Testing

### Architecture
- **Modular Design**: Separated UI components and game logic
- **State Management**: Centralized in GridGame.jsx with React hooks
- **Component Structure**: Reusable UI components in `/ui` directory
- **Algorithm**: Constraint satisfaction for puzzle generation
- **Validation**: Mathematical verification of puzzle solutions

### Testing Strategy
- **Unit Tests**: GameLogic.js (91.38% coverage, 28 tests)
- **Component Tests**: Individual UI component testing
- **Integration Tests**: Full game flow and state management
- **E2E Tests**: Playwright for browser automation
- **Performance Tests**: Puzzle generation benchmarks

### Code Quality
- ESLint for code standards
- Comprehensive test coverage
- JSDoc documentation
- Git workflow ready

## Examples

### Easy Mode (4x4)

```
    16  8   7   19
7   7   2   8   5     → Remove: 2, 8, 5
9   7   7   7   9     → Remove: 7, 7, 7  
9   5   1   7   1     → Remove: 5, 7
25  9   7   9   9     → Remove: 7, 9
```

### Final Result

```
    16  8   7   19
7   7               
9               9   
9       1       1   
25  9       9       
```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test files
npm test GameLogic
npm test GridGame

# Run integration tests
npm test integration

# Run E2E tests
npm run test:e2e
```

### Test Coverage
- Unit tests: 91.38% coverage on GameLogic.js
- Component tests: All UI components
- Integration tests: Complete game workflows
- Performance tests: Puzzle generation benchmarks

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Run tests (`npm test`)
4. Commit changes (`git commit -am 'Add new feature'`)
5. Push to branch (`git push origin feature/new-feature`)
6. Open a Pull Request

### Development Workflow
- Each component is developed and tested independently
- All changes must pass linting and tests
- Integration tests verify component interactions
- E2E tests ensure browser compatibility

---

*Grid Number Puzzle Game - React + Vite + Tailwind CSS*
