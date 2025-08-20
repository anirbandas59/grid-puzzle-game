/**
 * Game Instructions Component
 */

const GameInstructions = () => {
  return (
    <div className="mt-8 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-bold mb-2">How to Play:</h3>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>
          <strong>Remove Mode:</strong> Click numbers to remove them
        </li>
        <li>
          <strong>Goal:</strong> Make remaining numbers in each row/column sum
          to the target
        </li>
        <li>
          <strong>Lifelines:</strong> You lose 1 lifeline for removing a number
          that should stay
        </li>
        <li>
          <strong>Confirm Mode:</strong> Submit your final solution
        </li>
      </ul>

      <p className="text-xs text-gray-500 mt-2">
        Tip: Remove numbers so remaining ones in each row/column sum to targets
      </p>
    </div>
  );
};

export default GameInstructions;
