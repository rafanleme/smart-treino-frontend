import { useState, useEffect } from 'react';
import { Form, InputNumber, Slider, Button, Space, message } from 'antd';
import { sessionService } from '../../services/sessionService';
import type { SessionSet } from '../../types';

interface SetLoggerProps {
  sessionExerciseId: number;
  onSetLogged: (set: SessionSet) => void;
  onRestStart: (duration: number) => void;
  defaultRestSeconds?: number;
  previousSets?: SessionSet[];
}

export function SetLogger({
  sessionExerciseId,
  onSetLogged,
  onRestStart,
  defaultRestSeconds = 60,
  previousSets = [],
}: SetLoggerProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Get last set data to prefill form
  const lastSet = previousSets.length > 0 ? previousSets[previousSets.length - 1] : null;

  // Update form values when last set changes
  useEffect(() => {
    if (lastSet) {
      form.setFieldsValue({
        reps: lastSet.reps_completed,
        load: lastSet.load_kg,
        rpe: lastSet.rpe,
      });
    }
  }, [lastSet, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await sessionService.logSet(sessionExerciseId, {
        reps_completed: values.reps,
        load_kg: values.load,
        rpe: values.rpe,
        rest_seconds: defaultRestSeconds,
      });

      const newSet = response.data.data;
      onSetLogged(newSet);

      // Prefill form with the values that were just logged
      // (they will become the "last set" for the next registration)
      form.setFieldsValue({
        reps: newSet.reps_completed,
        load: newSet.load_kg,
        rpe: newSet.rpe,
      });

      message.success('Série registrada!');

      // Start rest timer
      onRestStart(defaultRestSeconds);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao registrar série');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        reps: lastSet?.reps_completed,
        load: lastSet?.load_kg,
        rpe: lastSet?.rpe || 7,
      }}
    >
      <Space orientation="vertical" style={{ width: '100%' }} size="large">
        <Space style={{ width: '100%' }} size="middle">
          <Form.Item
            name="reps"
            label="Repetições"
            style={{ marginBottom: 0, flex: 1 }}
          >
            <InputNumber
              min={0}
              max={100}
              placeholder="12"
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="load"
            label="Carga (kg)"
            style={{ marginBottom: 0, flex: 1 }}
          >
            <InputNumber
              min={0}
              step={0.5}
              placeholder="0.0"
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Space>

        <Form.Item
          name="rpe"
          label="RPE (Esforço Percebido)"
          style={{ marginBottom: 0 }}
        >
          <Slider
            min={1}
            max={10}
            marks={{
              1: '1',
              5: '5',
              7: '7',
              9: '9',
              10: '10',
            }}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          block
        >
          Registrar Série
        </Button>
      </Space>
    </Form>
  );
}
