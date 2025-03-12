import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Bike, Truck, Clock, Leaf, Send, Shield, Ship, Wallet, Trees, Footprints, Route, Navigation, MapPin } from "lucide-react";
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
const MAPPLS_API_KEY = "b41dd109-a999-4383-930e-9c8bded58a92";

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
  const [vehicleType, setVehicleType] = useState(null);
  const [routeRequested, setRouteRequested] = useState(false); // this is for request tot get route after i vclick to button
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [sourceQuery, setSourceQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState<LocationSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);
  const [sourceLocation, setSourceLocation] = useState<Location | null>(null);
  const [destLocation, setDestLocation] = useState<Location | null>(null);
  const mapRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);
  const destinationMarkerRef = useRef<any>(null);
  const [selectedRoute, setSelectedRoute] = useState(null); // Store selected route


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

    // ✅ Enable Traffic Overlays (Red, Green, and Closure)
    mapInstance.isTrafficEnabled = true;  // Enable all traffic layers
    mapInstance.isClosureTrafficEnabled = true;  // Show road closures
    mapInstance.isFreeFlowTrafficEnabled = true;  // Show green roads (free-flowing)
    mapInstance.isNonFreeFlowTrafficEnabled = true;  // Show red/orange roads (traffic congestion)
    mapInstance.isStopIconTrafficEnabled = true;  // Show stop icon for major blocks


    // Remove existing markers before adding new ones
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }



    if (startLoc) {
      startMarkerRef.current = new window.MapmyIndia.Marker({
        map: mapInstance,
        position: startLoc,
        draggable: false,
      });
    }

    if (destinationLoc) {
      destinationMarkerRef.current = new window.MapmyIndia.Marker({
        map: mapInstance,
        position: destinationLoc,
        draggable: false,
      });
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

          updateAvailableRoutes(data);
        });
      }
    } catch (error) {
      console.error("Error initializing map or directions:", error);
    }
  };



  const updateAvailableRoutes = (routeData = null) => {
    if (!routeData) return;

    // Update state or re-render component to show available routes
    setAvailableRoutes(routeData.routes || []);
  };



  // ---------this will ensure that after click on button it give route
  useEffect(() => {
    if (routeRequested) {
      fetchRoute();
      setRouteRequested(false); // Reset after fetching the route
    }
  }, [routeRequested]); // Trigger fetch only when button is clicked

  const activeVehicle = getActiveVehicle();

  const calculateGreenScore = (co2Emission) => {
    // Example calculation: lower CO₂ emission results in a higher green score
    const maxScore = 100;
    const minScore = 0;
    const maxEmission = 100; // Example max emission value for scaling
    const greenScore = maxScore - (co2Emission / maxEmission) * maxScore;
    return Math.max(minScore, Math.min(maxScore, greenScore.toFixed(2)));
  };

  const saveRouteToMetrics = (route: any) => {
    const metrics = JSON.parse(localStorage.getItem('sustainabilityMetrics') || '[]');
    const distance = parseFloat(route.distance); // Distance in km
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

    const greenScore = calculateGreenScore(co2Emission);

    const newMetric = {
      id: (metrics.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
      co2Saved: parseFloat(co2Emission), // Assuming distance is in km
      energyEfficiency: 90, // Placeholder value
      greenScore: parseFloat(greenScore), // Calculated green score
      created_at: new Date().toISOString()
    };
    metrics.unshift(newMetric); // Add new metric to the beginning of the array
    localStorage.setItem('sustainabilityMetrics', JSON.stringify(metrics));
  };

  // ---------------------- Return the main UI here ----------------------
  return (
    <div className="w-full px-4 py-8">
      <form className="space-y-6">
        {/* Location Inputs */}
        <div className="space-y-4">
          <div className="relative">
            <label
              htmlFor="source"
              className="text-purple-500 font-bold text-xl"
            >
              Starting Point
            </label>

            <div className="relative flex items-center">
              {/* Location Icon */}
              <MapPin className="absolute left-3 w-5 h-5 text-gray-500" />

              {/* Input Field */}
              <input
                type="text"
                id="source"
                value={sourceQuery}
                onChange={(e) => {
                  setSourceQuery(e.target.value);
                  setSourceLocation(null);
                }}

                className="mt-1 block w-full px-6 py-4 pl-10 rounded-xl border-2 border-gray-300  text-black
              focus:border-purple-700 focus:ring-4 focus:ring-purple-300 focus:bg-white focus:outline-none transition duration-200 ease-in-out"
                placeholder="Enter starting location "
              />
              <button
                type="button"
                onClick={fetchCurrentLocation}
                className="absolute right-2 px-3 py-1 bg-purple-100 text-white rounded-md shadow-sm hover:bg-purple-200 text-sm"
              >
                {/* <Send className="w-6 h-6 text-purple-500" /> */}
                <Send className="w-6 h-6 text-purple-500" />
              </button>
            </div>


            {/* -------------------------- Display suggestions for source location ------------------------------- */}
            {sourceSuggestions.length > 0 && !sourceLocation && (
              <div className="absolute z-10 w-full text-black bg-white mt-1 border border-gray-900 rounded-md shadow-lg">
                {sourceSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="px-4 py-2  hover:text-white hover:bg-gray-900  cursor-pointer"
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
              className="text-purple-500 font-bold text-xl"
            >
              Destination
            </label>
            <MapPin className="absolute left-4 w-5 h-5 text-gray-500" />
            <input
              type="text"
              id="destination"
              value={destQuery}
              onChange={(e) => {
                setDestQuery(e.target.value);
                setDestLocation(null);
              }}
              className="mt-1 block w-full px-6 py-4 pl-10 rounded-xl border-2 border-gray-300  text-black
              focus:border-purple-700 focus:ring-4 focus:ring-purple-300 focus:bg-white focus:outline-none transition duration-200 ease-in-out"
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
          <label className="text-purple-500 font-bold text-xl">
            Vehicle Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <VehicleOption
              icon={<Car size={24} />}
              label="Car"
              selected={vehicleType === "car"}
              // onClick={() => setVehicleType("car")}
              onClick={() => {
                setVehicleType("car");
                fetchRoute();  // Call fetchRoute to update the route and map profile
                updateAvailableRoutes();
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
                updateAvailableRoutes();
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
                updateAvailableRoutes();
              }}
            />
            <VehicleOption
              icon={<Footprints className="h-6 w-6" />}
              label="Walking"
              selected={vehicleType === "Walking"}
              // onClick={() => setVehicleType("Walking")}
              onClick={() => {
                setVehicleType("walking");

                updateAvailableRoutes(); fetchRoute();  // Update map profile on selection change
              }}
            />
          </div>
        </div>





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
            updateAvailableRoutes(); // Call function to update right-side route list
          }}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Navigation size={20} />
          <span>Get Route</span>
        </button>


     {/* route prefrence acc to co2 emission and time  */}
 



        {/* --------------this is for vaialable route -------------- */}
        <div className="flex flex-row w-full gap-4 text-black">
          <div id="map" style={{ width: "70%", height: "500px" }}></div>
          {sourceLocation && destLocation &&
            (<div className="w-[30%] p-4 bg-white rounded-lg shadow overflow-auto">
              <h2 className="text-purple-500 font-bold text-xl">Available Routes</h2>



{directionPluginRef.current?.data ? (() => {
    const routes = directionPluginRef.current.data.map((route, i) => {
        const distance = parseFloat(route.distance);
        const mileage = parseFloat(activeVehicle.veh_mileage);
        const fuelType = activeVehicle.fuel_type.toLowerCase();
        
        const emissionFactors = {
            petrol: 2.31,
            diesel: 2.68,
            cng: 2.75,
        };
        
        const co2Emission = mileage
            ? ((distance / mileage) * (emissionFactors[fuelType] || 2.31)).toFixed(2)
            : 'N/A';
        
        return { ...route, index: i, distance, co2Emission: parseFloat(co2Emission) };
    });

    // Find the preferred route (lowest CO₂ emission, then shortest time)
    const preferredRoute = routes.reduce((best, current) => {
        if (
            current.co2Emission < best.co2Emission || 
            (current.co2Emission === best.co2Emission && parseInt(current.eta) < parseInt(best.eta))
        ) {
            return current;
        }
        return best;
    }, routes[0]);

  

    return (
      <div className="space-y-4">
          {/* Available Routes */}
          {routes.map((route) => (
              <div
                  key={route.index}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors relative ${
                      route.index === preferredRoute.index
                          ? "border-green-500 bg-green-50 shadow-lg"  // Highlight best route
                          : "border-gray-900 hover:border-blue-500"
                  }`}
                  onClick={() => saveRouteToMetrics(route)}
              >
                  <div className="flex items-center justify-between mb-2 text-cyan-500">
                      <span className="font-medium text-gray-900">Route {route.index + 1}</span>
                      <span className="text-sm text-gray-900">{route.routeName || `Route ${route.index + 1}`}</span>
  
                      {/* Preferred Route Badge */}
                      {route.index === preferredRoute.index && (
                          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                              Preferred
                          </span>
                      )}
                  </div>
  
                  <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                          <Route className="w-4 h-4 text-gray-900" />
                          <span className="text-gray-900">{route.distance} km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-900" />
                          <span className="text-gray-900">{route.eta.replace(/<[^>]*>/g, "")}</span>
                      </div>
                      <div className="flex items-center space-x-2 col-span-2">
                          <Leaf className="w-4 h-4 text-green-800 shadow-xl border-4 rounded-md drop-shadow-[0_0_5px_rgba(34,187,94,0.8)] " />
                          <span className="text-gray-900">CO₂ Emission: {route.co2Emission} kg</span>
                      </div>
                  </div>
              </div>
          ))}
      </div>
  );
  




    
})() : (
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




