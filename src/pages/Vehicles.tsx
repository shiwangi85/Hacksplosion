
import React, { useEffect, useState } from 'react';
import { Battery, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'vehicles';
const ACTIVE_VEHICLE_KEY = 'activeVehicle';

export function getActiveVehicle() {
  const activeVehicle = localStorage.getItem(ACTIVE_VEHICLE_KEY);
  return activeVehicle ? JSON.parse(activeVehicle) : null;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState(() => {
    try {
      const savedVehicles = localStorage.getItem(STORAGE_KEY);
      return savedVehicles ? JSON.parse(savedVehicles) : [];
    } catch (error) {
      console.error('Error loading vehicles from localStorage:', error);
      return [];
    }
  });

  const [activeVehicle, setActiveVehicle] = useState(getActiveVehicle());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    car_type: '',
    veh_name: '',
    veh_mileage: '',
    fuel_type: '',
    emissions: 0,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    if (activeVehicle) {
      localStorage.setItem(ACTIVE_VEHICLE_KEY, JSON.stringify(activeVehicle));
    }
  }, [activeVehicle]);

  const handleDeleteVehicle = (id) => {
    const updatedVehicles = vehicles.filter((vehicle) => vehicle.id !== id);
    setVehicles(updatedVehicles);
    if (activeVehicle && activeVehicle.id === id) {
      setActiveVehicle(null);
      localStorage.removeItem(ACTIVE_VEHICLE_KEY);
    }
  };

  const handleActivateVehicle = (vehicle) => {
    setActiveVehicle(vehicle);
    localStorage.setItem(ACTIVE_VEHICLE_KEY, JSON.stringify(vehicle));
  };

  const handleAddVehicle = () => {
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const updatedVehicles = [...vehicles, { id: newId, ...newVehicle }];
    setVehicles(updatedVehicles);
    setNewVehicle({
      car_type: '',
      veh_name: '',
      veh_mileage: '',
      fuel_type: '',
      emissions: 0,
    });
    setIsModalOpen(false);
  };

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
      <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-700 via-purple-500 to-purple-300 text-transparent bg-clip-text font-serif">Fleet Management</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
      >
        Add Vehicle
      </button>
      <div className="grid gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className=" bg-gray-800 p-6 rounded-xl border border-gray-700 transition-all duration-300 
    hover:shadow-2xl hover:shadow-purple-600 hover:border-2 hover:border-transparent 
    ">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">{vehicle.car_type}</h3>
                <p className="text-gray-300">Vehicle: {vehicle.veh_name}</p>
                <p className="text-gray-300">Mileage: {vehicle.veh_mileage} km/l</p>
                <p className="text-gray-300">Fuel Type: {vehicle.fuel_type}</p>
                <p className="text-gray-300">Emissions: {vehicle.emissions} kg CO₂</p>
              </div>
              <div className="text-right">
                <button
                  onClick={() => handleActivateVehicle(vehicle)}
                  className={`mt-2 px-4 py-2 rounded-lg ${
                    activeVehicle && activeVehicle.id === vehicle.id ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {activeVehicle && activeVehicle.id === vehicle.id ? 'Active' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="mt-2 text-red-500 hover:text-red-700 ml-4"
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