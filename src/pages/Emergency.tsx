import React from 'react';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { EmergencyService } from '../types';

const emergencies: EmergencyService[] = [
  {
    id: '1',
    type: 'Ambulance',
    priority: 1,
    status: 'Responding',
    location: 'Downtown',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    type: 'Fire Truck',
    priority: 2,
    status: 'Available',
    location: 'North Station',
    created_at: new Date().toISOString()
  }
];

export default function Emergency() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-400">Emergency Services</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          Report Emergency
        </button>
      </div>

      <div className="grid gap-6">
        {emergencies.map((emergency) => (
          <div key={emergency.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-6 h-6 ${
                    emergency.priority === 1 ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <h3 className="text-xl font-semibold text-white">{emergency.type}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    emergency.status === 'Responding' ? 'bg-red-600' : 'bg-green-600'
                  }`}>
                    {emergency.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-5 h-5" />
                    <span>{emergency.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-5 h-5" />
                    <span>ETA: 5 mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}