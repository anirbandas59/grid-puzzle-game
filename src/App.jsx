import GridGame from './components/GridGame';
import './animations.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-4 md:py-8 font-sans">
      <div className="container mx-auto px-3 sm:px-6 max-w-6xl">
        <header className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6 tracking-tight leading-tight px-2">
            Grid Number Puzzle
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed px-4">
            Challenge your mind with this engaging number puzzle game.<br className="hidden sm:block" /> 
            <span className="text-slate-500">Remove the right numbers to match the target sums!</span>
          </p>
        </header>
        <main className="relative">
          <GridGame />
        </main>
      </div>
    </div>
  );
}

export default App;
