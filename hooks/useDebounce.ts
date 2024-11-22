import { useState, useEffect } from "react";

function useDebounce<T>(callback: (input: T) => void, delay: number = 500, defaultValue?: T) {
  const [userInput, setUserInput] = useState<T | undefined>(defaultValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (userInput !== undefined) {
        callback(userInput);
      }
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [userInput, delay, callback]);

  return [userInput, setUserInput] as const;
}

export default useDebounce;
