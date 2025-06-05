import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  bgColor?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  bgColor = 'bg-primary-50'
}) => {
  return (
    <div className="card">
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
            {change !== undefined && (
              <p 
                className={`ml-2 flex items-center text-sm font-medium ${
                  change >= 0 ? 'text-success-600' : 'text-error-600'
                }`}
              >
                {change >= 0 ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
                {Math.abs(change)}%
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;