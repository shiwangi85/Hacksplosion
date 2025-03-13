import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
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

// Define the custom pink marker icon
const pinkMarkerIcon = new L.Icon({
  iconUrl: "https://www.iconpacks.net/icons/4/free-fast-food-delivery-bike-icon-12992-thumb.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -40],
});

const DeliveryMap = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [loading, setLoading] = useState(true);
  const [warehouse, setWarehouse] = useState("");
  const [deliveryPoint, setDeliveryPoint] = useState("");
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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


  // Main warehouse location
  const warehouseCoords = [28.6558, 77.2219];

// this useeffect to call the csv file and parse it
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


  // thi is calculate chart code data  at bottom
  const optimizeRoutes = () => {
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


// this is fetch delivery cordinate and shown on map 
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true); // Ensure loading is set to true before fetching
  
        const response = await fetch("http://localhost:5002/deliveries");
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
  
        const data = await response.json();
        console.log("Fetched Deliveries:", data);
  
        // Ensure coordinates are correctly structured before updating state
        const validDeliveries = data
          .filter(delivery => delivery.coordinates && delivery.coordinates.length === 2)
          .map(delivery => ({
            ...delivery,
            coordinates: [parseFloat(delivery.coordinates[0]), parseFloat(delivery.coordinates[1])]
          }));
  
        setDeliveries(validDeliveries);
        setLoading(false); // Ensure loading is set to false after fetching
      } catch (error) {
        console.error("Error fetching deliveries:", error);
        setLoading(false); // Even on error, set loading to false to avoid infinite loading state
      }
    };
  
    fetchDeliveries();
  }, []);
  

  const optimizeRoute = async () => {
    const source = `${warehouseCoords[1]},${warehouseCoords[0]}`;
    const destination = `${warehouseCoords[1]},${warehouseCoords[0]}`;
    
    const waypoints = deliveries
      .map((delivery) => delivery.coordinates)
      .filter(Boolean)
      .map(([lat, lng]) => `${lng},${lat}`)
      .join(";");
  
    if (!waypoints) {
      console.error("No delivery locations available for optimization.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5002/optimize-route?source=${source}&destination=${destination}&waypoints=${waypoints}`
      );
  
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
  
      const data = await response.json();
  
      if (data.routes && data.routes.length > 0) {
        const optimizedCoords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setOptimizedRoute(optimizedCoords);
      } else {
        console.error("No optimized route found");
      }
    } catch (error) {
      console.error("Error fetching optimized route:", error);
    }
  };
  





  return (
    // <div className="flex h-screen">
    <div className="flex flex-col h-screen">
  {/* Top Section - Deliveries and Map */}
  <div className="flex flex-1">
      {/* Sidebar with delivery details */}
      <div className="w-1/3 h-screen overflow-y-auto p-4 bg-gray-100">
        <h2 className="text-lg font-bold mb-4 text-center text-black">🚚 Scheduled Deliveries (TODAY)</h2>
        <button className="w-full mb-4 bg-blue-500 text-white p-2 rounded" onClick={optimizeRoute}>
          Optimize Route
        </button>

        {loading ? (
          <p className="text-center text-gray-500">Loading deliveries...</p>
        ) : deliveries.length > 0 ? (
          [...deliveries]
            .sort((a, b) => (b.urgentDelivery === "Yes") - (a.urgentDelivery === "Yes"))
            .map((delivery) => (
              <div key={delivery.id} className="p-4 mb-4 bg-white shadow-md rounded-lg border border-gray-300">
                <h3 className="font-semibold text-blue-600">{delivery.customer}</h3>
                <p className="text-gray-800 font-medium">{delivery.deliveryPoint}</p>
                <p className="text-sm text-gray-700">📦 Items: {delivery.items?.join(", ") || "N/A"}</p>
                <p className="text-sm text-gray-600">⚖️ Weight: {delivery.packageWeight} kg</p>
                <p className="text-xs text-gray-500">⏰ Time: {new Date(delivery.time).toLocaleString()}</p>
                <p className={`text-sm font-bold ${delivery.urgentDelivery === "Yes" ? "text-red-700" : "text-gray-500"}`}>
                  🚨 Urgent Delivery: {delivery.urgentDelivery}
                </p>
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500">No deliveries available.</p>
        )}
      </div>

      {/* Map Section */}
      <div className="w-2/3 h-screen">
        <MapContainer center={warehouseCoords} zoom={12} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Warehouse Marker */}
          <Marker position={warehouseCoords}>
            <Popup>
              <strong>Warehouse (Chandni Chowk)</strong>
            </Popup>
          </Marker>

          {/* Delivery Markers */}
          {deliveries.map((delivery) =>
            delivery.coordinates && delivery.coordinates.length === 2 ? (
              <Marker key={delivery.id} position={delivery.coordinates} icon={pinkMarkerIcon}>
                <Popup>
                  <strong>{delivery.customer}</strong> <br />
                  {delivery.deliveryPoint}
                </Popup>
              </Marker>
            ) : null
          )}

          {/* Optimized Route Line */}
          {optimizedRoute.length > 0 && (
            <Polyline positions={optimizedRoute} color="blue" weight={4} opacity={0.8} />
          )}
        </MapContainer>
      </div>
      </div>


{/* this for  display static  fetch optmized route  */}
     
      {/* Form for additional route optimization */}
      {/* <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8"> */}
      <div className="w-full bg-gray-100 margin-top-8 flex flex-col items-center justify-center py-8 border-t">
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
            onClick={optimizeRoutes}
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

export default DeliveryMap;






