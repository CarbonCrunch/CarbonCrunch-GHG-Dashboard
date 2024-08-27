import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import countryStatusColor from "./country_status_color.json";

const WorldMap = () => {
  const mapRef = useRef(null);
  const [geojsonData, setGeojsonData] = useState(null);
  const [infoContent, setInfoContent] = useState("Hover over a country");

  useEffect(() => {
    // Fetch GeoJSON data on component mount
    fetch(
      "https://raw.githubusercontent.com/CarbonCrunch/CarbonCrunch-GHG-Dashboard/main/GeoJSON/combined.geo.json"
    )
      .then((response) => response.json())
      .then((data) => setGeojsonData(data))
      .catch((error) => console.error("Error fetching GeoJSON data:", error));
  }, []);

  const onEachFeature = (feature, layer) => {
    const countryInfo = countryStatusColor[feature.properties.name];
    if (countryInfo) {
      feature.properties.status = countryInfo.status;
      feature.properties.hover = countryInfo.hover;
    }

    const highlightFeature = (e) => {
      const layer = e.target;
      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });
      layer.bringToFront();
      setInfoContent(`
        <p class="text-sm">
          <span class="font-bold">${feature.properties.name}</span><br />
          Status: ${feature.properties.status || "Unknown"}<br />
          ${feature.properties.hover || "No additional information"}
        </p>
      `);
    };

    const resetHighlight = (e) => {
      e.target.setStyle(style(e.target.feature));
      setInfoContent("Hover over a country");
    };

    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
    });
  };

  const style = (feature) => {
    const countryInfo = countryStatusColor[feature.properties.name];
    return {
      fillColor: countryInfo ? countryInfo.color : "#FFEDA0",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const InfoBox = () => {
    return (
      <div className="leaflet-control leaflet-top leaflet-left bg-white bg-opacity-80 p-4 rounded-lg shadow-lg" style={{ zIndex: 400 }}>
        <h4 className="text-lg font-semibold mb-2 text-gray-700">Country Information</h4>
        <div dangerouslySetInnerHTML={{ __html: infoContent }} />
      </div>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden" ref={mapRef} style={{ height: "83vh", zIndex: 1 }}>
      {/* The map container */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={true}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        whenCreated={(map) => {
          map.fitBounds([
            [-60, -180],
            [85, 180],
          ]);
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" noWrap={true} />
        {geojsonData && (
          <GeoJSON data={geojsonData} style={style} onEachFeature={onEachFeature} />
        )}
        <InfoBox />
      </MapContainer>
    </div>
  );
};

export default WorldMap;
