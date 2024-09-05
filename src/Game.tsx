export default function Game() {
  const correctFormula = "21 / 7 + 9";
  const correctFormulaResult = 12;
  const rows = Array.from({ length: 6 });
  const columns = Array.from({ length: 6 });
  return (
    <div>
      <h2>Game</h2>
      <p>Find the calculation that equals {correctFormulaResult}</p>
      {rows.map((_, rowIndex) => (
        <div key={rowIndex}>
          {columns.map((_, columnIndex) => (
            <input className="border border-gray-600 w-8 h-8" key={columnIndex}>
              {rowIndex * columnIndex}
            </input>
          ))}
        </div>
      ))}
    </div>
  );
}
