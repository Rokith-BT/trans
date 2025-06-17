import { Box, Text } from '@/atoms';
import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';

// Add blink animation
const blink = keyframes`
  0% { color: red; }
  50% { color: rgba(255, 0, 0, 0.5); }
  100% { color: red; }
`;

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export const calculateTimeRemaining = (targetDate: Date): TimeRemaining | null => {
  const now = new Date().getTime();
  const targetTime = targetDate.getTime();
  const difference = targetTime - now;

  if (difference <= 0) return null;

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
    totalMs: difference
  };
};

export const CountdownTimer = ({ targetDate, is24Hour }: { targetDate: string | Date; is24Hour?: boolean }) => {
  const parsedDate = new Date(targetDate);
  const isValid = !isNaN(parsedDate.getTime());

  const adjustedTargetDate = isValid && is24Hour ? new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000) : parsedDate;
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    isValid ? calculateTimeRemaining(adjustedTargetDate) : null
  );

  useEffect(() => {
    if (!isValid || !timeRemaining) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(adjustedTargetDate);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [adjustedTargetDate, timeRemaining, isValid]);

  if (!timeRemaining || !isValid) return null;

  const isCritical = timeRemaining.totalMs <= 30 * 60 * 1000; // 30 minutes in ms
  // If invalid, return null

  if (!isValid) return null;
  if (isNaN(parsedDate.getTime())) {
    return null;
  }
  return (
    <Box>
      <Text
        sx={{
          fontSize: '11px',
          fontWeight: 600,
          color: isCritical ? 'red' : 'inherit',
          animation: isCritical ? `${blink} 1s infinite` : 'none'
        }}
      >
        {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
      </Text>
    </Box>
  );
};
