import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Bubble, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Scope3 = ({ reports }) => {
  const [ecData, setEcData] = useState([]);
  const [btlsData, setBtlsData] = useState([]);
  const [fgData, setFgData] = useState([]);
  const [wttFuelData, setWttFuelData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [wasteData, setWasteData] = useState([]);
  const [waterData, setWaterData] = useState([]);
  const [homeOfficeData, setHomeOfficeData] = useState([]);
  const [hotelAccommodationData, setHotelAccommodationData] = useState([]);

  const reportData = reports[0];
  const {
    companyName,
    facilityName,
    reportId,
    ec,
    btls,
    fg,
    wttfuel,
    food,
    material,
    waste,
    water,
    fa,
    homeOffice,
  } = reportData;
  // const { hotelAccommodation } = fa;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          ecResponse,
          btlsResponse,
          fgResponse,
          wttFuelResponse,
          foodResponse,
          materialResponse,
          wasteResponse,
          waterResponse,
          hotelAccommodationResponse,
          homeOfficeResponse,
        ] = await Promise.all([
          axios.get(`/api/reports/${reportId}/CO2eEc`, {
            params: {
              companyName,
              facilityName,
              reportId,
              ec: JSON.stringify(ec),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eBtls`, {
            params: {
              companyName,
              facilityName,
              reportId,
              btls: JSON.stringify(btls),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eFg`, {
            params: {
              companyName,
              facilityName,
              reportId,
              fg: JSON.stringify(fg),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eWTTFuel`, {
            params: {
              companyName,
              facilityName,
              reportId,
              wttfuel: JSON.stringify(wttfuel),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eFood`, {
            params: {
              companyName,
              facilityName,
              reportId,
              food: JSON.stringify(food),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eMaterialsUsed`, {
            params: {
              companyName,
              facilityName,
              reportId,
              material: JSON.stringify(material),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eWasteDisposal`, {
            params: {
              companyName,
              facilityName,
              reportId,
              waste: JSON.stringify(waste),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eWater`, {
            params: {
              companyName,
              facilityName,
              reportId,
              water: JSON.stringify(water),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eFlightsAccomodations`, {
            params: {
              companyName,
              facilityName,
              reportId,
              hotelAccommodation: JSON.stringify(hotelAccommodation),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eHome`, {
            params: {
              companyName,
              facilityName,
              reportId,
              homeOffice: JSON.stringify(homeOffice),
            },
          }),
        ]);

        setEcData(ecResponse.data.data);
        setBtlsData(btlsResponse.data.data);
        setFgData(fgResponse.data.data);
        setWttFuelData(wttFuelResponse.data.data);
        setFoodData(foodResponse.data.data);
        setMaterialData(materialResponse.data.data);
        setWasteData(wasteResponse.data.data);
        setWaterData(waterResponse.data.data);
        setHomeOfficeData(homeOfficeResponse.data.data);
        setHotelAccommodationData(hotelAccommodationResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    reportId,
    companyName,
    facilityName,
    ec,
    btls,
    fg,
    wttfuel,
    food,
    material,
    waste,
    water,
    // hotelAccommodation,
    homeOffice,
  ]);

  const chartHeight = 450;

  const tooltipOptions = {
    bodyFont: {
      size: 24, // Increase font size by 4x
    },
    titleFont: {
      size: 24, // Increase font size by 4x
    },
    padding: 16, // Increase padding for better visibility
  };

  const baseColor = "rgba(47, 79, 79, 1)"; // #2F4F4F with 60% opacity
  const baseBorderColor = "rgba(47, 79, 79, 1)"; // Solid #2F4F4F

  // Chart data for hotelAccommodation
  // const hotelAccommodationChartData = {
  //   labels: hotelAccommodationData.map((item) => item.index),
  //   datasets: [
  //     {
  //       label: "CO2e Emissions",
  //       data: hotelAccommodationData.map((item) => item.CO2e),
  //       backgroundColor: [
  //         baseColor,
  //         "rgba(75, 107, 107, 0.6)",
  //         "rgba(103, 135, 135, 0.6)",
  //         "rgba(131, 163, 163, 0.6)",
  //         "rgba(159, 191, 191, 0.6)",
  //       ],
  //       borderColor: [
  //         baseBorderColor,
  //         "rgba(75, 107, 107, 1)",
  //         "rgba(103, 135, 135, 1)",
  //         "rgba(131, 163, 163, 1)",
  //         "rgba(159, 191, 191, 1)",
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const hotelAccommodationOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { position: "top" },
  //     title: {
  //       display: true,
  //       text: "Emissions from Hotel Accommodation",
  //       font: {
  //         size: 25, // Increase title font size by 5x
  //       },
  //     },
  //     tooltip: tooltipOptions,
  //   },
  // };
  // Hotel Accommodation data
  const hotelAccommodationDataC = {
    labels: ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"],
    datasets: [
      {
        data: [300, 500, 800, 1200, 1500],
        backgroundColor: [
          "rgba(0, 63, 92, 0.8)",
          "rgba(88, 80, 141, 0.8)",
          "rgba(188, 80, 144, 0.8)",
          "rgba(255, 99, 97, 0.8)",
          "rgba(255, 166, 0, 0.8)",
        ],
      },
    ],
  };

  const hotelAccommodationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Hotel Accommodation Emissions",
        font: { size: 25 },
      },
    },
    cutout: "50%",
  };

  // const homeOfficeChartData = {
  //   datasets: homeOfficeData.map((item, index) => ({
  //     label: item.type,
  //     data: [
  //       {
  //         x: index,
  //         y: item.CO2e,
  //         r: item.numberOfEmployees,
  //       },
  //     ],
  //     backgroundColor:
  //       index % 2 === 0 ? "rgba(47, 79, 79, 1)" : "rgba(75, 107, 107, 0.6)", // Lighter tone
  //     borderColor:
  //       index % 2 === 0
  //         ? "rgba(47, 79, 79, 1)" // Solid #2F4F4F
  //         : "rgba(75, 107, 107, 1)", // Lighter tone
  //   })),
  // };

  // const homeOfficeOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { position: "top" },
  //     title: {
  //       display: true,
  //       text: "Emissions from Home Office",
  //       font: {
  //         size: 25, // Increase title font size by 5x
  //       },
  //     },
  //     tooltip: tooltipOptions,
  //   },
  //   scales: {
  //     x: {
  //       title: {
  //         display: true,
  //         text: "Index",
  //       },
  //     },
  //     y: {
  //       title: {
  //         display: true,
  //         text: "CO2e Emissions",
  //       },
  //     },
  //   },
  // };

  // Home Office data

  // Update Home Office data for bubble chart
  const homeOfficeDataC = {
    datasets: [
      {
        label: "Heating",
        data: [{ x: 20, y: 30, r: 15 }],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Cooling",
        data: [{ x: 40, y: 10, r: 10 }],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "No Heating/Cooling",
        data: [{ x: 30, y: 20, r: 20 }],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const homeOfficeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Home Office Emissions",
        font: { size: 25 },
      },
    },
    scales: {
      x: { title: { display: true, text: "Energy Consumption" } },
      y: { title: { display: true, text: "CO2e Emissions" } },
    },
  };

  // Chart data for ec
  // const ecChartData = {
  //   labels: ecData.map((item) => item.type),
  //   datasets: [
  //     {
  //       label: "CO2e Emissions",
  //       data: ecData.map((item) => item.CO2e),
  //       backgroundColor: baseColor,
  //       borderColor: baseBorderColor,
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const ecOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { position: "top" },
  //     title: {
  //       display: true,
  //       text: "Emissions from Employee Commuting",
  //       font: {
  //         size: 25, // Increase title font size by 5x
  //       },
  //     },
  //     tooltip: tooltipOptions,
  //   },
  // };

  // Freighting goods data (keep as is)
  // ...

  // Employee commuting data for cars
  const carCommutingData = {
    labels: ["Small", "Average", "Medium", "Large"],
    datasets: [
      {
        label: "Petrol",
        data: [120, 150, 180, 220],
        backgroundColor: "rgba(255, 0, 0, 0.7)",
      },
      {
        label: "Diesel",
        data: [110, 140, 170, 210],
        backgroundColor: "rgba(255, 127, 0, 0.7)",
      },
      {
        label: "Hybrid",
        data: [90, 120, 150, 190],
        backgroundColor: "rgba(255, 255, 0, 0.7)",
      },
      {
        label: "Electric",
        data: [70, 100, 130, 170],
        backgroundColor: "rgba(0, 255, 0, 0.7)",
      },
      {
        label: "LPG",
        data: [100, 130, 160, 200],
        backgroundColor: "rgba(0, 0, 255, 0.7)",
      },
      {
        label: "CNG",
        data: [95, 125, 155, 195],
        backgroundColor: "rgba(75, 0, 130, 0.7)",
      },
      {
        label: "Ethanol",
        data: [105, 135, 165, 205],
        backgroundColor: "rgba(143, 0, 255, 0.7)",
      },
    ],
  };

  // Employee commuting data for public transport
  const publicTransportData = {
    labels: ["Bus", "Rental Car", "Taxi", "Train"],
    datasets: [
      {
        label: "Diesel",
        data: [80, 140, 130, 60],
        backgroundColor: "rgba(255, 0, 0, 0.7)",
      },
      {
        label: "CNG",
        data: [70, 130, 120, 55],
        backgroundColor: "rgba(255, 127, 0, 0.7)",
      },
      {
        label: "Electric",
        data: [50, 100, 90, 40],
        backgroundColor: "rgba(255, 255, 0, 0.7)",
      },
      {
        label: "Hybrid",
        data: [60, 120, 110, 50],
        backgroundColor: "rgba(0, 255, 0, 0.7)",
      },
      {
        label: "Biodiesel",
        data: [75, 135, 125, 58],
        backgroundColor: "rgba(0, 0, 255, 0.7)",
      },
      {
        label: "Hydrogen",
        data: [55, 110, 100, 45],
        backgroundColor: "rgba(75, 0, 130, 0.7)",
      },
      {
        label: "LPG",
        data: [72, 132, 122, 56],
        backgroundColor: "rgba(143, 0, 255, 0.7)",
      },
    ],
  };

  const commutingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      title: {
        display: true,
        text: "Employee Commuting Emissions",
        font: {
          size: 25,
        },
      },
      tooltip: {
        ...tooltipOptions,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + " CO2e";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Vehicle Type",
        },
      },
      y: {
        title: {
          display: true,
          text: "CO2e Emissions",
        },
      },
    },
  };

  // Chart data for btls
  // const btlsChartData = {
  //   labels: btlsData.map((item) => item.vehicle),
  //   datasets: [
  //     {
  //       label: "CO2e Emissions",
  //       data: btlsData.map((item) => item.CO2e),
  //       backgroundColor: baseColor,
  //       borderColor: baseBorderColor,
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const btlsOptions = {
  //   indexAxis: "y",
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { position: "top" },
  //     title: {
  //       display: true,
  //       text: "Emissions from Business Travel and Lodging",
  //       font: {
  //         size: 25, // Increase title font size by 5x
  //       },
  //     },
  //     tooltip: tooltipOptions,
  //   },
  // };

  // Business Travel data
  const businessTravelData = {
    labels: ["Taxi", "Rail", "Motorbike", "Ferry", "Car (average)", "Buses"],
    datasets: [
      {
        label: "Plug-in Hybrid Electric Vehicle",
        data: [10, 0, 0, 5, 15, 0],
        backgroundColor: "#FF6384",
      },
      {
        label: "Battery Electric Vehicle",
        data: [5, 20, 0, 0, 10, 15],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Diesel",
        data: [20, 15, 5, 25, 30, 40],
        backgroundColor: "#FFCE56",
      },
      {
        label: "Petrol",
        data: [25, 0, 15, 0, 35, 10],
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Hybrid",
        data: [15, 0, 0, 0, 20, 5],
        backgroundColor: "#9966FF",
      },
      {
        label: "Unknown",
        data: [5, 5, 0, 10, 5, 5],
        backgroundColor: "#FF9F40",
      },
      {
        label: "CNG",
        data: [0, 0, 0, 0, 5, 10],
        backgroundColor: "#C9CBCF",
      },
      {
        label: "LPG",
        data: [0, 0, 0, 0, 5, 5],
        backgroundColor: "#7FDBFF",
      },
    ],
  };

  const businessTravelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" },
      title: {
        display: true,
        text: "Business Travel Emissions",
        font: { size: 25 },
      },
    },
    scales: {
      x: { stacked: true, title: { display: true, text: "CO2e Emissions" } },
      y: { stacked: true },
    },
  };

  const barColors = [
    "#FBAF58",
    "#2E4F50",
    "#A6D39F",
    "#DDDCBD",
    "#51DAD9",
    "#2D92D5",
  ];

  // Categories for fg chart
  // const fgCategories = [
  //   "Vans",
  //   "HGV (all diesel)",
  //   "HGV refrigerated (all diesel)",
  //   "Freight flights",
  //   "Rail",
  //   "Sea tanker",
  //   "Cargo ship",
  // ];

  // Aggregated CO2e data for fg categories
  // const fgCO2eData = fgCategories.map((category) => {
  //   const categoryData = fgData.filter((item) => item.category === category);
  //   const totalCO2e = categoryData.reduce(
  //     (sum, item) => sum + (item.CO2e || 0),
  //     0
  //   );
  //   return totalCO2e;
  // });

  // // Chart data for fg
  // const fgChartData = {
  //   labels: fgCategories,
  //   datasets: [
  //     {
  //       label: "CO2e Emissions",
  //       data: fgCO2eData,
  //       backgroundColor: baseColor,
  //       borderColor: baseBorderColor,
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const fgOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { position: "top" },
  //     title: {
  //       display: true,
  //       text: "Emissions from Freighting Goods",
  //       font: {
  //         size: 25, // Increase title font size by 5x
  //       },
  //     },
  //     tooltip: tooltipOptions,
  //   },
  // };

  // Common data for all vehicle types
  const distances = [100, 200, 300, 400, 500]; // Distance in km

  // Function to generate random data
  const generateData = (base) =>
    distances.map((d) => (base * d) / 100 + Math.random() * 20);

  // Freighting goods data for vans, trucks, and ships
  const freightingGoodsData = [
    {
      title: "Vans",
      data: {
        labels: distances,
        datasets: [
          {
            label: "Petrol",
            data: generateData(50),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
          {
            label: "Diesel",
            data: generateData(45),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
          {
            label: "Electric",
            data: generateData(30),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
          {
            label: "Hybrid",
            data: generateData(40),
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
          },
        ],
      },
    },
    {
      title: "Trucks",
      data: {
        labels: distances,
        datasets: [
          {
            label: "Petrol",
            data: generateData(100),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
          {
            label: "Diesel",
            data: generateData(90),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
          {
            label: "Electric",
            data: generateData(70),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
          {
            label: "Hybrid",
            data: generateData(80),
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
          },
        ],
      },
    },
    {
      title: "Ships",
      data: {
        labels: distances,
        datasets: [
          {
            label: "Heavy Fuel Oil",
            data: generateData(200),
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
          {
            label: "Marine Diesel Oil",
            data: generateData(180),
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
          {
            label: "Liquefied Natural Gas",
            data: generateData(150),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
          {
            label: "Biofuel",
            data: generateData(170),
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
          },
        ],
      },
    },
  ];

  const freightingGoodsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from Freighting Goods",
        font: {
          size: 25,
        },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Distance (km)",
        },
      },
      y: {
        title: {
          display: true,
          text: "CO2e Emissions",
        },
      },
    },
  };

  // Update WTT Fuel chart data to use new colors
  const wttFuelChartData = {
    labels: wttFuelData.map((item) => item.fuel),
    datasets: [
      {
        label: "CO2e Emissions",
        data: wttFuelData.map((item) => item.CO2e),
        backgroundColor: barColors,
        borderColor: barColors,
        borderWidth: 1,
      },
    ],
  };

  const wttFuelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from WTT Fuel",
        font: {
          size: 25, // Increase title font size by 5x
        },
      },
      tooltip: tooltipOptions,
    },
  };

  // const combinedLabels = [
  //   ...foodData.map((item) => item.unit),
  //   ...waterData.map((item) => item.emission),
  // ];
  // const combinedData = [
  //   ...foodData.map((item) => item.CO2e),
  //   ...waterData.map((item) => item.CO2e),
  // ];

  // // Chart data for combined food and water
  // const combinedChartData = {
  //   labels: combinedLabels,
  //   datasets: [
  //     {
  //       label: "CO2e Emissions",
  //       data: combinedData,
  //       backgroundColor: [
  //         ...foodData.map(() => baseColor),
  //         ...waterData.map(() => "rgba(75, 107, 107, 0.6)"),
  //       ],
  //       borderColor: [
  //         ...foodData.map(() => baseBorderColor),
  //         ...waterData.map(() => "rgba(75, 107, 107, 1)"),
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const combinedOptions = {
  //   indexAxis: "y",
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { position: "top" },
  //     title: {
  //       display: true,
  //       text: "Emissions from Food and Water",
  //       font: {
  //         size: 25, // Increase title font size by 5x
  //       },
  //     },
  //     tooltip: tooltipOptions,
  //   },
  // };

  // Combined chart data
  const combinedChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Food",
        data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 60, 70, 75],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fill: true,
      },
      {
        label: "Water",
        data: [28, 48, 40, 19, 86, 27, 90, 85, 80, 75, 70, 65],
        borderColor: "yellow",
        backgroundColor: "rgba(255, 255, 0, 0.2)",
        fill: true,
      },
    ],
  };

  const combinedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Combined Food and Water Emissions",
        font: { size: 25 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "CO2e Emissions" },
      },
    },
  };

  // Chart data for material and waste
  const materialWasteChartData = {
    labels: [
      ...new Set([
        ...materialData.map((item) => item.type),
        ...wasteData.map((item) => item.type),
      ]),
    ],
    datasets: [
      {
        label: "Material CO2e Emissions",
        data: materialData.map((item) => item.CO2e),
        backgroundColor: baseColor,
        borderColor: baseBorderColor,
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Waste CO2e Emissions",
        data: wasteData.map((item) => item.CO2e),
        backgroundColor: "rgba(75, 107, 107, 0.6)", // Lighter tone for differentiation
        borderColor: "rgba(75, 107, 107, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const materialWasteOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from Material and Waste",
        font: {
          size: 25, // Increase title font size by 5x
        },
      },
      tooltip: tooltipOptions,
    },
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-2 pt-8">
        Scope 3: Indirect emissions from employee commuting, business travel and
        lodging, freighting goods, and other categories
      </h1>

      <div className="flex flex-col gap-4">
        <div className="w-full h-[450px] flex gap-4">
          {freightingGoodsData.map((vehicle, index) => (
            <div
              key={index}
              className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
              style={{ backgroundColor: "#DDDCBD" }}
            >
              <Line
                data={vehicle.data}
                options={{
                  ...freightingGoodsOptions,
                  plugins: {
                    ...freightingGoodsOptions.plugins,
                    title: {
                      ...freightingGoodsOptions.plugins.title,
                      text: `Emissions from ${vehicle.title}`,
                    },
                  },
                }}
                height={chartHeight}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={carCommutingData}
              options={{
                ...commutingOptions,
                plugins: {
                  ...commutingOptions.plugins,
                  title: {
                    ...commutingOptions.plugins.title,
                    text: "Car Commuting Emissions",
                  },
                },
              }}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={publicTransportData}
              options={{
                ...commutingOptions,
                plugins: {
                  ...commutingOptions.plugins,
                  title: {
                    ...commutingOptions.plugins.title,
                    text: "Public Transport Emissions",
                  },
                },
              }}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            {/* Empty box */}
          </div>
        </div>
        <div className="flex gap-4 h-[450px]">
          <div
            className="w-2/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Doughnut
              data={hotelAccommodationDataC}
              options={hotelAccommodationOptions}
              height={chartHeight}
            />
          </div>
          <div className="w-1/3 flex flex-col gap-4">
            <div
              className="h-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
              style={{ backgroundColor: "#DDDCBD" }}
            >
              {/* Empty box */}
            </div>
            <div
              className="h-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
              style={{ backgroundColor: "#DDDCBD" }}
            >
              {/* Empty box */}
            </div>
          </div>
        </div>

        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={businessTravelData}
              options={businessTravelOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={combinedChartData}
              options={combinedChartOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={wttFuelChartData}
              options={wttFuelOptions}
              height={chartHeight}
            />
          </div>
        </div>

        <div className="flex gap-4 h-[225px]">
          <div
            className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bubble
              data={homeOfficeDataC}
              options={homeOfficeOptions}
              height={chartHeight / 2}
            />
          </div>
          <div className="w-2/3">{/* Empty space */}</div>
        </div>
      </div>
    </div>
  );
};

export default Scope3;
