





import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

const emergencies = [
  { id: '1', type: 'Petrol Pump', priority: 2, status: 'Available', location: 'Shell Petrol Pump, Bellandur' },
  { id: '2', type: 'Fire Truck', priority: 2, status: 'On Duty', location: 'Bellandur Fire Station' },
  { id: '3', type: 'Ambulance', priority: 1, status: 'Responding', location: 'Manipal Hospital, Bellandur' }
];

const nearbyHospitals = [
  { name: "Manipal Hospital", eta: "8 mins", distance: "2.5 km", phone: "+91 9876543210" },
  { name: "Columbia Asia Hospital", eta: "12 mins", distance: "4.2 km", phone: "+91 9876543220" },
  { name: "Cloudnine Hospital", eta: "15 mins", distance: "5.5 km", phone: "+91 9876543230" }
];

const nearbyFireStations = [
  { name: "Bellandur Fire Station", eta: "5 mins", distance: "1.8 km", phone: "+91 9876543211" },
  { name: "Whitefield Fire Station", eta: "10 mins", distance: "3.7 km", phone: "+91 9876543221" },
  { name: "HSR Fire Brigade", eta: "12 mins", distance: "4.8 km", phone: "+91 9876543231" }
];

const nearbyPetrolPumps = [
  { name: "Shell Petrol Pump", eta: "3 mins", distance: "1.2 km", phone: "+91 9876543222" },
  { name: "Indian Oil Station", eta: "5 mins", distance: "2.0 km", phone: "+91 9876543223" },
  { name: "HP Petrol Pump", eta: "7 mins", distance: "3.1 km", phone: "+91 9876543233" }
];

export default function Emergency() {
  const [expandedEmergencies, setExpandedEmergencies] = useState({});
  const [loading, setLoading] = useState({});

  const toggleDetails = (id) => {
    if (!expandedEmergencies[id]) {
      setLoading((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setExpandedEmergencies((prev) => ({ ...prev, [id]: true }));
        setLoading((prev) => ({ ...prev, [id]: false }));
      }, 1500);
    } else {
      setExpandedEmergencies((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (

         <div> <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-500 text-transparent bg-clip-text  font-serif top-0 left-0 bottom-10 ">Emergency</h1>

<div className="p-10 max-w-7xl w-3/2 mx-auto bg-gray-900 rounded-lg shadow-lg text-white">
 
      <h1 className="text-3xl font-bold text-blue-400 mb-4 text-center">Emergency Services Near Bellandur</h1>
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
                <div className="mt-4 flex gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>{emergency.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span>ETA(Estimated Time Of Arrival) : {Math.floor(Math.random() * 10) + 3} mins</span>
                  </div>
                </div>

                <button onClick={() => toggleDetails(emergency.id)} className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full">
                  {emergency.type === 'Ambulance' ? '🏥 Nearby Hospitals' : emergency.type === 'Fire Truck' ? '🚒 Nearby Fire Stations' : '⛽ Nearby Petrol Pumps'}
                </button>

                {expandedEmergencies[emergency.id] && !loading[emergency.id] && (
                  <div className="mt-4 bg-gray-700 p-4 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold mb-2">{emergency.type === 'Ambulance' ? 'Nearby Hospitals' : emergency.type === 'Fire Truck' ? 'Nearby Fire Stations' : 'Nearby Petrol Pumps'}</h3>
                    <ul className="flex gap-4">
                      {(emergency.type === 'Ambulance' ? nearbyHospitals : emergency.type === 'Fire Truck' ? nearbyFireStations : nearbyPetrolPumps).map((place, index) => (
                        <li key={index} className="bg-gray-800 p-3 rounded-lg">
                          <p className="text-white font-medium">{place.name}</p>
                          <p className="text-gray-300">ETA(Estimated Time Of Arrival): {place.eta}</p>
                          <p className="text-gray-300">Distance: {place.distance}</p>
                          <p className="text-gray-300">Phone: {place.phone}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {loading[emergency.id] && <p className="mt-4 text-gray-400">Fetching nearby locations...</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
  );
}