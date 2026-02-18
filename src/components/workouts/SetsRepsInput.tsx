import { Space, InputNumber, Input } from 'antd';

interface SetsRepsInputProps {
  sets: number;
  reps: string;
  restSeconds: number;
  onSetsChange: (value: number | null) => void;
  onRepsChange: (value: string) => void;
  onRestChange: (value: number | null) => void;
  onSetsBlur?: () => void;
  onRepsBlur?: () => void;
  onRestBlur?: () => void;
}

export function SetsRepsInput({
  sets,
  reps,
  restSeconds,
  onSetsChange,
  onRepsChange,
  onRestChange,
  onSetsBlur,
  onRepsBlur,
  onRestBlur,
}: SetsRepsInputProps) {
  return (
    <Space.Compact style={{ width: '100%' }}>
      <InputNumber
        addonBefore="Séries"
        min={1}
        max={50}
        value={sets}
        onChange={onSetsChange}
        onBlur={onSetsBlur}
        style={{ width: '33%' }}
      />
      <Input
        addonBefore="Reps"
        value={reps}
        onChange={(e) => onRepsChange(e.target.value)}
        onBlur={onRepsBlur}
        placeholder="12"
        style={{ width: '34%' }}
      />
      <InputNumber
        addonBefore="Descanso(s)"
        min={0}
        max={600}
        value={restSeconds}
        onChange={onRestChange}
        onBlur={onRestBlur}
        style={{ width: '33%' }}
      />
    </Space.Compact>
  );
}
