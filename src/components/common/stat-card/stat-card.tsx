import React from 'react';
import { Card } from '@/components';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = ''
}) => {
  const trendColors = {
    up: 'text-success',
    down: 'text-error',
    neutral: 'text-text-tertiary'
  };

  return (
    <Card className={`${className}`} padding="medium">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-tertiary">{title}</p>
          <p className="text-3xl font-bold text-secondary mt-1">{value}</p>
          {subtitle && (
            <p className={`text-sm mt-1 ${trend ? trendColors[trend] : 'text-text-tertiary'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-2xl text-text-tertiary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};