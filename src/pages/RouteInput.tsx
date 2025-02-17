import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Bike, Truck, Clock, Leaf, Shield } from 'lucide-react';

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

const RouteInput = () => {
    const navigate = useNavigate();
    const [vehicleType, setVehicleType] = useState('car');
    const [routeType, setRouteType] = useState('fastest');

    // Add new state variables
    const [sourceQuery, setSourceQuery] = useState('');
    const [destQuery, setDestQuery] = useState('');
    const [sourceSuggestions, setSourceSuggestions] = useState<LocationSuggestion[]>([]);
    const [destSuggestions, setDestSuggestions] = useState<LocationSuggestion[]>([]);

    // Add new state for storing selected locations
    const [sourceLocation, setSourceLocation] = useState<Location | null>(null);
    const [destLocation, setDestLocation] = useState<Location | null>(null);

    const mapRef = useRef<any>(null);
    const startMarkerRef = useRef<any>(null);
    const destinationMarkerRef = useRef<any>(null);

    // Modify fetchAddressSuggestions to return full location data
    const fetchAddressSuggestions = async (query: string) => {
        if (!query) {
            return [];
        }
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&countrycodes=IN&viewbox=74.0,31.5,84.5,26.0&bounded=1&q=${query}`
            );
            const data: LocationSuggestion[] = await response.json();
            return data.map(item => ({
                place_id: item.place_id,
                display_name: item.display_name,
                lat: item.lat,
                lon: item.lon
            }));
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
            return [];
        }
    };

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

    // Modify handleSubmit to include location data
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!sourceLocation || !destLocation) {
            alert('Please select both source and destination locations');
            return;
        }
        navigate('/route-results', {
            state: {
                source: sourceLocation,
                destination: destLocation,
                vehicleType,
                routeType
            }
        });
    };

    // Create Map Initialization function here
    const initializeMap = (startLoc: any, destinationLoc: any) => {
        if (mapRef.current) {
            // Clear existing map data
            if (startMarkerRef.current) startMarkerRef.current.remove();
            if (destinationMarkerRef.current) destinationMarkerRef.current.remove();
            mapRef.current.remove();
        }

        let center: { lat: number; lng: number } = { lat: 28.6139, lng: 77.2090 }; // Default center

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

    useEffect(() => {
        if (window.MapmyIndia && (sourceLocation || destLocation)) {
            const startLoc = sourceLocation ? { lat: parseFloat(sourceLocation.lat), lng: parseFloat(sourceLocation.lon) } : null;
            const destinationLoc = destLocation ? { lat: parseFloat(destLocation.lat), lng: parseFloat(destLocation.lon) } : null;
            initializeMap(startLoc, destinationLoc);
        }
        else if (!window.MapmyIndia) {
            const script = document.createElement("script");
            script.src = `https://apis.mappls.com/advancedmaps/api/9fa106fc5e89d46ea995c238fea17299/map_sdk?layer=vector&v=2.0`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                const startLoc = sourceLocation ? { lat: parseFloat(sourceLocation.lat), lng: parseFloat(sourceLocation.lon) } : null;
                const destinationLoc = destLocation ? { lat: parseFloat(destLocation.lat), lng: parseFloat(destLocation.lon) } : null;
                initializeMap(startLoc, destinationLoc);
            };
            document.head.appendChild(script);
        }
    }, [sourceLocation, destLocation]);


    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Plan Your Route</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Location Inputs */}
                <div className="space-y-4">
                    <div className="relative">
                        <label htmlFor="source" className="block text-sm font-medium text-gray-700">Starting Point</label>
                        <input
                            type="text"
                            id="source"
                            value={sourceQuery}
                            onChange={(e) => {
                                setSourceQuery(e.target.value);
                                setSourceLocation(null);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter starting location"
                        />
                        {sourceSuggestions.length > 0 && !sourceLocation && (
                            <div className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-md shadow-lg">
                                {sourceSuggestions.map((suggestion: LocationSuggestion) => (
                                    <div
                                        key={suggestion.place_id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSourceQuery(suggestion.display_name);
                                            setSourceLocation({
                                                name: suggestion.display_name,
                                                lat: suggestion.lat,
                                                lon: suggestion.lon
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

                    <div className="relative">
                        <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                        <input
                            type="text"
                            id="destination"
                            value={destQuery}
                            onChange={(e) => {
                                setDestQuery(e.target.value);
                                setDestLocation(null);
                            }}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter destination"
                        />
                        {destSuggestions.length > 0 && !destLocation && (
                            <div className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-md shadow-lg">
                                {destSuggestions.map((suggestion: LocationSuggestion) => (
                                    <div
                                        key={suggestion.place_id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setDestQuery(suggestion.display_name);
                                            setDestLocation({
                                                name: suggestion.display_name,
                                                lat: suggestion.lat,
                                                lon: suggestion.lon
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
                <div className='text-black'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                    <div className="grid grid-cols-3 gap-4">
                        <VehicleOption
                            icon={<Car className="h-6 w-6 " />}
                            label="Car"
                            selected={vehicleType === 'car'}
                            onClick={() => setVehicleType('car')}
                        />
                        <VehicleOption
                            icon={<Bike className="h-6 w-6" />}
                            label="Bike"
                            selected={vehicleType === 'bike'}
                            onClick={() => setVehicleType('bike')}
                        />
                        <VehicleOption
                            icon={<Truck className="h-6 w-6" />}
                            label="Truck"
                            selected={vehicleType === 'truck'}
                            onClick={() => setVehicleType('truck')}
                        />
                    </div>
                </div>

                {/* Route Type Selection */}
                <div className='text-black'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Route Preference</label>
                    <div className="grid grid-cols-3 gap-4">
                        <RouteOption
                            icon={<Clock className="h-6 w-6" />}
                            label="Fastest"
                            selected={routeType === 'fastest'}
                            onClick={() => setRouteType('fastest')}
                        />
                        <RouteOption
                            icon={<Shield className="h-6 w-6" />}
                            label="Safest"
                            selected={routeType === 'safest'}
                            onClick={() => setRouteType('safest')}
                        />
                        <RouteOption
                            icon={<Leaf className="h-6 w-6" />}
                            label="Eco-friendly"
                            selected={routeType === 'eco'}
                            onClick={() => setRouteType('eco')}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Optimize Route
                </button>
                {/*<MapComponent*/}
                {/*    start={sourceLocation ? { lat: parseFloat(sourceLocation.lat), lng: parseFloat(sourceLocation.lon) } : null}*/}
                {/*    destination={destLocation ? { lat: parseFloat(destLocation.lat), lng: parseFloat(destLocation.lon) } : null}*/}
                {/*/>*/}
                <div id="map" style={{ width: "100%", height: "500px" }}></div>
            </form>
        </div>
    );
};

const VehicleOption = ({ icon, label, selected, onClick }: { icon: React.ReactNode, label: string, selected: boolean, onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-4 border rounded-lg flex flex-col items-center ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
    >
        {icon}
        <span className="mt-2 text-sm font-medium">{label}</span>
    </button>
);

const RouteOption = ({ icon, label, selected, onClick }: { icon: React.ReactNode, label: string, selected: boolean, onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-4 border rounded-lg flex flex-col items-center ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
            }`}
    >
        {icon}
        <span className="mt-2 text-sm font-medium">{label}</span>
    </button>
);

export default RouteInput;
