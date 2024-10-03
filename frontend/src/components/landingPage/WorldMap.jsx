import React, { useEffect, useRef, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow"; // Low-detail world map
import countryStatusColor from "./country_status_color.json"; // Custom country status data

const WorldMap = () => {
  const mapRef = useRef(null);
  const [activeTab, setActiveTab] = useState("issuance");

  // Handle tab switching
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    // Create map instance
    let chart = am4core.create(mapRef.current, am4maps.MapChart);

    // Set map projection
    chart.projection = new am4maps.projections.Miller();

    // Add the world polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Load GeoJSON data
    polygonSeries.useGeodata = true;
    polygonSeries.geodata = am4geodata_worldLow;

    // Exclude Antarctica from the map
    polygonSeries.exclude = ["AQ"];

    // Configure the polygons (countries)
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}"; // Display country name

    // Set up hover state
    let hoverState = polygonTemplate.states.create("hover");
    hoverState.properties.fill = am4core.color("#367B25");

    // Define different shades of green for different statuses
    const shadesOfGreen = {
      implemented: "#228B22", // Dark green for implemented countries
      not_implemented: "#ADFF2F", // Light green for not implemented countries
      in_progress: "#32CD32", // Lime green for countries in progress
    };

    // Define a color for countries without status
    const noStatusColor = "#C8F5BF"; // Light gray for countries without status

    // Apply custom status data from countryStatusColor.json
    polygonSeries.events.on("inited", () => {
      polygonSeries.mapPolygons.each((polygon) => {
        const countryName = polygon.dataItem.dataContext.name;
        if (countryStatusColor[countryName]) {
          const status = countryStatusColor[countryName].status;

          // Apply color based on the status
          let fillColor = shadesOfGreen[status] || "#74B266"; // Default color if status is not found
          polygon.fill = am4core.color(fillColor);

          // Tooltip shows the status
          polygon.tooltipText = `[bold]${countryName}[/]\nStatus: ${countryStatusColor[countryName].status}`;
        } else {
          // If no status is found, apply a different color
          polygon.fill = am4core.color(noStatusColor);

          // Tooltip for countries with no status
          polygon.tooltipText = `[bold]${countryName}[/]\nNo Status Available`;
        }
      });
    });

    // Adjust zoom to make the map smaller and fully visible
    chart.homeZoomLevel = 0.75; // Further lower zoom level to make countries smaller and fully visible
    chart.homeGeoPoint = { latitude: 20, longitude: 0 }; // Center position

    // Disable panning and interactions
    chart.seriesContainer.draggable = false;
    chart.seriesContainer.resizable = false;
    chart.chartContainer.wheelable = false; // Disable zooming with mouse wheel
    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.slider.height = 0; // Hide the zoom slider

    return () => {
      // Clean up chart when component unmounts
      if (chart) {
        chart.dispose();
      }
    };
  }, []);

  // New Color Legend Component
  const EmissionsCoverageLegend = () => (
    <div className="absolute bottom-7 left-4 w-auto h-auto bg-white p-4 rounded-lg shadow-md text-sm md:text-base">
      <div className="font-bold mb-2">EMISSIONS COVERAGE</div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#228B22" }}></div>
        <span>80-100% | &gt; 1,000 MtCO2-e</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#ADFF2F" }}></div>
        <span>60-80% | 500-1,000 Mt CO2-e</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#32CD32" }}></div>
        <span>40-60% | 100-500 Mt CO2-e</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#7CFC00" }}></div>
        <span>20-40% | 10-100 Mt CO2-e</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#98FB98" }}></div>
        <span>&lt;20% | &lt;10 Mt CO2-e</span>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen">
      {/* Tab Menu */}
      <div className="text-center font-semibold text-[#022952] text-xl md:text-3xl mt-10 mb-4">
        Global Sustainability Landscape
      </div>
      <div className="flex justify-center mb-8 md:mb-16 space-x-2 md:space-x-4">
        <button
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-medium transition duration-300 ${
            activeTab === "instrument"
              ? "bg-[#034385] text-white"
              : "bg-gray-100 text-[#034385] hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("instrument")}
        >
          Carbon Credit Markets
        </button>
        <button
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-medium transition duration-300 ${
            activeTab === "issuance"
              ? "bg-[#034385] text-white"
              : "bg-gray-100 text-[#034385] hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("issuance")}
        >
          GHG Emission Coverage
        </button>
        <button
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-medium transition duration-300 ${
            activeTab === "cooperative"
              ? "bg-[#034385] text-white"
              : "bg-gray-100 text-[#034385] hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("cooperative")}
        >
          Reporting Standard
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-[50vh] md:h-[70vh]" // Responsive height for the map
        style={{
          backgroundColor: "#FFFFFF",
        }}
      />

      {/* Emissions Coverage Legend at the bottom-left */}
      <EmissionsCoverageLegend />
    </div>
  );
};

export default WorldMap;