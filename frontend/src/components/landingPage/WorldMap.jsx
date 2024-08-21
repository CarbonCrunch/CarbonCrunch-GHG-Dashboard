// import React, { useEffect, useRef } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const WorldMap = () => {
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);

//   useEffect(() => {
//     if (mapInstanceRef.current) return; // Skip if map is already initialized

//     // Set the height of the container to the window's inner height
//     mapRef.current.style.height = `${window.innerHeight}px`;

//     mapInstanceRef.current = L.map(mapRef.current, {
//       center: [20, 0],
//       zoom: 2,
//       zoomControl: false, // Disable default zoom control
//     });

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(mapInstanceRef.current);

//     // Move zoom control to the right
//     L.control.zoom({ position: "topright" }).addTo(mapInstanceRef.current);

//     const infoBox = L.control();

//     infoBox.onAdd = function () {
//       this._div = L.DomUtil.create(
//         "div",
//         "info bg-white bg-opacity-80 p-4 rounded-lg shadow-lg"
//       );
//       this.update();
//       return this._div;
//     };

//     infoBox.update = function (props) {
//       this._div.innerHTML = `
//         <h4 class="text-lg font-semibold mb-2 text-gray-700">Country Information</h4>
//         ${
//           props
//             ? `<p class="text-sm">
//             <span class="font-bold">${props.name}</span><br />
//             Population Density: ${props.density} people / mi<sup>2</sup>
//            </p>`
//             : '<p class="text-sm text-gray-600">Hover over a country</p>'
//         }
//       `;
//     };

//     infoBox.addTo(mapInstanceRef.current);

//     function getColor(d) {
//       return d > 1000
//         ? "#800026"
//         : d > 500
//         ? "#BD0026"
//         : d > 200
//         ? "#E31A1C"
//         : d > 100
//         ? "#FC4E2A"
//         : d > 50
//         ? "#FD8D3C"
//         : d > 20
//         ? "#FEB24C"
//         : d > 10
//         ? "#FED976"
//         : "#FFEDA0";
//     }

//     function style(feature) {
//       return {
//         fillColor: getColor(feature.properties.density),
//         weight: 2,
//         opacity: 1,
//         color: "white",
//         dashArray: "3",
//         fillOpacity: 0.7,
//       };
//     }

//     function highlightFeature(e) {
//       const layer = e.target;

//       layer.setStyle({
//         weight: 5,
//         color: "#666",
//         dashArray: "",
//         fillOpacity: 0.7,
//       });

//       layer.bringToFront();
//       infoBox.update(layer.feature.properties);
//     }

//     function resetHighlight(e) {
//       geojsonLayer.resetStyle(e.target);
//       infoBox.update();
//     }

//     function onEachFeature(feature, layer) {
//       layer.on({
//         mouseover: highlightFeature,
//         mouseout: resetHighlight,
//       });
//     }

//     let geojsonLayer;
//     fetch(
//       "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
//     )
//       .then((response) => response.json())
//       .then((data) => {
//         data.features.forEach((feature) => {
//           feature.properties.density = Math.floor(Math.random() * 1000);
//         });

//         geojsonLayer = L.geoJSON(data, {
//           style: style,
//           onEachFeature: onEachFeature,
//         }).addTo(mapInstanceRef.current);
//       });

//     // Function to update map size
//     const updateMapSize = () => {
//       mapRef.current.style.height = `${window.innerHeight}px`;
//       mapInstanceRef.current.invalidateSize();
//     };

//     // Add event listener for window resize
//     window.addEventListener("resize", updateMapSize);

//     // Cleanup function
//     return () => {
//       window.removeEventListener("resize", updateMapSize);
//       if (mapInstanceRef.current) {
//         mapInstanceRef.current.remove();
//         mapInstanceRef.current = null;
//       }
//     };
//   }, []);

//   return <div ref={mapRef} className="w-full" />;
// };

// export default WorldMap;
