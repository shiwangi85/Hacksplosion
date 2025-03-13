import React, { useEffect, useState } from 'react';
import { Leaf, Droplet, Wind } from 'lucide-react';
import { SustainabilityMetric } from '../types';

const Sustainability = () => {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);

  useEffect(() => {
    const storedMetrics = JSON.parse(localStorage.getItem('sustainabilityMetrics') || '[]');
    setMetrics(storedMetrics);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-400">Sustainability Impact</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <Leaf className="w-8 h-8 text-green-400 mb-2" />
          <h3 className="font-semibold text-white">CO₂ Saved</h3>
          <p className="text-2xl font-bold text-green-400">
            {metrics.reduce((total, metric) => total + metric.co2Saved, 0).toFixed(2)} kg
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <Droplet className="w-8 h-8 text-blue-400 mb-2" />
          <h3 className="font-semibold text-white">Energy Efficiency</h3>
          <p className="text-2xl font-bold text-blue-400">
            {metrics.length > 0 ? (metrics.reduce((total, metric) => total + metric.energyEfficiency, 0) / metrics.length).toFixed(2) : 0}%
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <Wind className="w-8 h-8 text-purple-400 mb-2" />
          <h3 className="font-semibold text-white">Green Score</h3>
          <p className="text-2xl font-bold text-purple-400">
            {metrics.length > 0 ? (metrics.reduce((total, metric) => total + metric.greenScore, 0) / metrics.length).toFixed(2) : 0}
          </p>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Daily Metrics</h2>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">{new Date(metric.date).toLocaleDateString()}</span>
                <span className="text-green-400 font-bold">{metric.greenScore} points</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-gray-300">
                  <span className="text-sm">CO₂ Saved:</span>
                  <span className="ml-2 text-green-400">{metric.co2Saved} kg</span>
                </div>
                <div className="text-gray-300">
                  <span className="text-sm">Efficiency:</span>
                  <span className="ml-2 text-blue-400">{metric.energyEfficiency}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sustainability;


