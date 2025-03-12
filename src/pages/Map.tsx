// import { useEffect, useRef, useState } from "react";

// const MapComponent = () => {
//   const mapRef = useRef<any>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const [isMapLoaded, setIsMapLoaded] = useState(false);
//   let marker: any = null;

//   useEffect(() => {
//     if (!window.MapmyIndia) return;

//     // Initialize Map
//     mapRef.current = new window.MapmyIndia.Map("map", {
//       center: [28.09, 78.3],
//       zoom: 5,
//       search: false,
//     });

//     setIsMapLoaded(true);
//   }, []);

//   useEffect(() => {
//     if (!isMapLoaded || !searchInputRef.current) return;

//     // Initialize Search Plugin
//     const optionalConfig = { location: [28.61, 77.23] };

//     new window.MapmyIndia.search(
//       searchInputRef.current,
//       optionalConfig,
//       (data : any) => {
//         if (!data || !data[0]) return;
//         const dt = data[0];
//         const eloc = dt.eLoc;
//         const place = `${dt.placeName}, ${dt.placeAddress}`;

//         // Remove previous marker
//         if (marker) marker.remove();

//         // Add new marker
//         marker = new window.MapmyIndia.elocMarker({
//           map: mapRef.current,
//           eloc: eloc,
//           popupHtml: place,
//           popupOptions: { openPopup: true },
//         }).fitbounds();
//       }
//     );
//   }, [isMapLoaded]);

//   return (
//     <div style={{ width: "100%", height: "100vh", position: "relative" }}>
//       <div id="map" style={{ width: "100%", height: "100%" }}></div>
//       <input
//         type="text"
//         ref={searchInputRef}
//         placeholder="Search places or eLoc's..."
//         style={{
//           color: "#000",
//           maxWidth: "99%",
//           width: "300px",
//           position: "absolute",
//           zIndex: 999,
//           fontSize: "15px",
//           padding: "10px",
//           border: "1px solid #ddd",
//           outline: "none",
//           top: "5px",
//           borderRadius: "10px",
//           margin: "4px",
//         }}
//       />
//     </div>
//   );
// };

// export default MapComponent;