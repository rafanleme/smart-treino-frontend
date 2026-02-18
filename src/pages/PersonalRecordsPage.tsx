import { Spin, Typography, Alert, Empty, Select, Space } from 'antd';
import { useState } from 'react';
import { PersonalRecordCard } from '../components/gamification/PersonalRecordCard';
import { usePersonalRecords } from '../hooks/usePersonalRecords';
import { PersonalRecord } from '../types';

const { Title, Paragraph } = Typography;

export function PersonalRecordsPage() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | undefined>();
  const { records, loading, error } = usePersonalRecords(selectedExerciseId);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Erro"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  // Group records by exercise
  const groupedRecords = records.reduce((acc, record) => {
    const exerciseId = record.exercise.id;
    if (!acc[exerciseId]) {
      acc[exerciseId] = [];
    }
    acc[exerciseId].push(record);
    return acc;
  }, {} as Record<number, PersonalRecord[]>);

  // Get unique exercises for filter
  const exercises = Array.from(new Set(records.map(r => r.exercise.id)))
    .map(id => {
      const record = records.find(r => r.exercise.id === id)!;
      return {
        value: id,
        label: record.exercise.name_pt,
      };
    });

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🏆 Records Pessoais</Title>
      <Paragraph type="secondary">
        Seus melhores desempenhos por exercício
      </Paragraph>

      {exercises.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <Select
            style={{ width: '300px' }}
            placeholder="Filtrar por exercício"
            allowClear
            options={[{ value: undefined, label: 'Todos os exercícios' }, ...exercises]}
            value={selectedExerciseId}
            onChange={setSelectedExerciseId}
          />
        </div>
      )}

      {records.length === 0 ? (
        <Empty description="Nenhum record pessoal ainda. Continue treinando!" />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {selectedExerciseId ? (
            // Show all records for selected exercise
            records.map(record => (
              <PersonalRecordCard key={record.id} record={record} />
            ))
          ) : (
            // Show latest record for each exercise
            Object.values(groupedRecords).map(exerciseRecords => {
              const latestRecord = exerciseRecords.sort((a, b) =>
                new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime()
              )[0];
              return <PersonalRecordCard key={latestRecord.id} record={latestRecord} />;
            })
          )}
        </Space>
      )}
    </div>
  );
}
