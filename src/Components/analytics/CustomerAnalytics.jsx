import React from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-green-100 text-green-900 text-xs px-3 py-1.5 rounded-lg shadow-sm font-semibold text-center border border-green-200">
        <p className="mb-1">{label}</p>
        <p className="text-sm font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function CustomerAnalytics({ data }) {
  return (
    // ⚠️ CRITICAL FIX: This div MUST have a height (h-64, h-96, or style={{ height: 300 }})
    // If you remove 'h-64', the chart will crash with the error you saw.
    <div className="h-64 w-full min-w-0"> 
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 12 }} 
            dy={10}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '5 5' }} 
          />
          
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#22c55e" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}