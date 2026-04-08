import { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsed, setElapsed] = useState(0);

  // Timer tick
  useEffect(() => {
    if (!activeTimer) return;
    const iv = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [activeTimer]);

  const startTimer = (timerData) => {
    setActiveTimer(timerData);
    setElapsed(0);
  };

  const stopTimer = () => {
    setActiveTimer(null);
    setElapsed(0);
  };

  const resetTimer = () => {
    setElapsed(0);
  };

  return (
    <TimerContext.Provider value={{ activeTimer, setActiveTimer, elapsed, setElapsed, startTimer, stopTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
