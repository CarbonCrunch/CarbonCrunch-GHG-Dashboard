import React, { useEffect, useRef, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import carbonCreditData from "./json/compliance_revenue_fixed.json";
import ghgCoverageData from "./json/ghg_emissions_coverage.json";
import reportingStandardsData from "./json/reporting_standards.json";

const WorldMap = () => {
  const mapRef = useRef(null);
  const [activeTab, setActiveTab] = useState("carbonCredits"); // Default tab: Carbon Credits Market

  // Handle tab switching
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    let chart = am4core.create(mapRef.current, am4maps.MapChart);
    chart.projection = new am4maps.projections.Miller();
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;
    polygonSeries.geodata = am4geodata_worldLow;
    polygonSeries.exclude = ["AQ"];

    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";

    let hoverState = polygonTemplate.states.create("hover");
    hoverState.properties.fill = am4core.color("#367B25");

    const noStatusColor = "#C8F5BF";

    const updateMapData = (dataSource) => {
      polygonSeries.events.on("inited", () => {
        polygonSeries.mapPolygons.each((polygon) => {
          const countryName = polygon.dataItem.dataContext.name;
          const data = dataSource[countryName];
          if (data) {
            polygon.fill = am4core.color(data.color);
            polygon.tooltipText = `[bold]${countryName}[/]\nStatus: ${data.status}`;
          } else {
            polygon.fill = am4core.color(noStatusColor);
            polygon.tooltipText = `[bold]${countryName}[/]\nNo Status Available`;
          }
        });
      });
    };

    // Call the updateMapData function based on the active tab
    if (activeTab === "carbonCredits") {
      updateMapData(carbonCreditData);
    } else if (activeTab === "ghgCoverage") {
      updateMapData(ghgCoverageData);
    } else if (activeTab === "reportingStandards") {
      updateMapData(reportingStandardsData);
    }

    chart.homeZoomLevel = 0.75;
    chart.homeGeoPoint = { latitude: 20, longitude: 0 };
    chart.seriesContainer.draggable = false;
    chart.seriesContainer.resizable = false;
    chart.chartContainer.wheelable = false;
    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.slider.height = 0;

    return () => {
      if (chart) {
        chart.dispose();
      }
    };
  }, [activeTab]); // Re-run effect when the activeTab changes

  // Carbon Credit Markets Legend
  const CarbonCreditLegend = () => (
    <div className="absolute bottom-7 left-4 w-auto h-auto bg-white p-4 rounded-lg shadow-md text-sm md:text-base">
      <div className="font-bold mb-2">Carbon Credit Markets</div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#006400" }}></div>
        <span>ETS and Carbon Tax Implemented (80-100% Coverage)</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#228B22" }}></div>
        <span>ETS Implemented (60-80% Coverage)</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#32CD32" }}></div>
        <span>Carbon Tax Implemented (40-60% Coverage)</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#98FB98" }}></div>
        <span>In Progress (20-40% Coverage)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#C0FFC0" }}></div>
        <span>Under Consideration (&lt;20% Coverage)</span>
      </div>
    </div>
  );

  // GHG Emission Coverage Legend
  const GHGEmissionLegend = () => (
    <div className="absolute bottom-7 left-4 w-auto h-auto bg-white p-4 rounded-lg shadow-md text-sm md:text-base">
      <div className="font-bold mb-2">GHG Emission Coverage</div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#006400" }}></div>
        <span>80-100% | &gt; 1,000 MtCO2-e</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#228B22" }}></div>
        <span>60-80% | 500-1,000 MtCO2-e</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#32CD32" }}></div>
        <span>40-60% | 100-500 MtCO2-e</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#7CFC00" }}></div>
        <span>20-40% | 10-100 MtCO2-e</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#98FB98" }}></div>
        <span>&lt;20% | &lt;10 MtCO2-e</span>
      </div>
    </div>
  );

  // Reporting Standards Legend
  const ReportingStandardsLegend = () => (
    <div className="absolute bottom-7 left-4 w-auto h-auto bg-white p-4 rounded-lg shadow-md text-sm md:text-base">
      <div className="font-bold mb-2">Reporting Standards Compliance</div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#006400" }}></div>
        <span>80-100% Compliance</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#228B22" }}></div>
        <span>60-80% Compliance</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#32CD32" }}></div>
        <span>40-60% Compliance</span>
      </div>
      <div className="flex items-center mb-1">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#98FB98" }}></div>
        <span>20-40% Compliance</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 mr-2" style={{ backgroundColor: "#C0FFC0" }}></div>
        <span>&lt;20% Compliance</span>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen">
      <div className="text-center font-semibold text-[#022952] text-xl md:text-3xl mt-10 mb-4">
        Global Sustainability Landscape
      </div>
      <div className="flex justify-center mb-8 md:mb-16 space-x-2 md:space-x-4">
        <button
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-medium transition duration-300 ${
            activeTab === "carbonCredits"
              ? "bg-[#034385] text-white"
              : "bg-gray-100 text-[#034385] hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("carbonCredits")}
        >
          Carbon Credit Markets
        </button>
        <button
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-medium transition duration-300 ${
            activeTab === "ghgCoverage"
              ? "bg-[#034385] text-white"
              : "bg-gray-100 text-[#034385] hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("ghgCoverage")}
        >
          GHG Emission Coverage
        </button>
        <button
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg font-medium transition duration-300 ${
            activeTab === "reportingStandards"
              ? "bg-[#034385] text-white"
              : "bg-gray-100 text-[#034385] hover:bg-gray-200"
          }`}
          onClick={() => handleTabChange("reportingStandards")}
        >
          Reporting Standards
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full h-[50vh] md:h-[70vh]"
        style={{ backgroundColor: "#FFFFFF" }}
      />

      {/* Dynamic Legend based on the active tab */}
      {activeTab === "carbonCredits" && <CarbonCreditLegend />}
      {activeTab === "ghgCoverage" && <GHGEmissionLegend />}
      {activeTab === "reportingStandards" && <ReportingStandardsLegend />}
    </div>
  );
};

export default WorldMap;