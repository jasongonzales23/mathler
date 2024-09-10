import { cn } from "@/lib/utils";

interface KeyboardProps {
  handler: (key: string) => void;
  correctness: Record<string, string>;
}

type CorrectnessMap = {
  [key: string]: string;
};

const correctnessMap: CorrectnessMap = {
  correct: "bg-green-500",
  inFormula: "bg-yellow-500",
  incorrect: "bg-gray-500",
  neutral: "bg-[#D4DDEB]",
};

export default function Keyboard({ handler, correctness }: KeyboardProps) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const operators = ["+", "-", "*", "/"];
  return (
    <div className="mb-3">
      <div className="flex justify-center mb-1">
        {numbers.map((number) => (
          <button
            onClick={() => handler(String(number))}
            key={number}
            className={cn(
              "flex items-center justify-center rounded mx-0.5 font-bold cursor-pointer",
              "select-none text-xl hover:bg-[#BBC8D6] active:bg-[#727F93] text-black",
              "border-solid border-2 border-[#D4DDEB] hover:border-[#BBC8D6] focus:outline-none",
              "w-[40px] h-[50px]",
              correctnessMap[correctness[String(number)]]
            )}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="flex justify-center mb-1">
        <button
          onClick={() => handler("Enter")}
          className={cn(
            "flex items-center justify-center rounded mx-0.5 font-bold cursor-pointer",
            "select-none text-xl hover:bg-[#BBC8D6] active:bg-[#727F93] text-black",
            "border-solid border-2 border-[#D4DDEB] hover:border-[#BBC8D6] focus:outline-none",
            "focus:outline-none w-[80px] h-[50px]",
            correctnessMap["neutral"]
          )}
        >
          Enter
        </button>
        {operators.map((operator) => (
          <button
            key={operator}
            onClick={() => handler(operator)}
            className={cn(
              "flex items-center justify-center rounded mx-0.5 font-bold cursor-pointer",
              "select-none text-xl hover:bg-[#BBC8D6] active:bg-[#727F93] text-black",
              "border-solid border-2 border-[#D4DDEB] hover:border-[#BBC8D6] focus:outline-none",
              "focus:outline-none w-[40px] h-[50px]",
              correctnessMap["neutral"]
            )}
          >
            {operator}
          </button>
        ))}
        <button
          onClick={() => handler("Backspace")}
          className={cn(
            "flex items-center justify-center rounded",
            "mx-0.5 font-bold cursor-pointer select-none text-xl bg-[#D4DDEB] hover:bg-[#BBC8D6]",
            "active:bg-[#727F93] text-black border-solid border-2 border-[#D4DDEB] hover:border-[#BBC8D6]",
            "focus:outline-none w-[80px] h-[50px]"
          )}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
