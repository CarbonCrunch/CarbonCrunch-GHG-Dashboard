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
  const { companyName, facilityName, fuel, ownedVehicles, reportId, bioenergy, refrigerants } =
    reportData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          fuelResponse,
          bioenergyResponse,
          refrigerantsResponse,
          // ovResponse,
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
          // axios.get(`/api/reports/${reportId}/CO2eOv`, {
          //   params: {
          //     companyName,
          //     facilityName,
          //     reportId,
          //     ownedVehicles: JSON.stringify(ownedVehicles),
          //   },
          // }),
        ]);

        // setOvData(ovResponse.data.data);
        setFuelData(fuelResponse.data.data);
        setBioenergyData(bioenergyResponse.data.data);
        setRefrigerantsData(refrigerantsResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reportId, companyName, facilityName, fuel, bioenergy, refrigerants]);

  const chartHeight = 600;
  const fuelChartData = {
    labels: fuelData.map((item) => item.fuelType),
    datasets: [
      {
        label: "CO2e Emissions",
        data: fuelData.map((item) => item.CO2e),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
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
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
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
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  // const ovChartData = {
  //   labels: ovData.map((item) => item.category),
  //   datasets: [
  //     {
  //       label: "CO2e Emissions Overview",
  //       data: ovData.map((item) => item.CO2e),
  //       backgroundColor: "rgba(153, 102, 255, 0.6)",
  //       borderColor: "rgba(153, 102, 255, 1)",
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const ovOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { position: "top" },
  //     title: { display: true, text: "CO2e Emissions Overview" },
  //   },
  // };

  const fuelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "CO2e Fuel Emissions" },
    },
  };

  const bioenergyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "CO2e Bioenergy Emissions" },
    },
  };

  const refrigerantsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "CO2e Refrigerants Emissions" },
    },
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">
        Scope 1: Direct emissions arising from owned or controlled stationary
        sources that use fossil fuels and/or emit fugitive emissions
      </h3>
      <div className="flex gap-4 h-[600px]">
        <div className="w-1/3">
          <Bar
            data={fuelChartData}
            options={fuelOptions}
            height={chartHeight}
          />
        </div>
        <div className="w-1/3">
          <Pie
            data={bioenergyChartData}
            options={bioenergyOptions}
            height={chartHeight}
          />
        </div>
        <div className="w-1/3">
          <Bar
            data={refrigerantsChartData}
            options={refrigerantsOptions}
            height={chartHeight}
          />
        </div>
      </div>
    </div>
  );
};
export default Scope1;
