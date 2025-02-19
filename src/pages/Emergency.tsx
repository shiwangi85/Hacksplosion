

import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

const emergencies = [
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

// Updated nearby hospitals (6 hospitals)
const nearbyHospitals = [
  { name: "City Hospital", eta: "10 mins", phone: "+91 9876543210" },
  { name: "Metro Medical Center", eta: "12 mins", phone: "+91 9876543220" },
  { name: "Green Valley Hospital", eta: "15 mins", phone: "+91 9876543230" },
  { name: "Sunrise Hospital", eta: "8 mins", phone: "+91 9876543240" },
  { name: "Lakeview Medical", eta: "14 mins", phone: "+91 9876543250" },
  { name: "Hilltop Clinic", eta: "18 mins", phone: "+91 9876543260" }
];

const nearbyFireStations = [
  { name: "Central Fire Station", eta: "5 mins", phone: "+91 9876543211" },
  { name: "North Fire Department", eta: "7 mins", phone: "+91 9876543221" },
  { name: "East Fire Station", eta: "10 mins", phone: "+91 9876543231" }
];

export default function Emergency() {
  const [showHospitals, setShowHospitals] = useState(false);
  const [showFireStations, setShowFireStations] = useState(false);

  return (
    <div className="p-10 max-w-4xl w-3/4 mx-auto bg-gray-900 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">Emergency Services</h1>

      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full">
        Report Emergency
      </button>

      <div className="grid gap-6 mt-6">
        {emergencies.map((emergency) => (
          <div key={emergency.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-6 h-6 ${emergency.priority === 1 ? 'text-red-500' : 'text-yellow-500'}`} />
                  <h3 className="text-xl font-semibold">{emergency.type}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${emergency.status === 'Responding' ? 'bg-red-600' : 'bg-green-600'}`}>
                    {emergency.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{emergency.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>ETA: 5 mins</span>
                  </div>
                </div>

                {/* Nearby Locations Button */}
                {emergency.type === 'Ambulance' && (
                  <>
                    <button
                      onClick={() => setShowHospitals((prev) => !prev)}
                      className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
                    >
                      🏥 Nearby Hospitals
                    </button>

                    {/* Hospital Details - Show only when button is clicked */}
                    {showHospitals && (
                      <div className="mt-4 bg-gray-700 p-4 rounded-lg border border-gray-600 w-full">
                        <h3 className="text-lg font-semibold mb-2">Nearby Hospitals</h3>

                        {/* Responsive Grid Layout */}
                        <div className="grid grid-cols-2 gap-4">
                          {nearbyHospitals.map((hospital, index) => (
                            <div key={index} className="bg-gray-800 p-3 rounded-lg">
                              <p className="text-white font-medium">{hospital.name}</p>
                              <p className="text-gray-300">ETA: {hospital.eta}</p>
                              <p className="text-gray-300">Phone: {hospital.phone}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {emergency.type === 'Fire Truck' && (
                  <>
                    <button
                      onClick={() => setShowFireStations((prev) => !prev)}
                      className="mt-4 flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition w-full"
                    >
                      🚒 Nearby Fire Stations
                    </button>

                    {/* Fire Station Details - Show only when button is clicked */}
                    {showFireStations && (
                      <div className="mt-4 bg-gray-700 p-4 rounded-lg border border-gray-600">
                        <h3 className="text-lg font-semibold mb-2">Nearby Fire Stations</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {nearbyFireStations.map((station, index) => (
                            <div key={index} className="bg-gray-800 p-3 rounded-lg">
                              <p className="text-white font-medium">{station.name}</p>
                              <p className="text-gray-300">ETA: {station.eta}</p>
                              <p className="text-gray-300">Phone: {station.phone}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}










