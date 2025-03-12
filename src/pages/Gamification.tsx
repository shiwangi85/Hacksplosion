import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, TrendingUp, User, Car, Gauge, Fuel, Cloudy, Trash2 } from 'lucide-react';

const leaderboard = [
  { id: 1, name: 'John Doe', points: 2500, badge: 'Eco Warrior' },
  { id: 2, name: 'Jane Smith', points: 2100, badge: 'Route Master' },
  { id: 3, name: 'Mike Johnson', points: 1800, badge: 'Early Adopter' }
];

export default function Gamification() {
  const [distance, setDistance] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel' | 'electric'>('petrol');
  const [result, setResult] = useState<{ fuelUsed: string; co2Emission: string } | null>(null);
  // const [history, setHistory] = useState<{ distance: string; mileage: string; fuelUsed: string; co2Emission: string }[]>([]);
  const [history, setHistory] = useState<{ distance: string; mileage: string; fuelUsed: string; co2Emission: string }[]>(
    () => JSON.parse(localStorage.getItem('travelHistory') || '[]')
  );   // extra

  useEffect(() => {
    localStorage.setItem('travelHistory', JSON.stringify(history));
  }, [history]);  // extra


  const emissionFactors = {
    petrol: 2.3,
    diesel: 2.7,
    electric: 0,
  };

  const calculate = () => {
    const distanceNum = parseFloat(distance);
    const mileageNum = parseFloat(mileage);
    if (isNaN(distanceNum) || isNaN(mileageNum) || mileageNum <= 0) {
      alert('Please enter valid distance and mileage.');
      return;
    }

    const fuelUsed = (distanceNum / mileageNum).toFixed(2);
    const co2Emission = (fuelUsed * emissionFactors[fuelType]).toFixed(2);
    const newResult = { fuelUsed, co2Emission };
    setResult(newResult);
    setHistory([...history, { distance, mileage, fuelUsed, co2Emission }]);
  };

  const deleteEntry = (index: number) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
  }; // extra

  return (
    <div className="space-y-6">
 

      <h1 className="text-4xl font-bold text-blue-400 font-serif">Rewards & Achievements</h1>

      <div className="grid grid-cols-1 md-grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-blue-400">
          <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
          <h3 className="font-semibold text-white">Your Points</h3>
          <p className="text-2xl font-bold text-yellow-400">1,250</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-blue-400">
          <Star className="w-8 h-8 text-blue-400 mb-2" />
          <h3 className="font-semibold text-white">Current Level</h3>
          <p className="text-2xl font-bold text-blue-400">15</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-blue-400">
          <Award className="w-8 h-8 text-purple-400 mb-2" />
          <h3 className="font-semibold text-white">Badges Earned</h3>
          <p className="text-2xl font-bold text-purple-400">8</p>
        </div>
      </div>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-4xl font-semibold mb-4 text-blue-400 font-serif">Leaderboard</h2>
        <div className="space-y-4">
          {leaderboard.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-400">#{user.id}</span>
                <div>
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  <span className="text-sm text-gray-400">{user.badge}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="font-bold text-green-400">{user.points}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}











