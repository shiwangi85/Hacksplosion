// import React, { useEffect, useState } from 'react';
// import { Leaf, Droplet, Wind } from 'lucide-react';
// import { SustainabilityMetric } from '../types';

// const Sustainability = () => {
//   const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);

//   useEffect(() => {
//     const storedMetrics = JSON.parse(localStorage.getItem('sustainabilityMetrics') || '[]');
//     setMetrics(storedMetrics);
//   }, []);

//   return (
//     <div className="space-y-6">
//       <h1 className="text-3xl font-bold text-blue-400">Sustainability Impact</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//           <Leaf className="w-8 h-8 text-green-400 mb-2" />
//           <h3 className="font-semibold text-white">CO₂ Saved</h3>
//           <p className="text-2xl font-bold text-green-400">
//             {metrics.reduce((total, metric) => total + metric.co2Saved, 0).toFixed(2)} kg
//           </p>
//         </div>
//         <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//           <Droplet className="w-8 h-8 text-blue-400 mb-2" />
//           <h3 className="font-semibold text-white">Energy Efficiency</h3>
//           <p className="text-2xl font-bold text-blue-400">
//             {metrics.length > 0 ? (metrics.reduce((total, metric) => total + metric.energyEfficiency, 0) / metrics.length).toFixed(2) : 0}%
//           </p>
//         </div>
//         <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//           <Wind className="w-8 h-8 text-purple-400 mb-2" />
//           <h3 className="font-semibold text-white">Green Score</h3>
//           <p className="text-2xl font-bold text-purple-400">
//             {metrics.length > 0 ? (metrics.reduce((total, metric) => total + metric.greenScore, 0) / metrics.length).toFixed(2) : 0}
//           </p>
//         </div>
//       </div>

//       <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
//         <h2 className="text-xl font-semibold mb-4 text-blue-400">Daily Metrics</h2>
//         <div className="space-y-4">
//           {metrics.map((metric) => (
//             <div key={metric.id} className="p-4 bg-gray-700 rounded-lg">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-white font-semibold">{new Date(metric.date).toLocaleDateString()}</span>
//                 <span className="text-green-400 font-bold">{metric.greenScore} points</span>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-gray-300">
//                   <span className="text-sm">CO₂ Saved:</span>
//                   <span className="ml-2 text-green-400">{metric.co2Saved} kg</span>
//                 </div>
//                 <div className="text-gray-300">
//                   <span className="text-sm">Efficiency:</span>
//                   <span className="ml-2 text-blue-400">{metric.energyEfficiency}%</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sustainability;






import React, { useEffect, useState } from 'react';
import { Leaf, Droplet, Wind, TreeDeciduous, Truck } from 'lucide-react';
import { SustainabilityMetric } from '../types';

const Sustainability = () => {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([]);

  useEffect(() => {
    const storedMetrics = JSON.parse(localStorage.getItem('sustainabilityMetrics') || '[]');
    setMetrics(storedMetrics);
  }, []);

  const totalCO2Saved = metrics.reduce((total, metric) => total + metric.co2Saved, 0).toFixed(2);
  const { treesEquivalent, ecoDeliveries, ecoDeliveryRate } = calculateEcoMetrics(totalCO2Saved);

  return (
    <div className="space-y-6">
      <h1 className="text-5xl  font-extrabold bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-500 text-transparent bg-clip-text  font-serif ">Sustainability Impact</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    
  
{/* CO₂ Saved & Trees Equivalent */}
<div className="relative group bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
  <Leaf className="w-10 h-10 text-green-400 mb-2 mx-auto" />
  <h3 className="font-semibold text-white">CO₂ Saved ≈ Trees Equivalent</h3>
  <p className="text-2xl font-bold text-green-400">{totalCO2Saved} kg ≈ {treesEquivalent} 🌳</p>

  {/* Tooltip on Hover */}
  <div className="absolute  top-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
    <p><span className="font-semibold text-green-400">CO₂ Saved:</span> Reduction in carbon emissions from eco-friendly transport.</p>
    <p><span className="font-semibold text-green-400">Trees Equivalent:</span> The number of trees required to absorb the same amount of CO₂.</p>
  </div>
</div>

{/* Eco Deliveries & Eco Delivery Rate */}
<div className="relative group bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
  <Truck className="w-10 h-10 text-green-400 mb-2 mx-auto" />
  <h3 className="font-semibold text-white">Eco Deliveries ≈ Delivery Rate</h3>
  <p className="text-2xl font-bold text-green-400">{ecoDeliveries} 🚚 ≈ {ecoDeliveryRate}%</p>

  {/* Tooltip on Hover */}
  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
    <p><span className="font-semibold text-green-400">Eco Deliveries:</span> The number of deliveries made using sustainable methods.</p>
    <p><span className="font-semibold text-green-400">Eco Delivery Rate:</span> Percentage of total deliveries that were eco-friendly.</p>
  </div>
</div>


      {/* Energy Efficiency & Green Score with Tooltip */}
<div className="relative group bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
  <Droplet className="w-8 h-8 text-blue-400 mb-2 mx-auto" />
  <h3 className="font-semibold text-white">Energy Efficiency ≈ Green Score</h3>
  <p className="text-2xl font-bold text-blue-400">
    {metrics.length > 0 
      ? (metrics.reduce((total, metric) => total + metric.energyEfficiency, 0) / metrics.length).toFixed(2) 
      : 0}% 
    ≈  
    <span className="text-purple-400">
      {metrics.length > 0 
        ? (metrics.reduce((total, metric) => total + metric.greenScore, 0) / metrics.length).toFixed(2) 
        : 0}
    </span>
  </p>

  {/* Tooltip on Hover */}
  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">
    <p><span className="font-semibold text-blue-400">Energy Efficiency:</span> Represents how well energy is utilized without waste.</p>
    <p><span className="font-semibold text-purple-400">Green Score:</span> A broader measure of sustainability, often influenced by energy efficiency.</p>
  </div>
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

// Function to calculate eco metrics
function calculateEcoMetrics(co2Saved) {
  const treeAbsorptionPerYear = 21.77; // Average CO2 absorption per tree per year
  const co2PerDelivery = 0.3; // Average CO2 saved per eco delivery
  const totalDeliveries = 1600; // Example total deliveries

  return {
    treesEquivalent: Math.round(co2Saved / treeAbsorptionPerYear),
    ecoDeliveries: Math.round(co2Saved / co2PerDelivery),
    ecoDeliveryRate: Math.round((co2Saved / co2PerDelivery / totalDeliveries) * 100),
  };
}

export default Sustainability;
