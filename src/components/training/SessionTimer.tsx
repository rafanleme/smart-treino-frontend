import { useState, useEffect } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface SessionTimerProps {
  startedAt: string;
}

export function SessionTimer({ startedAt }: SessionTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const calculateElapsed = () => {
      const start = new Date(startedAt).getTime();
      const now = Date.now();
      return Math.floor((now - start) / 1000);
    };

    setElapsed(calculateElapsed());

    const interval = setInterval(() => {
      setElapsed(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
        TEMPO DE TREINO
      </Text>
      <Text strong style={{ fontSize: 32, fontFamily: 'monospace' }}>
        {formatTime(elapsed)}
      </Text>
    </div>
  );
}
