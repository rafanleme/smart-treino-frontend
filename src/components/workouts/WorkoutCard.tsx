import { Card, Typography, Space, Button, Popconfirm, Tag } from 'antd';
import { EditOutlined, CopyOutlined, DeleteOutlined, ThunderboltOutlined } from '@ant-design/icons';
import type { Workout } from '../../types';

const { Text, Paragraph } = Typography;

interface WorkoutCardProps {
  workout: Workout;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function WorkoutCard({ workout, onEdit, onDuplicate, onDelete }: WorkoutCardProps) {
  return (
    <Card
      title={
        <Space>
          {workout.name}
          {workout.is_ai_generated && (
            <Tag icon={<ThunderboltOutlined />} color="purple">
              IA
            </Tag>
          )}
        </Space>
      }
      extra={
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={onEdit}
          >
            Editar
          </Button>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={onDuplicate}
          >
            Duplicar
          </Button>
          <Popconfirm
            title="Excluir treino"
            description="Tem certeza que deseja excluir este treino?"
            onConfirm={onDelete}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            >
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      }
    >
      {workout.description && (
        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{ marginBottom: 12 }}
        >
          {workout.description}
        </Paragraph>
      )}

      <Space orientation="vertical" style={{ width: '100%' }}>
        <Text type="secondary">
          <strong>{workout.exercises_count || 0}</strong> exercícios
        </Text>
        {workout.estimated_duration_min && (
          <Text type="secondary">
            Duração estimada: <strong>{workout.estimated_duration_min} min</strong>
          </Text>
        )}
      </Space>
    </Card>
  );
}
