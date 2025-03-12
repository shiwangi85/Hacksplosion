import { useEffect, useState } from "react";

const MapComponent = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const mapplsApiKey = "a0c74d4d-1d2e-4ff5-ad7a-c7169ef365db"; // Replace with your API key

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location fetched:", latitude, longitude);
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Location access denied. Showing default marker.");
          setLocation({ lat: 28.6139, lng: 77.2090 }); // Default location (Delhi)
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (!location) return;

    if (map) {
      if (marker) marker.remove(); // Remove existing marker

      const newMarker = new window.MapmyIndia.Marker({
        map: map,
        position: location,
        draggable: false,
      });

      setMarker(newMarker);
      map.setCenter(location);
    }
  }, [location, map]);

  useEffect(() => {
    if (!location) return;

    function initializeMap() {
      if (map) return;

      const mapInstance = new window.MapmyIndia.Map("map", {
        center: location,
        zoom: 12,
        zoomControl: true,
        hybrid: false, // Set to false if you don't want satellite view
      });

      setMap(mapInstance);

      const initialMarker = new window.MapmyIndia.Marker({
        map: mapInstance,
        position: location,
        draggable: false,
      });
      setMarker(initialMarker);

      // Enable Traffic Layer
      window.MapmyIndia.traffic({
        map: mapInstance,
        show: true,
      });

      console.log("Traffic layers enabled.");
    }

    if (window.MapmyIndia) {
      initializeMap();
    } else {
      console.log("Loading MapmyIndia script...");
      const script = document.createElement("script");
      script.src = `https://apis.mappls.com/advancedmaps/api/${mapplsApiKey}/map_sdk?layer=vector&v=2.0`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("MapmyIndia script loaded.");
        initializeMap();
      };
      document.head.appendChild(script);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [location]);

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default MapComponent;
