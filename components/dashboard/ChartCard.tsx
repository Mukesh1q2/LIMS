'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data for charts
const attendanceData = [
  { date: 'Dec 1', present: 1080, absent: 170 },
  { date: 'Dec 2', present: 1120, absent: 130 },
  { date: 'Dec 3', present: 1050, absent: 200 },
  { date: 'Dec 4', present: 1180, absent: 70 },
  { date: 'Dec 5', present: 1100, absent: 150 },
  { date: 'Dec 6', present: 1150, absent: 100 },
  { date: 'Dec 7', present: 1020, absent: 230 },
  { date: 'Dec 8', present: 1080, absent: 170 },
  { date: 'Dec 9', present: 1120, absent: 130 },
  { date: 'Dec 10', present: 1050, absent: 200 },
  { date: 'Dec 11', present: 1180, absent: 70 },
  { date: 'Dec 12', present: 1100, absent: 150 },
  { date: 'Dec 13', present: 1150, absent: 100 },
];

const feeData = [
  { month: 'Jul', collected: 850000, target: 1000000 },
  { month: 'Aug', collected: 920000, target: 1000000 },
  { month: 'Sep', collected: 780000, target: 1000000 },
  { month: 'Oct', collected: 1100000, target: 1000000 },
  { month: 'Nov', collected: 950000, target: 1000000 },
  { month: 'Dec', collected: 1250000, target: 1000000 },
];

const seatData = [
  { name: 'Occupied', value: 1150, color: '#3B82F6' },
  { name: 'Available', value: 100, color: '#E5E7EB' },
];

interface ChartCardProps {
  title: string;
  description: string;
  chartType: 'line' | 'bar' | 'pie';
}

export function ChartCard({ title, description, chartType }: ChartCardProps) {
  const [activeTab, setActiveTab] = useState('30d');

  const tabs = ['7d', '30d', '90d'];

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="present" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                name="Present"
              />
              <Line 
                type="monotone" 
                dataKey="absent" 
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                name="Absent"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={feeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748B"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [`₹${(value / 100000).toFixed(1)}L`, '']}
              />
              <Legend />
              <Bar 
                dataKey="collected" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                name="Collected"
              />
              <Bar 
                dataKey="target" 
                fill="#E5E7EB" 
                radius={[4, 4, 0, 0]}
                name="Target"
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={seatData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {seatData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
        
        {chartType === 'line' && (
          <div className="flex space-x-1 bg-neutral-100 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  activeTab === tab
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        {renderChart()}
      </div>
    </div>
  );
}