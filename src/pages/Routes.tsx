import React from 'react';
import { MapPin, Clock, Activity } from 'lucide-react';
import { Route } from '../types';

const routes: Route[] = [
  {
    id: '1',
    name: 'Downtown Express',
    startPoint: 'Central Station',
    endPoint: 'Business District',
    distance: 5.2,
    estimatedTime: 15,
    optimizationScore: 85,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Airport Link',
    startPoint: 'City Center',
    endPoint: 'International Airport',
    distance: 12.8,
    estimatedTime: 35,
    optimizationScore: 92,
    created_at: new Date().toISOString()
  }
];

export default function Routes() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-400">Routes</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add New Route
        </button>
      </div>

      <div className="grid gap-6">
        {routes.map((route) => (
          <div key={route.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">{route.name}</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-5 h-5" />
                    <span>From: {route.startPoint}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-5 h-5" />
                    <span>To: {route.endPoint}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-right">
                <div className="flex items-center gap-2 justify-end text-gray-300">
                  <Clock className="w-5 h-5" />
                  <span>{route.estimatedTime} mins</span>
                </div>
                <div className="flex items-center gap-2 justify-end text-gray-300">
                  <Activity className="w-5 h-5" />
                  <span>{route.optimizationScore}% optimized</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}