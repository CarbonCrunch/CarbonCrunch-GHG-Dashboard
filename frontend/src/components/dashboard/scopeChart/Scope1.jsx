import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Scope1 = ({ reports }) => {
  const [ovData, setOvData] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const [bioenergyData, setBioenergyData] = useState([]);
  const [refrigerantsData, setRefrigerantsData] = useState([]);

  const reportData = reports[0];
  const {
    companyName,
    facilityName,
    fuel,
    ownedVehicles,
    reportId,
    bioenergy,
    refrigerants,
  } = reportData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          fuelResponse,
          bioenergyResponse,
          refrigerantsResponse,
          ovResponse,
        ] = await Promise.all([
          axios.get(`/api/reports/${reportId}/CO2eFuel`, {
            params: {
              companyName,
              facilityName,
              reportId,
              fuel: JSON.stringify(fuel),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eBioenergy`, {
            params: {
              companyName,
              facilityName,
              reportId,
              bioenergy: JSON.stringify(bioenergy),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eRefrigerants`, {
            params: {
              companyName,
              facilityName,
              reportId,
              refrigerants: JSON.stringify(refrigerants),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eOv`, {
            params: {
              companyName,
              facilityName,
              reportId,
              ownedVehicles: JSON.stringify(ownedVehicles),
            },
          }),
        ]);

        setOvData(ovResponse.data.data);
        setFuelData(fuelResponse.data.data);
        setBioenergyData(bioenergyResponse.data.data);
        setRefrigerantsData(refrigerantsResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reportId, companyName, facilityName, fuel, bioenergy, refrigerants]);

  const chartHeight = 510; // Reduced height by 15%
  const barColor = "#2F4F4E";

  const fuelChartData = {
    labels: fuelData.map((item) => item.fuelType),
    datasets: [
      {
        label: "CO2e Emissions",
        data: fuelData.map((item) => item.CO2e),
        backgroundColor: barColor,
        borderColor: barColor,
        borderWidth: 1,
      },
    ],
  };

 const bioenergyChartData = {
   labels: bioenergyData.map((item) => item.fuelType),
   datasets: [
     {
       data: bioenergyData.map((item) => item.CO2e),
       backgroundColor: [
         "#2F4F4F", // Dark Slate Gray
         "#3D6666", // Lighter tone
         "#4B7D7D", // Even lighter
         "#598F8F", // Lighter still
         "#67A0A0", // Lightest tone
       ],
       borderColor: "#1A2C2C", // Darker tone for borders
       borderWidth: 1,
     },
   ],
 };

  const refrigerantsChartData = {
    labels: refrigerantsData.map((item) => item.emission),
    datasets: [
      {
        label: "CO2e Emissions",
        data: refrigerantsData.map((item) => item.CO2e),
        backgroundColor: barColor,
        borderColor: barColor,
        borderWidth: 1,
      },
    ],
  };

  const ovChartData = {
    labels: ovData.map(
      (item) => `${item.level1} - ${item.level2} - ${item.level3}`
    ),
    datasets: [
      {
        label: "CO2e Emissions",
        data: ovData.map((item) => item.CO2e),
        backgroundColor: barColor,
        borderColor: barColor,
        borderWidth: 1,
      },
    ],
  };

  const tooltipOptions = {
    callbacks: {
      label: function (context) {
        let label = context.dataset.label || "";
        if (label) {
          label += ": ";
        }
        label += `CO2e: ${context.raw}`;
        return label;
      },
    },
    bodyFont: {
      size: 24, // Increase font size by 4x
    },
    titleFont: {
      size: 24, // Increase font size by 4x
    },
    padding: 16, //
  };

  const ovOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from Owned Vehicles",
        font: { size: 22 }, // Increase title font size by 5x
      },
      tooltip: tooltipOptions,
    },
  };

  const fuelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Fuel Emissions",
        font: { size: 22 }, // Increase title font size by 5x
      },
      tooltip: tooltipOptions,
    },
  };

  const bioenergyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Bioenergy Emissions",
        font: { size: 22 }, // Increase title font size by 5x
      },
      tooltip: tooltipOptions,
    },
  };

  const refrigerantsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Refrigerants Emissions",
        font: { size: 22 }, // Increase title font size by 5x
      },
      tooltip: tooltipOptions,
    },
  };

    return (
  <div>
    <h3 className="text-lg font-bold mb-2">
      Scope 1: Direct emissions arising from owned or controlled stationary
      sources that use fossil fuels and/or emit fugitive emissions
    </h3>
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 h-[510px]">
        <div className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg" style={{ backgroundColor: "#DDDCBD" }}>
          <Bar
            data={fuelChartData}
            options={fuelOptions}
            height={chartHeight}
          />
        </div>
        <div className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg" style={{ backgroundColor: "#DDDCBD" }}>
          <Pie
            data={bioenergyChartData}
            options={bioenergyOptions}
            height={chartHeight}
          />
        </div>
      </div>
      <div className="flex gap-4 h-[510px]">
        <div className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg" style={{ backgroundColor: "#DDDCBD" }}>
          <Bar
            data={refrigerantsChartData}
            options={refrigerantsOptions}
            height={chartHeight}
          />
        </div>
        <div className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg" style={{ backgroundColor: "#DDDCBD" }}>
          <Bar data={ovChartData} options={ovOptions} height={chartHeight} />
        </div>
      </div>
    </div>
  </div>
);

};

export default Scope1;
