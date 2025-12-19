
import React from 'react';
import { Habit } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsGraphProps {
  habit: Habit;
  height?: number;
}

const StatsGraph: React.FC<StatsGraphProps> = ({ habit, height = 200 }) => {
  // Generate mock data for visualization of the last 10 days or historical data
  // In a real app, we'd calculate streaks from relapseHistory
  const data = [
    { name: '7d ago', value: 4 },
    { name: '6d ago', value: 7 },
    { name: '5d ago', value: 2 },
    { name: '4d ago', value: 5 },
    { name: '3d ago', value: 9 },
    { name: '2d ago', value: 12 },
    { name: '1d ago', value: 15 },
    { name: 'Today', value: Math.floor((Date.now() - habit.lastResetDate) / (1000 * 60 * 60 * 24)) + 1 },
  ];

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            hide 
          />
          <YAxis hide domain={[0, 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px' }}
            itemStyle={{ color: '#f59e0b' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#f59e0b" 
            fillOpacity={1} 
            fill="url(#colorVal)" 
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsGraph;
