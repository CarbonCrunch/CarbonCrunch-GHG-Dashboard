import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import countryStatusColor from "./country_status_color.json";  

const WorldMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const mapHeight = (window.innerHeight * 3) / 3;
    mapRef.current.style.height = `${mapHeight}px`;
    mapRef.current.style.width = "100%";

    mapInstanceRef.current = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      noWrap: true,
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current.fitBounds([
      [-60, -180],
      [85, 180],
    ]);

    const infoBox = L.control();

    infoBox.onAdd = function () {
      this._div = L.DomUtil.create(
        "div",
        "info bg-white bg-opacity-80 p-4 rounded-lg shadow-lg"
      );
      this.update();
      return this._div;
    };

    infoBox.update = function (props) {
      this._div.innerHTML = `
        <h4 class="text-lg font-semibold mb-2 text-gray-700">Country Information</h4>
        ${
          props
            ? `<p class="text-sm">
                <span class="font-bold">${props.name}</span><br />
                Status: ${props.status}<br />
                ${props.hover}
              </p>`
            : '<p class="text-sm text-gray-600">Hover over a country</p>'
        }
      `;
    };

    infoBox.addTo(mapInstanceRef.current);

    function style(feature) {
      const countryInfo = countryStatusColor[feature.properties.name];
      return {
        fillColor: countryInfo ? countryInfo.color : "#FFEDA0", // Default color if no match
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    }

    function highlightFeature(e) {
      const layer = e.target;

      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });

      layer.bringToFront();
      infoBox.update(layer.feature.properties);
    }

    function resetHighlight(e) {
      geojsonLayer.resetStyle(e.target);
      infoBox.update();
    }

    function onEachFeature(feature, layer) {
      const countryInfo = countryStatusColor[feature.properties.name];
      if (countryInfo) {
        feature.properties.status = countryInfo.status;
        feature.properties.hover = countryInfo.hover;
      }
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
      });
    }

    let geojsonLayer;
    fetch(
      "https://raw.githubusercontent.com/CarbonCrunch/CarbonCrunch-GHG-Dashboard/main/GeoJSON/combined.geo.json"
    )
      .then((response) => response.json())
      .then((data) => {
        geojsonLayer = L.geoJSON(data, {
          style: style,
          onEachFeature: onEachFeature,
        }).addTo(mapInstanceRef.current);
      });

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend"),
        labels = [];

      // for (const [country, info] of Object.entries(countryStatusColor)) {
      //   labels.push(`<i style="background:${info.color}"></i> ${info.status}`);
      // }
      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(mapInstanceRef.current);

    const updateMapSize = () => {
      const newMapHeight = (window.innerHeight * 3) / 3;
      mapRef.current.style.height = `${newMapHeight}px`;
      mapRef.current.style.width = "100%";
      mapInstanceRef.current.invalidateSize();
    };

    window.addEventListener("resize", updateMapSize);

    return () => {
      window.removeEventListener("resize", updateMapSize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div ref={mapRef} className="w-full z-0" />;
};

export default WorldMap;
