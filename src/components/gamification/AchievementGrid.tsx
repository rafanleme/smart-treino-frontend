import { Row, Col, Segmented, Empty } from 'antd';
import { useState } from 'react';
import type { Achievement, AchievementCategory } from '../../types';
import { AchievementBadge } from './AchievementBadge';

interface AchievementGridProps {
  achievements: Achievement[];
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({ achievements }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | AchievementCategory>('all');

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);
    
  return (
    <div>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Segmented
          options={[
            { label: 'Todas', value: 'all' },
            { label: 'Consistência', value: 'consistency' },
            { label: 'Força', value: 'strength' },
            { label: 'Avaliação', value: 'assessment' },
            { label: 'Marcos', value: 'milestone' },
          ]}
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value as 'all' | AchievementCategory)}
        />
      </div>

      {filteredAchievements.length === 0 ? (
        <Empty description="Nenhuma conquista encontrada" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredAchievements.map((achievement) => (
            <Col key={achievement.id} xs={24} sm={12} md={8} lg={6}>
              <AchievementBadge achievement={achievement} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
