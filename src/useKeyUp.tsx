import { useEffect } from "react";

export const useKeyUp = (
  callback: Function,
  keys: string[],
  isEnabled: boolean
) => {
  const onKeyUp = (event: KeyboardEvent) => {
    const wasAnyKeyPressed = keys.some((key) => event.key === key);
    if (wasAnyKeyPressed) {
      event.preventDefault();
      callback(event);
    }
  };

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyUp, isEnabled]);
};
