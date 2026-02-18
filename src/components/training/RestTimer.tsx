import { useState, useEffect } from 'react';
import { Progress, Button, Space } from 'antd';
import { playBeep } from '../../utils/audio';

interface RestTimerProps {
  duration: number;
  onComplete: () => void;
  onSkip: () => void;
}

export function RestTimer({ duration, onComplete, onSkip }: RestTimerProps) {
  const [remaining, setRemaining] = useState(duration);

  useEffect(() => {
    if (remaining <= 0) {
      playBeep();
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onComplete]);

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
