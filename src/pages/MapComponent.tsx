import React, { useEffect } from "react";
import L from "leaflet";
import MapComponent from "./MapComponent";

const MapComponent = ({ currentLocation, destination, routes }: any) => {
  useEffect(() => {
    if (!currentLocation || !destination || !routes.length) return;

    const [lat1, lon1] = currentLocation.split(", ");
    const { latitude, longitude } = destination;

    // Initialize Map
    const map = L.map("map").setView([lat1, lon1], 14);

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    // Add markers
    L.marker([lat1, lon1]).addTo(map).bindPopup("Start Location");
    L.marker([latitude, longitude]).addTo(map).bindPopup("Destination");

    // Add routes with different colors
    const colors = ["blue", "green", "red"];
    routes.forEach((route: any, index: number) => {
      const polyline = L.polyline(route, { color: colors[index % colors.length] }).addTo(map);
      map.fitBounds(polyline.getBounds());
    });
  }, [currentLocation, destination, routes]);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default MapComponent;
