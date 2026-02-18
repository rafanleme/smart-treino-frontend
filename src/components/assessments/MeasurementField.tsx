import { Form, InputNumber } from 'antd';

interface MeasurementFieldProps {
  name: string;
  label: string;
  suffix: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  required?: boolean;
}

export function MeasurementField({
  name,
  label,
  suffix,
  min = 0,
  max = 999,
  step = 0.1,
  precision = 1,
  required = false,
}: MeasurementFieldProps) {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        { required, message: `${label} é obrigatório` },
        { type: 'number', min, max, message: `Valor deve estar entre ${min} e ${max}` },
      ]}
    >
      <InputNumber
        style={{ width: '100%' }}
        min={min}
        max={max}
        step={step}
        precision={precision}
        addonAfter={suffix}
        placeholder={`Ex: 70${suffix}`}
      />
    </Form.Item>
  );
}
