/**
 * Game Instructions Component
 */


const GameInstructions = () => {
  const instructions = [
    {
      icon: '❌',
      title: 'Remove Mode',
      desc: 'Click numbers to remove them from the grid',
      color: 'orange'
    },
    {
      icon: '🎯',
      title: 'Goal',
      desc: 'Make remaining numbers sum to the targets',
      color: 'blue'
    },
    {
      icon: '♥️',
      title: 'Lifelines',
      desc: 'You lose 1 for removing wrong numbers',
      color: 'red'
    },
    {
      icon: '✅',
      title: 'Confirm',
      desc: 'Submit your solution when ready',
      color: 'green'
    }
  ];

  return (
    <div className="mt-10 bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl shadow-xl border-2 border-slate-200 max-w-4xl mx-auto">
      <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center gap-3">
        🎮 How to Play
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {instructions.map((instruction, index) => (
          <div 
            key={instruction.title}
            className={`flex items-start gap-4 p-6 bg-white rounded-xl border-2 hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
              instruction.color === 'orange' ? 'border-orange-200' :
              instruction.color === 'blue' ? 'border-blue-200' :
              instruction.color === 'red' ? 'border-red-200' :
              'border-green-200'
            }`}
          >
            <div className="text-3xl">{instruction.icon}</div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{instruction.title}</h4>
              <p className="text-base text-slate-700 leading-relaxed">{instruction.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
        <p className="text-lg text-blue-900 font-medium flex items-center justify-center gap-2">
          💡 <strong>Pro Tip:</strong> Remove numbers strategically so the remaining ones sum to the target values!
        </p>
      </div>
    </div>
  );
};

export default GameInstructions;
