import { useState } from "react";

const useError = () => {
  const [error, setError] = useState<string | null>();

  const setTimedError = (message: string) => {
    setError(message);
    setTimeout(() => {
      clearError();
    }, 3000);
  };
  const clearError = () => setError(null);
  return { error, setTimedError, setError, clearError };
};

export default useError;
