import { Table, Tag } from 'antd';
import type { SessionSet } from '../../types';

interface SetLogTableProps {
  sets: SessionSet[];
}

export function SetLogTable({ sets }: SetLogTableProps) {
  const columns = [
    {
      title: 'Série',
      dataIndex: 'set_number',
      key: 'set_number',
      width: 70,
      render: (num: number) => `#${num}`,
    },
    {
      title: 'Reps',
      dataIndex: 'reps_completed',
      key: 'reps_completed',
      width: 80,
      render: (reps: number | null) => reps !== null ? reps : '-',
    },
    {
      title: 'Carga (kg)',
      dataIndex: 'load_kg',
      key: 'load_kg',
      width: 100,
      render: (load: number | null) => load ? Number(load).toFixed(1) : '-',
    },
    {
      title: 'RPE',
      dataIndex: 'rpe',
      key: 'rpe',
      width: 70,
      render: (rpe: number | null) => rpe ? (
        <Tag color={rpe >= 9 ? 'red' : rpe >= 7 ? 'orange' : 'green'}>{rpe}</Tag>
      ) : '-',
    },
  ];

  if (sets.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
        Nenhuma série registrada ainda
      </div>
    );
  }

  return (
    <Table
      dataSource={sets}
      columns={columns}
      rowKey="id"
      pagination={false}
      size="small"
    />
  );
}
