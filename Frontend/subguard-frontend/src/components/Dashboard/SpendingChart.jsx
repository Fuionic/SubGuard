import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', cost: 1100 },
  { name: 'Feb', cost: 1150 },
  { name: 'Mar', cost: 1050 },
  { name: 'Apr', cost: 1200 },
  { name: 'May', cost: 1180 },
  { name: 'Jun', cost: 1247 }, // Current month
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--glass-border-strong)',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px var(--glass-shadow)',
        color: 'var(--text-primary)'
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
        <p style={{ margin: '5px 0 0 0', color: 'var(--text-accent)' }}>
          ₹{payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const SpendingChart = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  const textColor = isDark ? '#cbd5e1' : '#64748B';

  return (
    <div className="chart-section glass">
      <h3>Monthly Spending Trend</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 13 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: textColor, fontSize: 13 }} dx={-10} tickFormatter={(value) => `₹${value}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="cost" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
