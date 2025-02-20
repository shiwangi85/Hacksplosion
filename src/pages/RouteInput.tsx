import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Bike, Truck, Clock, Leaf, Shield, Ship, Wallet, Trees, Footprints ,Route , Navigation} from "lucide-react";
import axios from "axios";

// Add type declaration for window.mappls
declare global {
  interface Window {
    mappls: any;
  }
}

const getActiveVehicle = () => {
  const activeVehicle = localStorage.getItem('activeVehicle');
  return activeVehicle ? JSON.parse(activeVehicle) : null;
};
// const MAPPLS_API_KEY = "f9103064-b408-4a94-942c-11fd3dcbe5a6";
const MAPPLS_API_KEY = "bd0be172-d751-4d73-a6ca-8790000798d5";

// Add these interfaces at the top of the file
interface Location {
  name: string;
  lat: string;
  lon: string;
}

interface LocationSuggestion {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

const VehicleOption = ({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-200
      ${selected 
        ? 'bg-gradient-to-br from-gray-100 to-white shadow-inner border-none'
        : 'bg-gradient-to-tl from-gray-100 to-white shadow-lg hover:shadow-xl'
      }
      ${selected
        ? 'shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff]'
        : 'shadow-[5px_5px_10px_#bebebe,-5px_-5px_10px_#ffffff]'
      }
    `}
  >
      <div className={`
      mb-2 transform transition-transform duration-200
      ${selected ? 'scale-90 text-purple-600' : 'scale-100 text-gray-600'}
    `}>
    {icon}
    </div>
    {/* <span className="mt-2 text-sm font-medium">{label}</span> */}
    <span className={`
      text-sm font-medium transition-colors duration-200
      ${selected ? 'text-purple-600' : 'text-gray-600'}
    `}>
      {label}
    </span>

  </button>
);
//  ----this is for location input css ---------
const LocationInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  onLocationClick, 
  showLocationButton,
  suggestions,
  onSuggestionSelect 
}) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative flex items-center">
      <div className="absolute left-3 text-gray-400">
        <MapPin size={18} />
      </div>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white/80 text-gray-900 placeholder-gray-500"
      />
      {showLocationButton && (
        <button
          onClick={onLocationClick}
          className="absolute right-3 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors duration-200"
        >
          <Navigation size={18} />
        </button>
      )}
    </div>
    
    {/* Suggestions Dropdown */}
    {suggestions && suggestions.length > 0 && (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.place_id}
            className="px-4 py-2 hover:bg-purple-50 cursor-pointer transition-colors duration-150"
            onClick={() => onSuggestionSelect(suggestion)}
          >
            <div className="text-sm text-gray-900">{suggestion.display_name}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);



// -------------- Main Component starts here --------------
const RouteInput = () => {
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState("car");
  // const [routeType, setRouteType] = useState("fastest");
  // const [routeData, setRouteData] = useState(null);
  const [routeRequested, setRouteRequested] = useState(false); // this is for request tot get route after i vclick to button

  // Add new state variables
  const [sourceQuery, setSourceQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);

  // Add new state for storing selected locations
  const [sourceLocation, setSourceLocation] = useState<Location | null>(null);
  const [destLocation, setDestLocation] = useState<Location | null>(null);

  const mapRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);

  // ----------------------- For Destination -------------------------
  //  fetchAddressSuggestions to return full location data
  // This is to fetch address with suggestion
  const fetchAddressSuggestions = async (query: string) => {
    if (!query) {
      return [];
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&countrycodes=IN&viewbox=74.0,31.5,84.5,26.0&bounded=1&q=${query}`
      );
      const data: LocationSuggestion[] = await response.json();
      return data.map((item) => ({
        place_id: item.place_id,
        display_name: item.display_name,
        lat: item.lat,
        lon: item.lon,
      }));
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      return [];
    }
  };

  // -------------------- Also for destination ----------------------
  // Add debounced search effect for source
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (sourceQuery) {
        const suggestions = await fetchAddressSuggestions(sourceQuery);
        setSourceSuggestions(suggestions);
      } else {
        setSourceSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [sourceQuery]);

  // Add debounced search effect for destination
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (destQuery) {
        const suggestions = await fetchAddressSuggestions(destQuery);
        setDestSuggestions(suggestions);
      } else {
        setDestSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [destQuery]);

  // --------------------- To submit destination input ---------------------
  // Modify handleSubmit to include location data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceLocation || !destLocation) {
      alert("Please select both source and destination locations");
      return;
    }
    navigate("/route-results", {
      state: {
        source: sourceLocation,
        destination: destLocation,
        vehicleType,
      },
    });
  };

  const initializeMap = (startLoc: any, destinationLoc: any) => {
    if (mapRef.current) {
      // Clear existing map data
      if (startMarkerRef.current) {
        startMarkerRef.current.remove();
        startMarkerRef.current = null;
      }
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.remove();
        destinationMarkerRef.current = null;
      }
      mapRef.current.remove();
      mapRef.current = null;
    }
  
    let center: { lat: number; lng: number } = { lat: 28.6139, lng: 77.209 }; // Default center
  
    if (startLoc) {
      center = startLoc;
    } else if (destinationLoc) {
      center = destinationLoc;
    }
  
    const mapInstance = new window.MapmyIndia.Map("map", {
      center: center,
      zoom: 12,
      zoomControl: true,
      hybrid: false,
    });
    mapRef.current = mapInstance;
  
    if (startLoc) {
      const newStartMarker = new window.MapmyIndia.Marker({
        map: mapInstance,
        position: startLoc,
        draggable: false,
      });
      startMarkerRef.current = newStartMarker;
    }
  
    if (destinationLoc) {
      const newDestinationMarker = new window.MapmyIndia.Marker({
        map: mapInstance,
        position: destinationLoc,
        draggable: false,
      });
      destinationMarkerRef.current = newDestinationMarker;
    }
  };

  //  ---------------------- Fetch current location using geoloNavigationcation api  ------------------------------
  const fetchCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Current Location:", latitude, longitude);

          // Fetch address using OpenStreetMap's Nominatim API using geo api
          const response = await fetch(
            //  this is to get the reverse the cord and get address
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.display_name) {
            setSourceQuery(data.display_name);
            setSourceLocation({
              name: data.display_name,
              lat: latitude.toString(),
              lon: longitude.toString(),
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (window.MapmyIndia && (sourceLocation || destLocation)) {
      const startLoc = sourceLocation
        ? {
            lat: parseFloat(sourceLocation.lat),
            lng: parseFloat(sourceLocation.lon),
          }
        : null;
      const destinationLoc = destLocation
        ? {
            lat: parseFloat(destLocation.lat),
            lng: parseFloat(destLocation.lon),
          }
        : null;
      initializeMap(startLoc, destinationLoc);
    } else if (!window.MapmyIndia) {
      const script = document.createElement("script");
      script.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_API_KEY}/map_sdk?layer=vector&v=2.0`; // provide 2d dynamic map
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const startLoc = sourceLocation
          ? {
              lat: parseFloat(sourceLocation.lat),
              lng: parseFloat(sourceLocation.lon),
            }
          : null;
        const destinationLoc = destLocation
          ? {
              lat: parseFloat(destLocation.lat),
              lng: parseFloat(destLocation.lon),
            }
          : null;
        initializeMap(startLoc, destinationLoc);
      };
      document.head.appendChild(script);
    }
  }, [sourceLocation, destLocation]);

  // Fetch optimized route
  const directionPluginRef = useRef<any>(null);

  // Load Mappls SDK scripts
  useEffect(() => {
    const loadMapScript = () => {
      return new Promise<void>((resolve) => {
        const script1 = document.createElement("script");
        script1.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0`; // provide 3d dynamic map
        script1.async = true;

        const script2 = document.createElement("script");
        script2.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_API_KEY}/map_sdk_plugins?v=3.0`;
        script2.async = true;

        script1.onload = () => {
          script2.onload = () => {
            resolve();
          };
          document.head.appendChild(script2);
        };

        document.head.appendChild(script1);
      });
    };

    loadMapScript();

    return () => {
      // Cleanup scripts on component unmount
      const scripts = document.querySelectorAll('script[src*="mappls"]');
      scripts.forEach((script) => script.remove());
    };
  }, []);

  //  this function use to fetch route  in map
  const fetchRoute = async () => {
    if (!sourceLocation || !destLocation || !window.mappls) return;

    try {
      // Initialize map if not already initialized
      if (!mapRef.current) {
        mapRef.current = new window.mappls.Map("map", {
          center: [28.09, 78.3],
          zoom: 5,
        });
      }


       const profileMap: Record<string, string> = {
            car: "driving",
            bike: "biking",
            truck: "trucking",
            walking: "walking",
          };
      
          const selectedProfile = profileMap[vehicleType] || "driving"; // Default to driving
      

      // Initialize direction plugin
      if (mapRef.current && sourceLocation && destLocation) {
        const directionOptions = {
          map: mapRef.current,
          divWidth: "350px",
          isDraggable: false,
          // Profile: [vehicleType], // Use the selected vehicle type
          // Profile:['driving','biking','trucking','walking'],


          Profile: selectedProfile,  

          routeLineColor: "black",
          start: {
            label: sourceLocation.name,
            geoposition: `${sourceLocation.lat},${sourceLocation.lon}`,
          },
          end: {
            label: destLocation.name,
            geoposition: `${destLocation.lat},${destLocation.lon}`,
          },
        };

        if (directionPluginRef.current) {
          directionPluginRef.current.remove();
        }

        // Create new direction plugin
        window.mappls.direction(directionOptions, function (data: any) {
          directionPluginRef.current = data;
          console.log("Direction plugin initialized:", data);
        });
      }
    } catch (error) {
      console.error("Error initializing map or directions:", error);
    }
  };

  // ---------this will ensure that after click on button it give route
  useEffect(() => {
    if (routeRequested) {
      fetchRoute();
      setRouteRequested(false); // Reset after fetching the route
    }
  }, [routeRequested]); // Trigger fetch only when button is clicked

  const activeVehicle = getActiveVehicle();
  
  // ---------------------- Return the main UI here ----------------------
  return (
    <div className="w-full px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Plan Your Route</h1>

      <form className="space-y-6">
        {/* Location Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <label
              htmlFor="source"
              className="block text-sm font-medium text-gray-700"
            >
              Starting Point 
            </label>

            {/* this is for input current suggestion  */}
            <div className="flex">
              <input
                type="text"
                id="source"
                value={sourceQuery}
                onChange={(e) => {
                  setSourceQuery(e.target.value);
                  setSourceLocation(null);
                }}
                className="mt-1 block w-full rounded-md border-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-pink-900"
                placeholder="Enter starting location "
              />
              <button
                type="button"
                onClick={fetchCurrentLocation}
                className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
              >
                📍 Use Current Location 
              </button>
            </div>

            {/* -------------------------- Display suggestions for source location ------------------------------- */}
            {sourceSuggestions.length > 0 && !sourceLocation && (
              <div className="absolute z-10 w-full bg-black mt-1 border border-gray-900 rounded-md shadow-lg">
                {sourceSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSourceQuery(suggestion.display_name);
                      setSourceLocation({
                        name: suggestion.display_name,
                        lat: suggestion.lat,
                        lon: suggestion.lon,
                      });
                      setSourceSuggestions([]);
                    }}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/*-------------------------------- Destination Input Field ---------------------------*/}
          <div className="relative">
            <label
              htmlFor="destination"
              className="block text-sm font-medium text-gray-700"
            >
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destQuery}
              onChange={(e) => {
                setDestQuery(e.target.value);
                setDestLocation(null);
              }}
              className="mt-1 block w-full rounded-md border-gray-900 shadow-sm focus:border-blue-900 focus:ring-blue-500 text-pink-900"
              placeholder="Enter destination"
            />

            {/* -------------------------- Display suggestions for destination location ------------------------------- */}
            {destSuggestions.length > 0 && !destLocation && (
              <div className="absolute z-10 w-full bg-black mt-1 border border-gray-900 rounded-md shadow-lg">
                {destSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="px-4 py-2 hover:bg-gray-900 cursor-pointer"
                    onClick={() => {
                      setDestQuery(suggestion.display_name);
                      setDestLocation({
                        name: suggestion.display_name,
                        lat: suggestion.lat,
                        lon: suggestion.lon,
                      });
                      setDestSuggestions([]);
                    }}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Type Selection */}
        <div className="text-black">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            <VehicleOption
              icon={<Car className="h-6 w-6 " />}
              label="Car"
              selected={vehicleType === "car"}
              // onClick={() => setVehicleType("car")}
              onClick={() => {
                setVehicleType("car");
                fetchRoute();  // Call fetchRoute to update the route and map profile
              }}
            />
            <VehicleOption
              icon={<Bike className="h-6 w-6" />}
              label="Bike"
              selected={vehicleType === "bike"}
              // onClick={() => setVehicleType("bike")}
              onClick={() => {
                setVehicleType("bike");
                fetchRoute();  // Update map profile on selection change
              }}
            />
            <VehicleOption
              icon={<Truck className="h-6 w-6" />}
              label="Truck"
              selected={vehicleType === "truck"}
              // onClick={() => setVehicleType("truck")}
              onClick={() => {
                setVehicleType("truck");
                fetchRoute();  // Update map profile on selection change
              }}
            />
            <VehicleOption
              icon={<Footprints className="h-6 w-6" />}
              label="Walking"
              selected={vehicleType === "Walking"}
              // onClick={() => setVehicleType("Walking")}
              onClick={() => {
                setVehicleType("walking");
                fetchRoute();  // Update map profile on selection change
              }}
            /> 
          </div>
        </div>

        {/* -------------------------- Submit Button ---------------------------- */}
        {/* <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (!sourceLocation || !destLocation) {
              alert("Please select both a starting point and destination!");
              return;
            }
            setRouteRequested(true);
          }}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Navigation size={20} />
          <span>Get Route</span>
        </button> */}

{/* 
<button
  type="submit"
  onClick={(e) => {
    e.preventDefault();
    if (!sourceLocation || !destLocation) {
      alert("Please select both a starting point and destination!");
      return;
    }

    setRouteRequested(true);  // Update state

    setTimeout(() => {
      fetchRoute(); // Ensure fetchRoute runs immediately
    }, 0);
  }}
  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
  <Navigation size={20} />
  <span>Get Route</span>
</button> */}



<button
  type="submit"
  onClick={(e) => {
    e.preventDefault();
    if (!sourceLocation || !destLocation) {
      alert("Please select both a starting point and destination!");
      return;
    }

    setRouteRequested(true);  // Set state before fetching routes
    fetchRoute(); // Ensure fetchRoute is called immediately
  }}
  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
>
  <Navigation size={20} />
  <span>Get Route</span>
</button>


  {/* --------------this is for vaialable route -------------- */}
        <div className="flex flex-row w-full gap-4"> 
          <div id="map" style={{ width: "70%", height: "500px" }}></div>
          {sourceLocation && destLocation && 
          (<div className="w-[30%] p-4 bg-white rounded-lg shadow overflow-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Available Routes</h2>
            {directionPluginRef.current?.data ? (
              <div className="space-y-4">
                {Array.from({ length: directionPluginRef.current.data.length }, (_, i) => {
                  const distance = parseFloat(directionPluginRef.current.data[i].distance); // Distance in km
                  const mileage = parseFloat(activeVehicle.veh_mileage); // Vehicle mileage in km/l
                  const fuelType = activeVehicle.fuel_type.toLowerCase();

                  // Emission factor based on fuel type
                  const emissionFactors = {
                    petrol: 2.31,
                    diesel: 2.68,
                    cng: 2.75,
                  };

                  const co2Emission = mileage
                    ? ((distance / mileage) * (emissionFactors[fuelType] || 2.31)).toFixed(2)
                    : 'N/A'; // Default to Petrol if fuel type is unknown

                  return (
                    <div 
                      key={i}
                      className="p-4 border border-gray-900 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">Route {i + 1}</span>
                        <span className="text-sm text-gray-900">
                          {directionPluginRef.current.data[i].routeName || `Route ${i + 1}`}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Route className="w-4 h-4 text-gray-900" />
                          <span className="text-gray-900">
                            {distance} km
                          </span>
                        </div>
                    


<div className="flex items-center space-x-2">
  <Clock className="w-4 h-4 text-gray-900" />
  <span className="text-gray-900">
  {directionPluginRef.current.data[i].eta.replace(/<[^>]*>/g, "")}
  </span>
</div>
                     
                        <div className="flex items-center space-x-2 col-span-2">
                          <Leaf className="w-4 h-4 text-green-600" />
                          <span className="text-gray-900">
                            CO₂ Emission: {co2Emission} kg
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-900 text-center">
                Enter source and destination to see available routes
              </div>
            )}
          </div>
          )}
        </div>



      </form>
    </div>
  );
};

export default RouteInput;
