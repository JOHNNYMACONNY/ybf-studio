import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
  data: { date: string; total: number }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <div className="bg-black rounded-xl ring-1 ring-neutral-700/60 p-6 h-96">
      <h3 className="text-card-title font-semibold mb-4">Last 30 Days Sales</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#a3a3a3', fontSize: 12 }} 
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis tick={{ fill: '#a3a3a3', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
          <Tooltip
            cursor={{ fill: '#171717' }}
            contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #262626' }}
            labelStyle={{ color: '#fafafa' }}
          />
          <Bar dataKey="total" name="Sales" fill="#fca311" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;