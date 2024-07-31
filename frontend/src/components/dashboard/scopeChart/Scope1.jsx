import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const Scope1 = ({ reports }) => {
  const [ovData, setOvData] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const [bioenergyData, setBioenergyData] = useState([]);
  const [refrigerantsData, setRefrigerantsData] = useState([]);
  const [passengerData, setPassengerData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);

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

        const passengerVehicles = ovResponse.data.data.filter(
          (vehicle) => vehicle.level1 === "Passenger vehicles"
        );
        const deliveryVehicles = ovResponse.data.data.filter(
          (vehicle) => vehicle.level1 === "Delivery vehicles"
        );
        setPassengerData(passengerVehicles);
        setDeliveryData(deliveryVehicles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reportId, companyName, facilityName, fuel, bioenergy, refrigerants]);

  const chartHeight = 510; // Reduced height by 15%
  const barColors = [
    "#FBAF58",
    "#2E4F50",
    "#A6D39F",
    "#DDDCBD",
    "#51DAD9",
    "#2D92D5",
  ];

  const pieColors = [
    "#39C9EF",
    "#86EAE9",
    "#5DBDD3",
    "#4591B8",
    "#3B6696",
    "#353C6E",
    "#705788",
    "#A5769E",
    "#2D2F36",
    "#D88AAC",
    "#F490A2",
    "#F79A86",
  ];

  const fuelChartData = {
    labels: fuelData.map((item) => item.fuelType),
    datasets: [
      {
        label: "CO2e Emissions",
        data: fuelData.map((item) => item.CO2e),
        backgroundColor: barColors,
        borderColor: barColors,
        borderWidth: 1,
      },
    ],
  };

  const bioenergyChartData = {
    labels: bioenergyData.map((item) => item.fuelType),
    datasets: [
      {
        data: bioenergyData.map((item) => item.CO2e),
        backgroundColor: pieColors,
        borderColor: "#FFFFFF",
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
        backgroundColor: barColors,
        borderColor: barColors,
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

 const radarOptions = {
   responsive: true,
   maintainAspectRatio: false,
   scales: {
     r: {
       angleLines: {
         display: false,
       },
       suggestedMin: 0,
       suggestedMax: 1, // Decreased the scale to 1
     },
   },
   plugins: {
     legend: { position: "top" },
     title: {
       display: true,
       text: "Emissions from Owned Vehicles",
       font: { size: 22 },
     },
     tooltip: tooltipOptions,
   },
 };

const passengerChartData = {
  labels: ["Plug-in Hybrid", "Electric", "Petrol", "Diesel", "LPG"],
  datasets: [
    {
      label: "Passenger Vehicles",
      data: [0.3, 0.1, 0.7, 0.6, 0.4],
      backgroundColor: pieColors.slice(0, 5),
      borderColor: "#2F4F4F",
      borderWidth: 1,
    },
  ],
};


const deliveryChartData = {
  labels: ["Petrol", "Diesel", "Electric", "CNG"],
  datasets: [
    {
      label: "Delivery Vehicles",
      data: [0.8, 0.6, 0.2, 0.4], // Hard-coded data for delivery vehicles
      backgroundColor: pieColors.slice(0, 4),
      borderColor: "#2F4F4F",
      borderWidth: 1,
    },
  ],
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
    scales: {
      y: {
        display: false, // Remove categories from y-axis
      },
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
    scales: {
      x: {
        display: false, // Remove types of gases from x-axis
      },
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
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={fuelChartData}
              options={fuelOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Pie
              data={bioenergyChartData}
              options={bioenergyOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={refrigerantsChartData}
              options={refrigerantsOptions}
              height={chartHeight}
            />
          </div>
        </div>
        <div className="flex gap-4 h-[510px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Radar
              data={passengerChartData}
              options={radarOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Radar
              data={deliveryChartData}
              options={radarOptions}
              height={chartHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope1;
