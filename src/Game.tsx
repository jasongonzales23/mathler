import { useEffect, useState } from "react";
import { useKeyUp } from "./useKeyUp";
import useError from "./useError";
import Notification from "./Notification";
import { cn } from "@/lib/utils";
import Keyboard from "./Keyboard";
import { ROW_COUNT, COLUMN_COUNT } from "./constants";
import { useAtom } from "jotai";
import { boardAtom, currentCellAtom } from "./atoms";

type CorrectnessMap = {
  [key: string]: string;
};

export default function Game() {
  // const correctFormula = "21/7+9";
  const correctFormula = "1 + 5 * 15";
  const correctFormulaResult = eval(correctFormula);
  const formulaArr = correctFormula.split("").filter((char) => char !== " ");

  const values = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const operators = ["+", "-", "*", "/"];
  const utils = ["Backspace", "Enter"];

  const correctnessMap: CorrectnessMap = {
    correct: "bg-green-500",
    inFormula: "bg-yellow-500",
    incorrect: "bg-gray-500",
    neutral: "",
  };

  // TODO switch these back
  // TODO disable the UI keyboard when the game is won
  const [currentCell, setCurrentCell] = useAtom(currentCellAtom);
  const [board, setBoard] = useAtom(boardAtom);

  const initialBoard: CorrectnessMap = {
    "0": "neutral",
    "1": "neutral",
    "2": "neutral",
    "3": "neutral",
    "4": "neutral",
    "5": "neutral",
    "6": "neutral",
    "7": "neutral",
    "8": "neutral",
    "9": "neutral",
    "+": "neutral",
    "-": "neutral",
    "*": "neutral",
    "/": "neutral",
    Backspace: "neutral",
    Enter: "neutral",
  };
  const [keyboardCorrectness, setKeyboardCorrectness] = useState(initialBoard);

  const [isEnabled, setIsEnabled] = useState(true);
  const { error, setTimedError } = useError();
  const [success, setSuccess] = useState<string | null>(null);

  const getKeyType = (key: string) => {
    if (values.includes(key)) return "value";
    if (operators.includes(key)) return "operator";
    // if (utils.includes(key)) return "util";
  };

  const shouldOverwrite = (
    prevCorrectness: string,
    targetCorrectness: string
  ) => {
    // if mapped value is neutral or incorrect always overwrite
    if (prevCorrectness === "neutral" || prevCorrectness === "incorrect") {
      return true;
    }
    // if mapped value is correct, don't overwrite
    if (prevCorrectness === "correct") {
      return false;
    }
    // if mapped value is inFormula, overwrite only if the target is correct
    if (prevCorrectness === "inFormula" && targetCorrectness === "correct") {
      return true;
    }
  };

  const gameLogic = (key: string) => {
    const keyType = getKeyType(key);

    if (key === "Enter") {
      const row = board[currentCell.row];
      const rowValues = row.map((cell) => cell.value);
      const rowHasEmptyCell = rowValues.some((value) => value === "");

      if (rowHasEmptyCell) {
        setTimedError("Please fill all cells in this row");
        return;
      }

      const formula = rowValues.join("");
      const result = eval(formula);

      if (result === correctFormulaResult) {
        // see if first figure is in the formala at all
        const formulaCopy = [...formulaArr];
        rowValues.forEach((value, index) => {
          const indexInFormula = formulaCopy.indexOf(value);

          if (indexInFormula === -1) {
            // highlight grey
            setBoard((prevBoard) => {
              const newBoard = [...prevBoard];
              newBoard[currentCell.row][index].correctness = "incorrect";
              return newBoard;
            });

            setKeyboardCorrectness((prevCorrectness) => {
              const newCorrectness = { ...prevCorrectness };
              if (shouldOverwrite(prevCorrectness[value], "incorrect")) {
                newCorrectness[value] = "incorrect";
              }
              return newCorrectness;
            });
          } else {
            // check if figure is in the right place
            const isRightPlace = indexInFormula === index;
            // remove it from the array without changing the length
            formulaCopy[indexInFormula] = "";
            if (!isRightPlace) {
              // highlight yellow
              setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                newBoard[currentCell.row][index].correctness = "inFormula";
                return newBoard;
              });
              setKeyboardCorrectness((prevCorrectness) => {
                const newCorrectness = { ...prevCorrectness };
                if (shouldOverwrite(prevCorrectness[value], "inFormula")) {
                  newCorrectness[value] = "inFormula";
                }
                return newCorrectness;
              });
            } else {
              // highlight green
              setBoard((prevBoard) => {
                const newBoard = [...prevBoard];
                newBoard[currentCell.row][index].correctness = "correct";
                return newBoard;
              });
              setKeyboardCorrectness((prevCorrectness) => {
                const newCorrectness = { ...prevCorrectness };
                if (shouldOverwrite(prevCorrectness[value], "correct")) {
                  newCorrectness[value] = "correct";
                }
                return newCorrectness;
              });
            }
          }
        });

        if (currentCell.row !== ROW_COUNT - 1) {
          setCurrentCell((prevCell) => {
            const newCell = { ...prevCell };
            newCell.row++;
            newCell.column = 0;
            return newCell;
          });
        }
      } else {
        // 2. formula doesn't equal correctFormulaResult
        const errorString = `The formula does not equal ${correctFormulaResult}, please try again`;
        setTimedError(errorString);
      }
    }

    if (key === "Backspace") {
      const currentCellIsEmpty =
        board[currentCell.row][currentCell.column].value === "";

      if (currentCellIsEmpty && currentCell.column !== 0) {
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          newBoard[currentCell.row][currentCell.column - 1].value = "";
          return newBoard;
        });
        setCurrentCell((prevCell) => {
          const newCell = { ...prevCell };
          newCell.column--;
          return newCell;
        });
      } else {
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          newBoard[currentCell.row][currentCell.column].value = "";
          return newBoard;
        });
      }
    }

    // if number or operator is pressed, set the number and advance to the next cell
    if (keyType === "value" || keyType === "operator") {
      const currentCellIsEmpty =
        board[currentCell.row][currentCell.column].value === "";
      if (!currentCellIsEmpty && currentCell.column === COLUMN_COUNT - 1) {
        return;
      } else {
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          newBoard[currentCell.row][currentCell.column].value = key;
          return newBoard;
        });

        setCurrentCell((prevCell) => {
          const newCell = { ...prevCell };
          if (newCell.column !== COLUMN_COUNT - 1) {
            newCell.column++;
          }
          return newCell;
        });
      }
    }
  };

  useKeyUp(
    (event: KeyboardEvent) => {
      gameLogic(event.key);
    },
    [...values, ...operators, ...utils],
    isEnabled
  );

  useEffect(() => {
    board.forEach((row) => {
      const rowIsCorrect = row.every((cell) => cell.correctness === "correct");

      const rowIsCommutative = row.every(
        (cell) =>
          cell.correctness === "inFormula" || cell.correctness === "correct"
      );
      if (rowIsCorrect || rowIsCommutative) {
        setSuccess("You got it right!");
        setIsEnabled(false);
        return;
      }
    });
  }, [board]);

  return (
    <div>
      {error && <Notification msg={error} type="error" />}
      {success && <Notification msg={success} type="success" />}
      <p>Find the calculation that equals {correctFormulaResult}</p>
      <div className="pb-2">
        {board.map((_row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-1">
            {_row.map((_column, columnIndex) => (
              // TODO maybe highlight the current cell
              <div
                className={cn(
                  "text-xl w-14 h-10 border-solid border-2 flex items-center",
                  "justify-center mx-0.5 font-bold rounded bg-white border-[#D4DDEB] cell-animation",
                  correctnessMap[board[rowIndex][columnIndex].correctness]
                )}
                key={columnIndex}
              >
                {board[rowIndex][columnIndex].value}
              </div>
            ))}
          </div>
        ))}
        <Keyboard handler={gameLogic} correctness={keyboardCorrectness} />
      </div>
    </div>
  );
}
