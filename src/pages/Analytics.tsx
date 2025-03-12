import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Sunday', hour: 'Distance Travelled: 20 km', co2Emission: 320 },
  { day: 'Monday', hour: 'Distance Travelled: 10 km', co2Emission: 200 },
  { day: 'Tuesday', hour: 'Distance Travelled: 18 km', co2Emission: 580 },
  { day: 'Wednesday', hour: 'Distance Travelled: 15 km', co2Emission: 890 },
  { day: 'Thursday', hour: 'Distance Travelled: 11 km', co2Emission: 760 },
  { day: 'Friday', hour: 'Distance Travelled: 19 km', co2Emission: 850 },
  { day: 'Saturday', hour: 'Distance Travelled: 12 km', co2Emission: 920 },
];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 text-white">
        <p className="text-blue-400 font-semibold">{payload[0].payload.hour}</p>
        <p>CO2 Emission: {payload[0].value} g</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-400">Analytics</h1>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">CO2 Emission Distribution</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="co2Emission" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

