// import React, { useState } from "react";
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
// import axios from "axios";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// // Function to create numbered markers
// const createNumberedIcon = (number) => {
//   return L.divIcon({
//     className: "custom-div-icon",
//     html: `<div style="background-color:blue;color:white;width:25px;height:25px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;">${number}</div>`,
//     iconSize: [25, 25],
//   });
// };

// const Shipment = () => {
//   const [warehouse, setWarehouse] = useState("");
//   const [deliveryPoint, setDeliveryPoint] = useState("");
//   const [locations, setLocations] = useState([]);
//   const [optimizedRoute, setOptimizedRoute] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   // Function to get lat/lon from an address
//   const geocodeLocation = async (location) => {
//     try {
//       const response = await axios.get(
//         `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
//       );
//       if (response.data.length > 0) {
//         const { lat, lon } = response.data[0];
//         return { lat: parseFloat(lat), lon: parseFloat(lon) };
//       } else {
//         alert(`Could not find coordinates for ${location}`);
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//       return null;
//     }
//   };

//   // Set the warehouse position
//   const setStartingPoint = async () => {
//     if (!warehouse) {
//       alert("Please enter a warehouse location!");
//       return;
//     }
//     const coords = await geocodeLocation(warehouse);
//     if (coords) {
//       setLocations([{ name: warehouse, ...coords }]);
//     }
//   };

//   // Add delivery points
//   const addDeliveryPoint = async () => {
//     if (!deliveryPoint) {
//       alert("Please enter a delivery point!");
//       return;
//     }
//     const coords = await geocodeLocation(deliveryPoint);
//     if (coords) {
//       setLocations([...locations, { name: deliveryPoint, ...coords }]);
//       setDeliveryPoint("");
//     }
//   };

//   // Remove a location
//   const removeLocation = (index) => {
//     setLocations(locations.filter((_, i) => i !== index));
//     // Clear optimized route when locations change
//     setOptimizedRoute(null);
//   };

//   // Fetch the optimized route
//   const fetchOptimizedRoute = async () => {
//     if (locations.length < 2) {
//       alert("Please add at least one delivery point!");
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       // Convert location objects to [lon, lat] format for the optimizer
//       // Using lon first as x-coordinate and lat as y-coordinate
//       const coordinatesArray = locations.map(loc => [loc.lon, loc.lat]);
      
//       console.log("Sending coordinates:", coordinatesArray);
      
//       const response = await axios.post(
//         "http://localhost:5001/optimize-route", 
//         { locations: coordinatesArray }, 
//         { headers: { "Content-Type": "application/json" } }
//       );

//       console.log("API Response:", response.data);

//       if (response.data && response.data.optimized_route) {
//         // Convert indices back to actual coordinates
//         const routeIndices = response.data.optimized_route;
//         const routeCoordinates = routeIndices.map(index => [
//           locations[index].lat,
//           locations[index].lon
//         ]);
        
//         setOptimizedRoute(routeCoordinates);
//       } else {
//         console.error("Optimized route data not found in response:", response.data);
//         alert("Failed to get optimized route. Check console for details.");
//         setOptimizedRoute(null);
//       }
//     } catch (error) {
//       console.error("Error fetching optimized route:", error);
//       alert(`Error: ${error.response?.data?.error || error.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", color: "black", paddingBlock: "20px" }}>
// <h2 class="text-3xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-500 text-transparent bg-clip-text font-serif paddingblock-20px">
//   Delivery Route Optimization
// </h2>

//       {/* Warehouse Input */}
//       <div style={{ marginBottom: "10px" }}>
//         <input
//           type="text"
//           placeholder="Enter warehouse location"
//           value={warehouse}
//           onChange={(e) => setWarehouse(e.target.value)}
//           style={{ marginRight: "10px", padding: "5px", margin : "10px" }}

//         />
//         <button onClick={setStartingPoint} class="text-black-500 font-bold text-xl" >Set Warehouse</button>
//       </div>

//       {/* Delivery Points Input */}
//       <div style={{ marginBottom: "10px",padding: "5px", margin : "10px"  }}>
//         <input
//           type="text"
//           placeholder="Enter delivery point"
//           value={deliveryPoint}
//           onChange={(e) => setDeliveryPoint(e.target.value)}
//           style={{ marginRight: "10px" }}
//         />
//         <button onClick={addDeliveryPoint}  class="text-black-500 font-bold text-xl" >Add Delivery Point</button>
//       </div>

//       {/* Show Locations */}
//       <h3>Locations:</h3>
//       <ul style={{ marginBottom: "15px" }}>
//         {locations.map((loc, index) => (
//           <li key={index} style={{ marginBottom: "5px" }}>
//             {index === 0 ? "🏭 " : "📦 "}
//             {loc.name} (Lat: {loc.lat.toFixed(4)}, Lon: {loc.lon.toFixed(4)})
//             <button 
//               onClick={() => removeLocation(index)}
//               style={{ marginLeft: "10px" }}
//             >
//               Remove
//             </button>
//           </li>
//         ))}
//       </ul>

//       {/* Fetch Optimized Route */}
//       <button 
//         onClick={fetchOptimizedRoute} 
//         disabled={isLoading || locations.length < 2}
//         style={{ marginBottom: "15px" }}
//       >
//         {isLoading ? "Calculating..." : "Get Optimized Route"}
//       </button>

//       {/* Map Display */}
//       <MapContainer 
//         center={locations.length > 0 ? [locations[0].lat, locations[0].lon] : [28.6139, 77.209]} 
//         zoom={12} 
//         style={{ height: "500px", width: "100%" }}
//       >
//         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//         {/* Display Markers at Correct Locations */}
//         {locations.map((loc, index) => (
//           <Marker 
//             key={index} 
//             position={[loc.lat, loc.lon]} 
//             icon={createNumberedIcon(index + 1)}
//           >
//             <Popup>{index === 0 ? "Warehouse: " : "Delivery: "}{loc.name}</Popup>
//           </Marker>
//         ))}

//         {/* Display Route */}
//         {optimizedRoute && (
//           <Polyline positions={optimizedRoute} color="red" weight={4} />
//         )}
//       </MapContainer>
//     </div>
//   );
// };

// export default Shipment;

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Function to create numbered markers
const createNumberedIcon = (number) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color:blue;color:white;width:25px;height:25px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;">${number}</div>`,
    iconSize: [25, 25],
  });
};

const Shipment = () => {
  const [warehouse, setWarehouse] = useState("");
  const [deliveryPoint, setDeliveryPoint] = useState("");
  const [locations, setLocations] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to get lat/lon from an address
  const geocodeLocation = async (location) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lon: parseFloat(lon) };
      } else {
        alert(`Could not find coordinates for ${location}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Set the warehouse position
  const setStartingPoint = async () => {
    if (!warehouse) {
      alert("Please enter a warehouse location!");
      return;
    }
    const coords = await geocodeLocation(warehouse);
    if (coords) {
      setLocations([{ name: warehouse, ...coords }]);
    }
  };

  // Add delivery points
  const addDeliveryPoint = async () => {
    if (!deliveryPoint) {
      alert("Please enter a delivery point!");
      return;
    }
    const coords = await geocodeLocation(deliveryPoint);
    if (coords) {
      setLocations([...locations, { name: deliveryPoint, ...coords }]);
      setDeliveryPoint("");
    }
  };

  // Remove a location
  const removeLocation = (index) => {
    setLocations(locations.filter((_, i) => i !== index));
    // Clear optimized route when locations change
    setOptimizedRoute(null);
  };

  // Fetch the optimized route
  const fetchOptimizedRoute = async () => {
    if (locations.length < 2) {
      alert("Please add at least one delivery point!");
      return;
    }

    setIsLoading(true);

    try {
      // Convert location objects to [lon, lat] format for the optimizer
      // Using lon first as x-coordinate and lat as y-coordinate
      const coordinatesArray = locations.map(loc => [loc.lon, loc.lat]);

      console.log("Sending coordinates:", coordinatesArray);

      const response = await axios.post(
        "http://localhost:5001/optimize-route",
        { locations: coordinatesArray },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.optimized_route) {
        // Convert indices back to actual coordinates
        const routeIndices = response.data.optimized_route;
        const routeCoordinates = routeIndices.map(index => [
          locations[index].lat,
          locations[index].lon
        ]);

        setOptimizedRoute(routeCoordinates);
      } else {
        console.error("Optimized route data not found in response:", response.data);
        alert("Failed to get optimized route. Check console for details.");
        setOptimizedRoute(null);
      }
    } catch (error) {
      console.error("Error fetching optimized route:", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Additional state and functions for the form
  const [data, setData] = useState([]);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [formOptimizedRoute, setFormOptimizedRoute] = useState<string[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [timeSaved, setTimeSaved] = useState(0);
  const [numLocations, setNumLocations] = useState(3);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [worstRoute, setWorstRoute] = useState<string[]>([]);
  const [worstTravelTime, setWorstTravelTime] = useState<number | null>(null);

  useEffect(() => {
    fetch('/delhi_traffic_data.csv')
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          complete: (result) => {
            setData(result.data);
            const uniqueLocations = Array.from(new Set(result.data.map((entry: any) => entry.location_start)));
            setAvailableLocations(uniqueLocations);
          },
          header: true,
        });
      })
      .catch(error => {
        console.error('Error loading CSV:', error);
      });
  }, []);

  const getTravelTime = (start: string, end: string, timeOfDay: string) => {
    const row = data.find(
      (entry: any) =>
        entry.location_start === start &&
        entry.location_end === end &&
        entry.time_of_day === timeOfDay
    );
    return row ? parseFloat(row.average_travel_time) : Infinity;
  };

  const permute = (arr: string[]) => {
    if (arr.length === 0) return [[]];
    const first = arr[0];
    const rest = arr.slice(1);
    const permutations = permute(rest);
    const result: string[][] = [];
    permutations.forEach((perm) => {
      for (let i = 0; i <= perm.length; i++) {
        result.push([...perm.slice(0, i), first, ...perm.slice(i)]);
      }
    });
    return result;
  };

  const optimizeRoute = () => {
    if (selectedLocations.length < 2) {
      alert('At least 2 locations are required.');
      return;
    }

    let bestOrder = null;
    let minTravelTime = Infinity;
    let worstOrder = null;
    let maxTravelTime = -Infinity;

    // Get the fixed start point and permute the remaining locations
    const startLocation = selectedLocations[0];
    const locationsToPermute = selectedLocations.slice(1);

    const permutations = permute(locationsToPermute);
    permutations.forEach((perm) => {
      // Prepend the start location to each permutation
      const route = [startLocation, ...perm];
      let totalTime = 0;
      for (let i = 0; i < route.length - 1; i++) {
        totalTime += getTravelTime(route[i], route[i + 1], timeOfDay);
      }
      if (totalTime < minTravelTime) {
        minTravelTime = totalTime;
        bestOrder = route;
      }
      if (totalTime > maxTravelTime) {
        maxTravelTime = totalTime;
        worstOrder = route;
      }
    });

    let calculatedTimeSaved = Math.max(0, maxTravelTime - minTravelTime);

    setFormOptimizedRoute(bestOrder || []);
    setTotalTime(minTravelTime);
    setWorstRoute(worstOrder || []);
    setWorstTravelTime(maxTravelTime);
    setTimeSaved(calculatedTimeSaved);
  };

  const chartData = [
    { name: 'Optimized Route', time: totalTime },
    { name: 'Worst Route', time: worstTravelTime },
  ];

  return (
    <div style={{ padding: "20px", color: "black", paddingBlock: "20px" }}>
      <h2 class="text-3xl font-extrabold bg-gradient-to-r from-indigo-800 via-purple-700 to-purple-500 text-transparent bg-clip-text font-serif paddingblock-20px">
        Delivery Route Optimization
      </h2>

      {/* Warehouse Input */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter warehouse location"
          value={warehouse}
          onChange={(e) => setWarehouse(e.target.value)}
          style={{ marginRight: "10px", padding: "5px", margin: "10px" }}

        />
        <button onClick={setStartingPoint} class="text-black-500 font-bold text-xl" >Set Warehouse</button>
      </div>

      {/* Delivery Points Input */}
      <div style={{ marginBottom: "10px", padding: "5px", margin: "10px" }}>
        <input
          type="text"
          placeholder="Enter delivery point"
          value={deliveryPoint}
          onChange={(e) => setDeliveryPoint(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addDeliveryPoint} class="text-black-500 font-bold text-xl" >Add Delivery Point</button>
      </div>

      {/* Show Locations */}
      <h3>Locations:</h3>
      <ul style={{ marginBottom: "15px" }}>
        {locations.map((loc, index) => (
          <li key={index} style={{ marginBottom: "5px" }}>
            {index === 0 ? "🏭 " : "📦 "}
            {loc.name} (Lat: {loc.lat.toFixed(4)}, Lon: {loc.lon.toFixed(4)})
            <button
              onClick={() => removeLocation(index)}
              style={{ marginLeft: "10px" }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Fetch Optimized Route */}
      <button
        onClick={fetchOptimizedRoute}
        disabled={isLoading || locations.length < 2}
        style={{ marginBottom: "15px" }}
      >
        {isLoading ? "Calculating..." : "Get Optimized Route"}
      </button>

      {/* Map Display */}
      <MapContainer
        center={locations.length > 0 ? [locations[0].lat, locations[0].lon] : [28.6139, 77.209]}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Display Markers at Correct Locations */}
        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={[loc.lat, loc.lon]}
            icon={createNumberedIcon(index + 1)}
          >
            <Popup>{index === 0 ? "Warehouse: " : "Delivery: "}{loc.name}</Popup>
          </Marker>
        ))}

        {/* Display Route */}
        {optimizedRoute && (
          <Polyline positions={optimizedRoute} color="red" weight={4} />
        )}
      </MapContainer>

      {/* Form for additional route optimization */}
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8">
        <header className="bg-blue-900 w-full py-4">
          <h1 className="text-3xl font-bold text-center text-white">Shipment Route Optimization</h1>
        </header>
        <main className="bg-blue-800 p-6 rounded-lg shadow-lg w-full max-w-4xl mt-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">Optimize Your Route</h2>

          {/* Select Number of Locations */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Select Number of Locations:</label>
            <input
              type="number"
              value={numLocations}
              onChange={(e) => setNumLocations(parseInt(e.target.value))}
              min={2}
              max={availableLocations.length}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 font-semibold"
            />
          </div>

          {/* Location Selection Dropdowns */}
          {Array.from({ length: numLocations }).map((_, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-white">
                {index === 0 ? "Select Source:" : `Select Destination ${index}:`}
              </label>
              <select
                value={selectedLocations[index] || ''}
                onChange={(e) => {
                  const updatedLocations = [...selectedLocations];
                  updatedLocations[index] = e.target.value;
                  setSelectedLocations(updatedLocations);
                }}
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
              >
                <option value="">Select a location</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Time of Day Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white">Select Time of Day:</label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-medium"
            >
              <option value="">Select Time</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>

          {/* Optimize Button */}
          <button
            onClick={optimizeRoute}
            className="w-full bg-white text-blue-500 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
          >
            Optimize Route
          </button>

          {/* Display Optimized Route */}
          {formOptimizedRoute.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white">Optimized Route:</h3>
              <p className="mt-2 text-lg text-white">{formOptimizedRoute.join(' → ')}</p>
            </div>
          )}

          {/* Display Worst Route */}
          {worstRoute.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white">Worst Route:</h3>
              <p className="mt-2 text-lg text-white">{worstRoute.join(' → ')}</p>
            </div>
          )}

          {/* Display Total Travel Time */}
          {totalTime > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white">Total Travel Time:</h3>
              <p className="mt-2 text-lg text-white">{totalTime.toFixed(2)} minutes</p>
            </div>
          )}

          {/* Display Time Saved */}
          {timeSaved > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white">Time Saved:</h3>
              <p className="mt-2 text-lg text-green-300">{timeSaved.toFixed(2)} minutes</p>
            </div>
          )}

          {/* Display Bar Chart */}
          <div className="mt-6 w-full h-64 bg-white p-4 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="time" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shipment;