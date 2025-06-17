import React, { useState, useEffect } from 'react';

// TimerCell component for countdown logic
export const TimerCell: React.FC<{ initialTime: number }> = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000); // 1 second interval for precise countdown

    return () => clearInterval(timerId); // Cleanup
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return <span className='text-sm'>{formatTime(timeLeft)}</span>;
};
