import React, { useState } from 'react';

const STORAGE_KEY = 'vehicles';

export default function VehicleManager({ onVehicleAdded }) {
  const [newVehicle, setNewVehicle] = useState({
    car_type: '',
    veh_name: '',
    veh_mileage: '',
    fuel_type: '',
    emissions: 0,
    battery: 100
  });

  const [isModalOpen, setIsModalOpen] = useState(false);


  
  const handleAddVehicle = () => {
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const savedVehicles = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const updatedVehicles = [...savedVehicles, { id: newId, ...newVehicle }];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedVehicles));
    onVehicleAdded(updatedVehicles);

    setNewVehicle({
      car_type: '',
      veh_name: '',
      veh_mileage: '',
      fuel_type: '',
      emissions: 0,
      battery: 100
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
    <div>
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Add Vehicle
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-96">
            <h2 className="text-xl font-bold text-white mb-4">Add New Vehicle</h2>

            <input
              type="text"
              placeholder="Car Type"
              value={newVehicle.car_type}
              onChange={(e) => setNewVehicle({ ...newVehicle, car_type: e.target.value })}
              className="block w-full p-2 mb-3 bg-gray-700 text-white rounded-lg"
            />

            <input
              type="text"
              placeholder="Vehicle Name"
              value={newVehicle.veh_name}
              onChange={(e) => setNewVehicle({ ...newVehicle, veh_name: e.target.value })}
              className="block w-full p-2 mb-3 bg-gray-700 text-white rounded-lg"
            />

            <input
              type="text"
              placeholder="Mileage (km/l)"
              value={newVehicle.veh_mileage}
              onChange={(e) => setNewVehicle({ ...newVehicle, veh_mileage: e.target.value })}
              className="block w-full p-2 mb-3 bg-gray-700 text-white rounded-lg"
            />

            <input
              type="text"
              placeholder="Fuel Type"
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
