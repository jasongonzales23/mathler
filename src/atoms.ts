import { COLUMN_COUNT, ROW_COUNT } from "./constants";
import { atom } from "jotai";

const initBoard = Array.from({ length: ROW_COUNT }).map(() =>
  Array.from({ length: COLUMN_COUNT }, () => ({
    value: "",
    correctness: "neutral",
  }))
);

export const boardAtom = atom(initBoard);

export const currentCellAtom = atom({ row: 0, column: 0 });
