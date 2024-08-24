import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLightbulb } from 'react-icons/fa';
import { FaQuestionCircle } from 'react-icons/fa';
import { Bar, Pie, Radar } from "react-chartjs-2";
import one from '../../landingPage/assets/1.png'
import two from '../../landingPage/assets/2.png'
import three from '../../landingPage/assets/3.png'
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
  const [btlsData, setBtlsData] = useState([]);

  const reportData = reports;
  const {
    companyName = "",
    facilityName = "",
    fuel = [],
    ownedVehicles = [],
    reportId = "",
    bioenergy = [],
    refrigerants = [],
  } = reportData || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          fuelResponse,
          bioenergyResponse,
          refrigerantsResponse,
          ovResponse,
          btlsResponse,
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
          // axios.get(`/api/reports/${reportId}/CO2eBtls`, {
          //   params: {
          //     companyName,
          //     facilityName,
          //     reportId,
          //   },
          // }),
        ]);

        setOvData(ovResponse.data.data);
        setFuelData(fuelResponse.data.data);
        setBioenergyData(bioenergyResponse.data.data);
        setRefrigerantsData(refrigerantsResponse.data.data);
        // setBtlsData(btlsResponse.data.data);
        console.log("Ov: ", ovResponse.data.data);
        

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
  }, [
    reportId,
    companyName,
    facilityName,
    fuel,
    bioenergy,
    refrigerants,
    ownedVehicles,
  ]);

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
      size: 15,
    },
    titleFont: {
      size: 15,
    },
    padding: 16,
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        ticks: {
          display: false, // This hides the scale values
        },
        grid: {
          display: true, // This keeps the grid lines visible
        },
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: Math.max(
          ...passengerData.map((item) => item.CO2e),
          ...deliveryData.map((item) => item.CO2e)
        ), // Dynamic scale based on data
      },
    },
    plugins: {
      legend: { display: true }, // Display legend
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
       data: passengerData.map((item) => {
         if (item.level1 === "Passenger vehicles") {
           switch (item.fuel) {
             case "Plug-in Hybrid Electric Vehicle":
               return item.CO2e;
             case "Battery Electric Vehicle":
               return item.CO2e;
             case "Petrol":
               return item.CO2e;
             case "Diesel":
               return item.CO2e;
             case "LPG":
               return item.CO2e;
             default:
               return 0;
           }
         }
         return 0;
       }),
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
       data: deliveryData.map((item) => {
         if (item.level1 === "Delivery vehicles") {
           switch (item.fuel) {
             case "Petrol":
               return item.CO2e;
             case "Diesel":
               return item.CO2e;
             case "Battery Electric Vehicle":
               return item.CO2e;
             case "CNG":
               return item.CO2e;
             default:
               return 0;
           }
         }
         return 0;
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
      legend: { display: false },
      title: {
        display: true,
        text: "Fuel Emissions",
        font: { size: 22 },
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
        display: false, // Remove types of gases from x-axis
      },
    },
  };

  const [topEmissions, setTopEmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopEmissions = async () => {
      try {
        setLoading(true);

        // Fetch BTLS data and sort top emissions
        const sortedEmissions = btlsData
          .sort((a, b) => b.CO2e - a.CO2e)
          .slice(0, 4)
          .map(item => ({
            vehicleType: item.type,
            fuelType: item.fuel,
            co2eValue: item.CO2e
          }));
        
        setTopEmissions(sortedEmissions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopEmissions();
  }, [btlsData]); 

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
            {/* Bulb Icon */}
            <FaLightbulb
              className="absolute top-2 right-2 text-yellow-500"
              size={32}
            />

            {/* Pie Chart */}
            <Pie
              data={bioenergyChartData}
              options={{
                ...bioenergyOptions,
                plugins: { ...bioenergyOptions.plugins, legend: { display: true, position: 'bottom' } },
                maintainAspectRatio: false
              }}
              height="100%"
            />
          </div>
          <div
              className="relative w-2/3 p-1 rounded-lg border border-gray-900 shadow-lg"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              {/* Question Mark Icon */}
              <FaQuestionCircle
                className="absolute top-2 right-2 text-pink-500"
                size={32}
              />

              {/* Bar Chart */}
              <Bar
                data={refrigerantsChartData}
                options={{
                  ...refrigerantsOptions,
                  plugins: { ...refrigerantsOptions.plugins, legend: { display: true } },
                  maintainAspectRatio: false
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
                plugins: { ...radarOptions.plugins, legend: { display: true, position: 'bottom' } },
                maintainAspectRatio: false
              }}
              height="100%"
            />
          </div>
          <div className="w-1/3 flex flex-col gap-4">
            <div className=" h-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
            >
              <ul className="divide-y divide-gray-200">
              {topEmissions.map((item, index) => (
                <li key={index} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {item.vehicle.toLowerCase().includes("car") && "🚗"}
                        {item.vehicle.toLowerCase().includes("motorbike") && "🏍️"}
                        {item.vehicle.toLowerCase().includes("van") && "🚐"}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.type}</p>
                        <p className="text-sm text-gray-500">{item.fuel}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.CO2e.toFixed(2)} kg
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
            <div className="h-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
            >
              <h3 className="text-gray-700 font-semibold pb-4 text-sm text-center">What does the point on the radar chart mean?</h3>

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
                plugins: { ...radarOptions.plugins, legend: { display: true, position: 'bottom' } },
                maintainAspectRatio: false
              }}
              height="100%"
            />
          </div>
        </div>
        <div className="flex gap-4 h-[300px]">
          <div className="w-1/3 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >

          </div>
          <div className="w-1/3 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >

          </div>
          <div className="w-1/3 flex flex-row gap-4">
            <div className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
            >
              <h3 className="text-gray-700 font-semibold pb-4 text-sm">Learn more about Scope 1 Emissions</h3>

            </div>
            <div className="w-1/2 p-2 flex flex-col rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
            >
              <h3 className="text-gray-700 font-semibold pb-6 text-sm">Notifications</h3>
              <div className="flex flex-row cursor-pointer " onClick={() => window.location.href = "/datainboard"}>
                <img src={one} alt="add" style={{height: 30, width: 30}}/>
                <div className="flex flex-col pl-1">
                  <div className="font-medium text-sm">Data-in-Board</div>
                  <div className="text-sm">Add 32 missing parameters </div>
                </div>
              </div>
              <div className="flex flex-row pt-3 cursor-pointer" onClick={() => window.location.href = "/ocr"}>
                <img src={two} alt="ocr" style={{height: 30, width: 30}}/>
                <div className="flex flex-col pl-1">
                  <div className="font-medium text-sm">Automated Filling</div>
                  <div className="text-sm">Upload your missing bills </div>
                </div>
              </div>
              <div className="flex flex-row pt-3 cursor-pointer" onClick={() => window.location.href = "/report"}>
                <img src={three} alt="report" style={{height: 30, width: 30}}/>
                <div className="flex flex-col pl-1">
                  <div className="font-medium text-sm">Report</div>
                  <div className="text-sm">View your Monthly Report</div>
                </div>
              </div>

            </div>
          </div>          
        </div>
      </div>
    </div>
  );
}  

export default Scope1;
