import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import axios from "axios";
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// Function to create a custom marker icon
const createMarkerIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
};

// Custom marker icons
const warehouseMarkerIcon = createMarkerIcon('red');
const deliveryMarkerIcon = createMarkerIcon('blue');
const numberMarkerIcon = (number) => {
  return L.divIcon({
    className: 'custom-number-icon',
    html: `<div style="background-color:#4169E1; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; border:2px solid white;">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Fix for Leaflet default icon path issues
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Component to fit bounds to all markers
const FitBoundsToMarkers = ({ points }) => {
  const map = useMap();
  
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(point => point.coordinates));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);
  
  return null;
};

// Component to add road routing between points
const RoadRouting = ({ waypoints, color = '#4169E1' }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!map || waypoints.length < 2) return;
    
    // Clear previous routing instances
    map.eachLayer((layer) => {
      if (layer._routing) {
        map.removeLayer(layer);
      }
    });
    
    // Convert waypoints to Leaflet waypoints format
    const routingWaypoints = waypoints.map(coords => L.latLng(coords[0], coords[1]));
    
    // Create routing control with road-based directions
    const routingControl = L.Routing.control({
      waypoints: routingWaypoints,
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: false,
      show: false, // Don't show the routing panel
      lineOptions: {
        styles: [
          { color, opacity: 0.8, weight: 5 },
          { color: 'white', opacity: 0.3, weight: 8 }
        ]
      },
      createMarker: function() {
        return null; // Don't create markers by the routing machine
      }
    }).addTo(map);
    
    // Attach a property to identify this layer for cleanup later
    routingControl._container._routing = true;
    
    // Clean up on component unmount
    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [map, waypoints, color]);
  
  return null;
};

const DeliveryRouteMap = () => {
  // Fix Leaflet icon issues
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Example warehouse coordinates (Chandni Chowk, Delhi)
  const warehouseCoords = [28.6506, 77.2310];
  
  const [deliveries, setDeliveries] = useState([]);
  const [optimizedOrder, setOptimizedOrder] = useState([]);
  const [optimizedWaypoints, setOptimizedWaypoints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completedDeliveries, setCompletedDeliveries] = useState(new Set());
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
 
 
  // Fetch deliveries data from the provided URL
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('http://localhost:5002/deliveries');
        const data = await response.json();
        setDeliveries(data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);



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




  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1, point2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in kilometers
    
    const dLat = toRad(point2[0] - point1[0]);
    const dLon = toRad(point2[1] - point1[1]);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(point1[0])) * Math.cos(toRad(point2[0])) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Implementation of nearest neighbor algorithm for the Traveling Salesman Problem
  const calculateOptimizedRoute = () => {
    setIsLoading(true);
    
    // Add warehouse to the points list
    const allPoints = [{ id: 0, coordinates: warehouseCoords }, ...deliveries];
    
    // Create a distance matrix
    const distanceMatrix = [];
    for (let i = 0; i < allPoints.length; i++) {
      distanceMatrix[i] = [];
      for (let j = 0; j < allPoints.length; j++) {
        if (i === j) {
          distanceMatrix[i][j] = 0;
        } else {
          distanceMatrix[i][j] = calculateDistance(
            allPoints[i].coordinates, 
            allPoints[j].coordinates
          );
        }
      }
    }

    // Start with the warehouse (index 0)
    const visited = new Set([0]);
    const path = [0];
    let current = 0;

    // Nearest neighbor algorithm
    while (visited.size < allPoints.length) {
      let minDistance = Infinity;
      let nextPoint = -1;
      
      for (let i = 0; i < allPoints.length; i++) {
        if (!visited.has(i) && distanceMatrix[current][i] < minDistance) {
          minDistance = distanceMatrix[current][i];
          nextPoint = i;
        }
      }
      
      if (nextPoint !== -1) {
        visited.add(nextPoint);
        path.push(nextPoint);
        current = nextPoint;
      }
    }
    
    // Return to warehouse to complete the route
    path.push(0);
    
    // Create the ordered waypoints for routing
    const waypoints = path.map(index => allPoints[index].coordinates);
    
    // Create the optimized delivery order
    const order = path.slice(1, -1).map(index => {
      return {
        ...allPoints[index],
        order: path.indexOf(index)
      };
    });
    
    setOptimizedWaypoints(waypoints);
    setOptimizedOrder(order);
    setIsLoading(false);
  };

  // Calculate the route when deliveries data is fetched
  useEffect(() => {
    if (deliveries.length > 0) {
      calculateOptimizedRoute();
    }
  }, [deliveries]);

  // Get all points for bounds calculation
  const allPoints = [
    { coordinates: warehouseCoords },
    ...deliveries
  ];

  const toggleDeliveryStatus = (id) => {
    setCompletedDeliveries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Sort optimizedOrder based on completion status
  const sortedOptimizedOrder = [...optimizedOrder].sort((a, b) => {
    const deliveryA = deliveries.find(d => d.id === a.id);
    const deliveryB = deliveries.find(d => d.id === b.id);
    const isCompletedA = completedDeliveries.has(deliveryA.id);
    const isCompletedB = completedDeliveries.has(deliveryB.id);
    return isCompletedA - isCompletedB;
  });

  return (
    <div className="grid grid-rows-2 h-screen gap-4 p-4 bg-gray-200">
      
      {/* First Half: Map & Delivery Data */}
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* Map Container */}
        <div className="col-span-2 bg-gray-100 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <div className="text-lg font-semibold">Calculating optimal route...</div>
          </div>
        )}
        <MapContainer 
          center={warehouseCoords} 
          zoom={11} 
          className="h-full w-full" 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <FitBoundsToMarkers points={allPoints} />
          
          {/* Road-based routing displayed on the map */}
          {optimizedWaypoints.length > 1 && (
            <RoadRouting waypoints={optimizedWaypoints} />
          )}
          
          {/* Warehouse Marker */}
          <Marker position={warehouseCoords} icon={warehouseMarkerIcon}>
            <Popup>
              <strong>Warehouse (Chandni Chowk)</strong>
              <br />
              Starting point
            </Popup>
          </Marker>
          
          {/* Delivery Markers */}
          {deliveries.map((delivery) => {
            if (completedDeliveries.has(delivery.id)) return null;
            const orderInfo = optimizedOrder.find(item => item.id === delivery.id);
            const visitOrder = orderInfo ? orderInfo.order : null;
            
            return delivery.coordinates && delivery.coordinates.length === 2 ? (
              <Marker 
                key={delivery.id} 
                position={delivery.coordinates} 
                icon={deliveryMarkerIcon}
              >
                <Popup>
                  <strong>{delivery.customer}</strong>
                  <br />
                  {delivery.deliveryPoint}
                  {visitOrder !== null && (
                    <div><strong>Visit Order: {visitOrder}</strong></div>
                  )}
                </Popup>
              </Marker>
            ) : null;
          })}
          
          {/* Order Number Markers */}
          {sortedOptimizedOrder.map((point, index) => {
            const delivery = deliveries.find(d => d.id === point.id);
            if (!delivery || completedDeliveries.has(delivery.id)) return null;
            return (
              <Marker 
                key={`order-${index}`} 
                position={delivery.coordinates} 
                icon={numberMarkerIcon(index + 1)}
                zIndexOffset={1000} // Make sure numbers appear on top
              />
            );
          })}
        </MapContainer>
      </div>

     {/* Delivery Data */}
      <div className="bg-white p-4 overflow-y-auto rounded-lg shadow">
      <h2 className="text-xl font-bold text-blue-800 mb-4">Optimized Delivery Route</h2>
          <div className="bg-blue-200 p-3 rounded mb-4">
            <strong>Starting point:</strong> Warehouse (Chandni Chowk)
          </div>
          
          <div className="space-y-4">
            {sortedOptimizedOrder.map((point, index) => {
              const delivery = deliveries.find(d => d.id === point.id);
              if (!delivery) return null;
              const isCompleted = completedDeliveries.has(delivery.id);
              return (
                <div key={point.id} className={`bg-white p-4 rounded-lg shadow ${isCompleted ? 'opacity-50' : ''}`}>
                  <div className="flex items-center mb-2">
                    <div className="inline-block bg-blue-500 text-white rounded-full w-8 h-8 text-center mr-3">
                      {index + 1}
                    </div>
                    <strong className="text-lg text-black">{delivery.customer}</strong>
                  </div>
                  <div className="ml-11 text-gray-600">
                    <p className="mb-1"><strong>Address:</strong> {delivery.deliveryPoint}</p>
                    <p className="text-sm text-gray-700">📦 Items: {delivery.items?.join(", ") || "N/A"}</p>
                    <p className="text-sm text-gray-600">⚖️ Weight: {delivery.packageWeight} kg</p>
                    <p className="text-xs text-gray-500">⏰ Time: {new Date(delivery.time).toLocaleString()}</p>
                    <p className={`mb-1 ${delivery.urgentDelivery === 'Yes' ? 'text-red-600' : 'text-gray-600'}`}>
                      <strong>Urgent Delivery:</strong> {delivery.urgentDelivery}
                    </p>
                    <button 
                      className={`mt-2 px-4 py-2 rounded ${isCompleted ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                      onClick={() => toggleDeliveryStatus(delivery.id)}
                    >
                      {isCompleted ? 'Undo' : 'Done'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-blue-200 p-3 rounded mt-4">
            <strong>Return to:</strong> Warehouse (Chandni Chowk)
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-2">Route Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Stops:</span>
              <span className="font-bold">{deliveries.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Routing:</span>
              <span className="font-bold">Road-based navigation</span>
            </div>
            <div className="p-3 bg-yellow-100 rounded text-sm mt-2">
              <p>⚠️ Travel times and distances will vary based on traffic conditions. Plan accordingly.</p>
            </div>
          </div>
        </div>
      </div>






           {/* Form for additional route optimization */}
      {/* <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8"> */}
      <div className="bg-gray-100 p-8 rounded-lg shadow flex flex-col items-center">
        <header className="bg-blue-900 w-full py-4 text-center text-white font-bold text-3xl rounded">Shipment Route Optimization
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

export default DeliveryRouteMap;
