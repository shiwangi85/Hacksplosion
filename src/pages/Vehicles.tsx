import React from 'react';
import { Battery, MapPin, Gauge } from 'lucide-react';
import { Vehicle } from '../types';

const vehicles: Vehicle[] = [
  {
    id: '1',
    type: 'Electric Bus',
    status: 'Active',
    currentLocation: 'Central Station',
    emissions: 0,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    type: 'Hybrid Van',
    status: 'Maintenance',
    currentLocation: 'Service Center',
    emissions: 12.5,
    created_at: new Date().toISOString()
  }
];

export default function Vehicles() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-400">Fleet Management</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Add Vehicle
        </button>
      </div>

      <div className="grid gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-white">{vehicle.type}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    vehicle.status === 'Active' ? 'bg-green-600' : 'bg-yellow-600'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-5 h-5" />
                    <span>{vehicle.currentLocation}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Gauge className="w-5 h-5" />
                    <span>Emissions: {vehicle.emissions} CO₂/km</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Battery className="w-8 h-8 text-green-400" />
                <span className="text-sm text-gray-400 mt-1 block">85% Battery</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}