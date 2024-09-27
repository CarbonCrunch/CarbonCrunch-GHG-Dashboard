import React, { useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow"; // Low-detail world map
import countryStatusColor from "./country_status_color.json"; // Custom country status data

const WorldMap = () => {
  const mapRef = useRef(null);

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

    // Set a single default color for all countries
    const defaultColor = "#74B266"; // Set a single default color
    polygonTemplate.fill = am4core.color(defaultColor);

    // Set up hover state
    let hoverState = polygonTemplate.states.create("hover");
    hoverState.properties.fill = am4core.color("#367B25");

    // Apply custom status data from countryStatusColor.json (without changing the colors)
    polygonSeries.events.on("inited", () => {
      polygonSeries.mapPolygons.each((polygon) => {
        const countryName = polygon.dataItem.dataContext.name;
        if (countryStatusColor[countryName]) {
          // Tooltip shows the status, but the color stays the same
          polygon.tooltipText = `[bold]${countryName}[/]\nStatus: ${countryStatusColor[countryName].status}`;
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

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100vh", // Full height
        backgroundColor: "#FFFFFF",
      }}
    />
  );
};

export default WorldMap;
