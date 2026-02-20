import { useState, useEffect } from 'react';
import { Progress, Button, Space } from 'antd';
import { playBeep } from '../../utils/audio';

interface RestTimerProps {
  duration: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ duration, onComplete, onSkip }: RestTimerProps) {
  const [startTime] = useState(() => Date.now());
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    const calculateRemaining = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      return Math.max(0, duration - elapsed);
    };

    // Initial calculation
    setRemaining(calculateRemaining());

    // Update every second
    const interval = setInterval(() => {
      const newRemaining = calculateRemaining();
      setRemaining(newRemaining);

      if (newRemaining <= 0) {
        clearInterval(interval);
        playBeep();
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onComplete]);

  const percent = ((duration - remaining) / duration) * 100;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'center', padding: 24 }}>
      <Progress
        type="circle"
        percent={percent}
        format={() => formatTime(remaining)}
        strokeColor="#1890ff"
        size={180}
      />
      <div style={{ marginTop: 24 }}>
        <Space>
          <Button size="large" onClick={onSkip}>
            Pular Descanso
          </Button>
        </Space>
      </div>
    </div>
  );
}
