import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLightbulb } from 'react-icons/fa';
import { FaQuestionCircle } from 'react-icons/fa';
import { Bar, Pie, Radar } from "react-chartjs-2";
import one from '../../landingPage/assets/1.png';
import two from '../../landingPage/assets/2.png';
import three from '../../landingPage/assets/3.png';
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
  const [topEmissionsData, setTopEmissionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let fetchedOvData = [];

        if (reports.length === 1) {
          const report = reports[0];
          const { _id, companyName, fuel, bioenergy, refrigerants, ownedVehicles } = report;

          const requests = [];

          if (fuel && Object.keys(fuel).length > 0) {
            requests.push(axios.post(`/api/reports/CO2eFuel`, { _id, companyName, fuel }));
          }

          if (bioenergy && Object.keys(bioenergy).length > 0) {
            requests.push(axios.post(`/api/reports/CO2eBioenergy`, { _id, companyName, bioenergy }));
          }

          if (refrigerants && Object.keys(refrigerants).length > 0) {
            requests.push(axios.post(`/api/reports/CO2eRefrigerants`, { _id, companyName, refrigerants }));
          }

          if (ownedVehicles && Object.keys(ownedVehicles).length > 0) {
            requests.push(axios.post(`/api/reports/CO2eOv`, { _id, companyName, ownedVehicles }));
          }

          const responses = await Promise.all(requests);

          let responseIndex = 0;
          if (fuel && Object.keys(fuel).length > 0) setFuelData(responses[responseIndex++].data.data);
          if (bioenergy && Object.keys(bioenergy).length > 0) setBioenergyData(responses[responseIndex++].data.data);
          if (refrigerants && Object.keys(refrigerants).length > 0) setRefrigerantsData(responses[responseIndex++].data.data);
          if (ownedVehicles && Object.keys(ownedVehicles).length > 0) fetchedOvData = responses[responseIndex++].data.data;

          setOvData(fetchedOvData);
        } else {
          const combinedFuel = [];
          const combinedOwnedVehicles = [];
          const combinedBioenergy = [];
          const combinedRefrigerants = [];

          await Promise.all(
            reports.map(async (report) => {
              const { _id, companyName, fuel, bioenergy, refrigerants, ownedVehicles } = report;
              const requests = [];

              if (fuel && Object.keys(fuel).length > 0) {
                requests.push(axios.post(`/api/reports/CO2eFuel`, { _id, companyName, fuel }));
              }

              if (bioenergy && Object.keys(bioenergy).length > 0) {
                requests.push(axios.post(`/api/reports/CO2eBioenergy`, { _id, companyName, bioenergy }));
              }

              if (refrigerants && Object.keys(refrigerants).length > 0) {
                requests.push(axios.post(`/api/reports/CO2eRefrigerants`, { _id, companyName, refrigerants }));
              }

              if (ownedVehicles && Object.keys(ownedVehicles).length > 0) {
                requests.push(axios.post(`/api/reports/CO2eOv`, { _id, companyName, ownedVehicles }));
              }

              const responses = await Promise.all(requests);

              let responseIndex = 0;
              if (fuel && Object.keys(fuel).length > 0) combinedFuel.push(...responses[responseIndex++].data.data);
              if (bioenergy && Object.keys(bioenergy).length > 0) combinedBioenergy.push(...responses[responseIndex++].data.data);
              if (refrigerants && Object.keys(refrigerants).length > 0) combinedRefrigerants.push(...responses[responseIndex++].data.data);
              if (ownedVehicles && Object.keys(ownedVehicles).length > 0) combinedOwnedVehicles.push(...responses[responseIndex++].data.data);
            })
          );

          setOvData(combinedOwnedVehicles);
          setFuelData(combinedFuel);
          setBioenergyData(combinedBioenergy);
          setRefrigerantsData(combinedRefrigerants);
        }

        if (fetchedOvData.length > 0) {
          // Process the data to get top emissions by vehicle size from ownedVehicles
          const vehicleEmissions = fetchedOvData.reduce((acc, vehicle) => {
            const { level2: vehicleSize, CO2e, fuel } = vehicle;
            if (!acc[vehicleSize]) {
              acc[vehicleSize] = { vehicleSize, totalEmissions: 0, fuel };
            }
            acc[vehicleSize].totalEmissions += CO2e;
            return acc;
          }, {});

          // Convert object to array and sort by total emissions
          const sortedEmissions = Object.values(vehicleEmissions).sort(
            (a, b) => b.totalEmissions - a.totalEmissions
          );

          setTopEmissionsData(sortedEmissions);

          // Filter passenger and delivery vehicles from `ovData`
          const passengerVehicles = fetchedOvData.filter(
            (vehicle) => vehicle.level1 === "Passenger vehicles"
          );
          const deliveryVehicles = fetchedOvData.filter(
            (vehicle) => vehicle.level1 === "Delivery vehicles"
          );
          setPassengerData(passengerVehicles);
          setDeliveryData(deliveryVehicles);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Set loading to false after data fetching
      }
    };

    fetchData();
  }, [reports]);

  const barColors = ["#FBAF58", "#2E4F50", "#A6D39F", "#DDDCBD", "#51DAD9", "#2D92D5"];
  const pieColors = ["#39C9EF", "#86EAE9", "#5DBDD3", "#4591B8", "#3B6696", "#353C6E", "#705788", "#A5769E", "#2D2F36", "#D88AAC", "#F490A2", "#F79A86"];

  // Filter for Gaseous and Solid Fuels
  const gaseousAndSolidFuels = fuelData.filter((item) => item.type === "Gaseous fuels" || item.type === "Solid fuels");

  const fuelChartData = {
    labels: gaseousAndSolidFuels.map((item) => item.fuelType),
    datasets: [
      {
        label: "CO2e Emissions",
        data: gaseousAndSolidFuels.map((item) => item.CO2e),
        backgroundColor: ["#004d61", "#ff6e54", "#00a6a6", "#2f4b7c"],
        borderColor: ["#004d61", "#ff6e54", "#00a6a6", "#2f4b7c"],
        borderWidth: 1,
      },
    ],
  };

  const liquidFuels = fuelData.filter((item) => item.type === "Liquid fuels");

  const liquidFuelChartData = {
    labels: liquidFuels.map((item) => item.fuelType),
    datasets: [
      {
        label: "CO2e Emissions",
        data: liquidFuels.map((item) => item.CO2e),
        backgroundColor: ["#5b2c6f", "#2874a6", "#239b56"],
        borderColor: ["#5b2c6f", "#2874a6", "#239b56"],
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
    bodyFont: { size: 15 },
    titleFont: { size: 15 },
    padding: 16,
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        ticks: { display: false },
        grid: { display: true },
        angleLines: { display: false },
        suggestedMin: 0,
        suggestedMax: Math.max(...passengerData.map((item) => item.CO2e), ...deliveryData.map((item) => item.CO2e)),
      },
    },
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: "Emissions from Owned Vehicles",
        font: { size: 22 },
      },
      tooltip: tooltipOptions,
    },
  };

  const passengerFuelTypes = ["Plug-in Hybrid Electric Vehicle", "Battery Electric Vehicle", "Petrol", "Diesel", "LPG"];
const passengerChartData = {
  labels: passengerFuelTypes,
  datasets: [
    {
      label: "Passenger Vehicles",
      data: passengerFuelTypes.map((fuelType) => {
        const vehicle = passengerData.find((item) => item.fuel === fuelType);
        return vehicle ? vehicle.CO2e : 0; // If a vehicle with that fuel type exists, return CO2e, otherwise return 0
      }),
      backgroundColor: pieColors.slice(0, 5),
      borderColor: "#2F4F4F",
      borderWidth: 1,
    },
  ],
};

const deliveryFuelTypes = ["Petrol", "Diesel", "Battery Electric Vehicle", "CNG"];
const deliveryChartData = {
  labels: deliveryFuelTypes,
  datasets: [
    {
      label: "Delivery Vehicles",
      data: deliveryFuelTypes.map((fuelType) => {
        const vehicle = deliveryData.find((item) => item.fuel === fuelType);
        return vehicle ? vehicle.CO2e : 0; // If a vehicle with that fuel type exists, return CO2e, otherwise return 0
      }),
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
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: "Fuels (Gaseous & Solid Fuels)",
        font: { size: 22 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} kg CO2e`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Fuel Type" },
      },
      x: {
        title: { display: true, text: "CO2e Emissions (kg)" },
      },
    },
  };

  const liquidFuelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: "Fuels (Liquid Fuels)",
        font: { size: 22 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} kg CO2e`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Fuel Type" },
      },
      x: {
        title: { display: true, text: "CO2e Emissions (kg)" },
      },
    },
  };

  const bioenergyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Bioenergy Emissions",
        font: { size: 22 },
      },
      tooltip: tooltipOptions,
    },
  };

  const refrigerantsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Refrigerants Emissions",
        font: { size: 22 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: {
        display: false,
      },
    },
  };

  // If loading or error, display appropriate message
  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">
        Scope 1: Direct emissions arising from owned or controlled stationary
        sources that use fossil fuels and/or emit fugitive emissions
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 h-[300px]">
          <div
            className="relative w-1/3 p-1 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <FaLightbulb
              className="absolute top-2 right-2 text-yellow-500"
              size={32}
            />
            <Pie
              data={bioenergyChartData}
              options={{
                ...bioenergyOptions,
                plugins: {
                  ...bioenergyOptions.plugins,
                  legend: { display: true, position: "bottom" },
                },
                maintainAspectRatio: false,
              }}
              height="100%"
            />
          </div>
          <div
            className="relative w-2/3 p-1 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <FaQuestionCircle
              className="absolute top-2 right-2 text-pink-500"
              size={32}
            />
            <Bar
              data={refrigerantsChartData}
              options={{
                ...refrigerantsOptions,
                plugins: {
                  ...refrigerantsOptions.plugins,
                  legend: { display: true },
                },
                maintainAspectRatio: false,
              }}
              height="100%"
            />
          </div>
        </div>

        <div className="flex gap-4 h-[400px]">
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Radar
              data={passengerChartData}
              options={{
                ...radarOptions,
                plugins: {
                  ...radarOptions.plugins,
                  legend: { display: true, position: "bottom" },
                },
                maintainAspectRatio: false,
              }}
              height="100%"
            />
          </div>
          <div className="w-1/3 flex flex-col gap-4">
            <div
              className="h-1/2 p-4 rounded-lg border border-gray-900 shadow-lg"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <h3 className="text-gray-600 font-bold pb-4 text-lg text-center">
                Top Emissions by Vehicle Type
              </h3>
              <ul className="divide-y divide-gray-200">
                {topEmissionsData.map((item, index) => (
                  <li key={index} className="px-4 py-1 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {item.vehicleSize.toLowerCase().includes("car") &&
                            "🚗"}
                          {item.vehicleSize
                            .toLowerCase()
                            .includes("motorbike") && "🏍️"}
                          {item.vehicleSize.toLowerCase().includes("van") &&
                            "🚐"}
                        </span>
                        <div className="flex flex-col sm:flex-row items-center">
                          <p className="text-sm font-medium text-gray-900 mr-2">
                            {item.vehicleSize}
                          </p>
                          <p className="text-sm text-gray-500">({item.fuel})</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.totalEmissions.toFixed(2)} kg
                        <span
                          className={`ml-1 ${
                            index === 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {index === 0 ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="h-3/4 p-4 rounded-lg border border-gray-900 shadow-lg"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <h3 className="text-gray-600 font-bold pb-4 text-sm text-center">
                What does the point on the radar chart mean?
              </h3>
              <h4 className="text-gray-600 text-sm line-clamp-3">
                Each point represents a variable's value, showing strengths and
                weaknesses across multiple variables visually.
              </h4>
            </div>
          </div>

          <div
            className="w-1/3 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Radar
              data={deliveryChartData}
              options={{
                ...radarOptions,
                plugins: {
                  ...radarOptions.plugins,
                  legend: { display: true, position: "bottom" },
                },
                maintainAspectRatio: false,
              }}
              height="100%"
            />
          </div>
        </div>

        <div className="flex gap-4 h-[300px]">
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar data={fuelChartData} options={fuelOptions} />
          </div>
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar data={liquidFuelChartData} options={liquidFuelOptions} />
          </div>
          <div className="w-1/3 flex flex-row gap-4">
            <div
              className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <h3 className="text-gray-700 font-semibold pb-4 text-sm">
                Learn more about Scope 1 Emissions
              </h3>
              <div
                className="relative"
                style={{
                  width: "%",
                  height: "0",
                  paddingBottom: "177.78%",
                  overflow: "hidden",
                }}
              >
                <iframe
                  src="https://www.youtube.com/embed/aXYqeRaRFS8?si=gkJIrfq8cWWYRtXu"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Learn more about Scope 1 Emissions"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "70%",
                  }}
                ></iframe>
              </div>
            </div>
            <div
              className="w-1/2 p-2 flex flex-col rounded-lg border border-gray-900 shadow-lg"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <h3 className="text-gray-700 font-semibold pb-6 text-xs">
                Notifications
              </h3>
              <div
                className="flex flex-row cursor-pointer"
                onClick={() => (window.location.href = "/datainboard")}
              >
                <img src={one} alt="add" style={{ height: 30, width: 30 }} />
                <div className="flex flex-col pl-1">
                  <div className="font-medium text-xs">Data-in-Board</div>
                  <div className="text-xs">Add 32 missing parameters</div>
                </div>
              </div>
              <div
                className="flex flex-row pt-3 cursor-pointer"
                onClick={() => (window.location.href = "/ocr")}
              >
                <img src={two} alt="ocr" style={{ height: 30, width: 30 }} />
                <div className="flex flex-col pl-1">
                  <div className="font-medium text-xs">Automated Filling</div>
                  <div className="text-xs">Upload your missing bills</div>
                </div>
              </div>
              <div
                className="flex flex-row pt-3 cursor-pointer"
                onClick={() => (window.location.href = "/report")}
              >
                <img
                  src={three}
                  alt="report"
                  style={{ height: 30, width: 30 }}
                />
                <div className="flex flex-col pl-1">
                  <div className="font-medium text-xs">Report</div>
                  <div className="text-xs">View your Monthly Report</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope1;
