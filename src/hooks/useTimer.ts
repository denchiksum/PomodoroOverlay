import { useEffect, useState } from "react";

export function useTimer(initial: number, onEnd: () => void) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          onEnd();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  const reset = (value: number) => {
    setSeconds(value);
    setRunning(false);
  };

  return { seconds, running, setRunning, reset };
}