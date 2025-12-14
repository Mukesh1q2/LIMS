'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'emerald' | 'amber' | 'indigo' | 'rose' | 'teal' | 'cyan' | 'orange' | 'lime';
}

const colorVariants = {
  blue: 'bg-blue-50 text-blue-600 border-blue-200',
  green: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  red: 'bg-rose-50 text-rose-600 border-rose-200',
  purple: 'bg-purple-50 text-purple-600 border-purple-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  rose: 'bg-rose-50 text-rose-600 border-rose-200',
  teal: 'bg-teal-50 text-teal-600 border-teal-200',
  cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  orange: 'bg-orange-50 text-orange-600 border-orange-200',
  lime: 'bg-lime-50 text-lime-600 border-lime-200',
};

const changeColorVariants = {
  increase: 'text-emerald-600',
  decrease: 'text-rose-600',
  neutral: 'text-neutral-600',
};

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  color 
}: StatsCardProps) {
  return (
    <div className="card p-6 hover:shadow-hover transition-all duration-200">
      <div className="flex items-center">
        <div className={cn(
          "flex-shrink-0 p-3 rounded-lg border",
          colorVariants[color]
        )}>
          {icon}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-neutral-900">{value}</p>
          </div>
          <p className={cn(
            "text-sm mt-1",
            changeColorVariants[changeType]
          )}>
            {change}
          </p>
        </div>
      </div>
    </div>
  );
}