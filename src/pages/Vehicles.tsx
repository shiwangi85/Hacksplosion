
import React, { useEffect, useState } from 'react';
import { Battery, MapPin, Gauge, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'vehicles';

export default function Vehicles() {
  // Initialize state with a function to handle potential JSON parsing errors
  const [vehicles, setVehicles] = useState(() => {
    try {
      const savedVehicles = localStorage.getItem(STORAGE_KEY);
      return savedVehicles ? JSON.parse(savedVehicles) : [];
    } catch (error) {
      console.error('Error loading vehicles from localStorage:', error);
      return [];
    }
  });

  const [newVehicle, setNewVehicle] = useState({
    car_type: '',
    veh_name: '',
    veh_mileage: '',
    fuel_type: '',
    status: 'Active',
    emissions: 0,
    battery: 100
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Save to localStorage whenever vehicles change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
    } catch (error) {
      console.error('Error saving vehicles to localStorage:', error);
    }
  }, [vehicles]);

  const handleAddVehicle = () => {
    // Generate a unique ID using timestamp + random number
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const updatedVehicles = [...vehicles, { id: newId, ...newVehicle }];
    
    try {
      setVehicles(updatedVehicles);
      setNewVehicle({
        car_type: '',
        veh_name: '',
        veh_mileage: '',
        fuel_type: '',
        status: 'Active',
        emissions: 0,
        battery: 100
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Failed to add vehicle. Please try again.');
    }
  };

  const handleDeleteVehicle = (id) => {
    try {
      const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
      setVehicles(updatedVehicles);
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle. Please try again.');
    }
  };

  // Validate that required fields are filled before allowing submission
  const isFormValid = () => {
    return (
      newVehicle.car_type.trim() !== '' &&
      newVehicle.veh_name.trim() !== '' &&
      newVehicle.veh_mileage.trim() !== '' &&
      newVehicle.fuel_type.trim() !== ''
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-400">Fleet Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Vehicle
        </button>
      </div>

      <div className="grid gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-white">{vehicle.car_type}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    vehicle.status === 'Active' ? 'bg-green-600' : 'bg-yellow-600'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-bold">Vehicle Detail:</span> {vehicle.veh_name}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-bold">Mileage Of Vehicle:</span> {vehicle.veh_mileage} km/l
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-bold">Fuel Consumption Type:</span> {vehicle.fuel_type}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Gauge className="w-5 h-5" />
                    <span>Emissions: 23 kg CO₂</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {/* <Battery className="w-8 h-8 text-green-400" /> */}
                {/* <span className="text-sm text-gray-400 mt-1 block">{vehicle.battery}% Battery</span> */}
                <button 
                  onClick={() => handleDeleteVehicle(vehicle.id)} 
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-96">
            <h2 className="text-xl font-bold text-white mb-4">Add New Vehicle</h2>
            
            <label className="block text-sm font-medium text-white mb-2">
              Vehicle Type
            </label>
            <input
              type="text"
              placeholder="Car, Truck, Bike"
              value={newVehicle.car_type}
              onChange={(e) => setNewVehicle({ ...newVehicle, car_type: e.target.value })}
              className="block w-full p-2 mb-3 bg-gray-700 text-white rounded-lg"
            />

            <label className="block text-sm font-medium text-white mb-2">
              Vehicle Detail
            </label>
            <input
              type="text"
              placeholder="Swift Zro-0"
              value={newVehicle.veh_name}
              onChange={(e) => setNewVehicle({ ...newVehicle, veh_name: e.target.value })}
              className="block w-full p-2 mb-3 bg-gray-700 text-white rounded-lg"
            />

            <label className="block text-sm font-medium text-white mb-2">
              Vehicle Mileage/ Fuel Efficiency
            </label>
            <input
              type="text"
              placeholder="mileage in km/l"
              value={newVehicle.veh_mileage}
              onChange={(e) => setNewVehicle({ ...newVehicle, veh_mileage: e.target.value })}
              className="block w-full p-2 mb-3 bg-gray-700 text-white rounded-lg"
            />

            <label className="block text-sm font-medium text-white mb-2">
              Fuel Type
            </label>
            <input
              type="text"
              placeholder="Petrol, Diesel...."
              value={newVehicle.fuel_type}
              onChange={(e) => setNewVehicle({ ...newVehicle, fuel_type: e.target.value })}
              className="block w-full p-2 mb-3 bg-gray-700 text-white rounded-lg"
            />

            <button 
              onClick={handleAddVehicle}
              disabled={!isFormValid()}
              className={`bg-blue-600 text-white px-4 py-2 rounded-lg ${
                isFormValid() ? 'hover:bg-blue-700' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="ml-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
