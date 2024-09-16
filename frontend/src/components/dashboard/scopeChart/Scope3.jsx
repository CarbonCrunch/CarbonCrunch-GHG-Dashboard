import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie, Bubble } from "react-chartjs-2";
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

  // console.log("ecData", ecData);
  // console.log("btlsData", btlsData);
  // console.log("fgData", fgData);
  // console.log("wttFuelData", wttFuelData);
  // console.log("foodData", foodData);
  // console.log("materialData", materialData);
  // console.log("wasteData", wasteData);
  // console.log("waterData", waterData);
  // console.log("homeOfficeData", homeOfficeData);
  // console.log("hotelAccommodationData", hotelAccommodationData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (reports.length === 1) {
          // If reports array has only one object
          const report = reports[0];
          const {
            companyName = "",
            _id = "",
            ec = [],
            btls = [],
            fg = [],
            fa = [],
            wttfuel = [],
            food = [],
            material = [],
            waste = [],
            water = [],
            homeOffice = [],
          } = report;
          const { hotelAccommodation } = fa;

          const requests = [];

         if (ec.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eEc`, {
               _id,
               companyName,
             })
           );
         }

         if (btls.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eBtls`, {
               _id,
               companyName,
             })
           );
         }

         if (fg.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eFg`, {
               _id,
               companyName,
             })
           );
         }

         if (wttfuel.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eWTTFuel`, {
               _id,
               companyName,
             })
           );
         }

         if (food.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eFood`, {
               _id,
               companyName,
             })
           );
         }

         if (material.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eMaterialsUsed`, {
               _id,
               companyName,
             })
           );
         }

         if (waste.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eWasteDisposal`, {
               _id,
               companyName,
             })
           );
         }

         if (water.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eWater`, {
               _id,
               companyName,
             })
           );
         }

         if (homeOffice.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eHome`, {
               _id,
               companyName,
             })
           );
         }

         if (hotelAccommodation && hotelAccommodation.length > 0) {
           requests.push(
             axios.post(`/api/reports/CO2eFa`, {
               _id,
               companyName,
             })
           );
         }


          const responses = await Promise.all(requests);

          // Process responses and set data states
          let responseIndex = 0;
          if (ec.length > 0) setEcData(responses[responseIndex++].data.data);
          if (btls.length > 0)
            setBtlsData(responses[responseIndex++].data.data);
          if (fg.length > 0) setFgData(responses[responseIndex++].data.data);
          if (wttfuel.length > 0)
            setWttFuelData(responses[responseIndex++].data.data);
          if (food.length > 0)
            setFoodData(responses[responseIndex++].data.data);
          if (material.length > 0)
            setMaterialData(responses[responseIndex++].data.data);
          if (waste.length > 0)
            setWasteData(responses[responseIndex++].data.data);
          if (water.length > 0)
            setWaterData(responses[responseIndex++].data.data);
          if (homeOffice.length > 0)
            setHomeOfficeData(responses[responseIndex++].data.data);
          if (hotelAccommodation && hotelAccommodation.length > 0)
            setHotelAccommodationData(responses[responseIndex++].data.data);
        } else {
          // If reports array has multiple objects
          const combinedEc = [];
          const combinedBtls = [];
          const combinedFg = [];
          const combinedWttFuel = [];
          const combinedFood = [];
          const combinedMaterial = [];
          const combinedWaste = [];
          const combinedWater = [];
          const combinedHomeOffice = [];
          const combinedHotelAccommodation = [];

         await Promise.all(
           reports.map(async (report) => {
             const {
               companyName = "",
               _id = "",
               ec = [],
               btls = [],
               fg = [],
               fa = [],
               wttfuel = [],
               food = [],
               material = [],
               waste = [],
               water = [],
               homeOffice = [],
             } = report;
             const { hotelAccommodation } = fa;

             const requests = [];

             if (ec.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eEc`, {
                   _id,
                   companyName,
                 })
               );
             }

             if (btls.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eBtls`, {
                   _id,
                   companyName,
                 })
               );
             }

             if (fg.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eFg`, {
                   _id,
                   companyName,
                 })
               );
             }

             if (wttfuel.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eWTTFuel`, {
                   _id,
                   companyName,
                 })
               );
             }

             if (food.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eFood`, {
                   _id,
                   companyName,
                 })
               );
             }

             if (material.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eMaterialsUsed`, {
                   _id,
                   companyName,
                 })
               );
             }

             if (waste.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eWasteDisposal`, {
                   _id,
                   companyName,
                 })
               );
             }

             if (water.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eWater`, {
                   _id,
                   companyName,
                 })
               );
             }

             if (homeOffice.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eHome`, {
                   _id,
                   companyName,
                 })
               );
             }

             if (hotelAccommodation && hotelAccommodation.length > 0) {
               requests.push(
                 axios.post(`/api/reports/CO2eFa`, {
                   _id,
                   companyName,
                 })
               );
             }

             const responses = await Promise.all(requests);

             // Process responses and combine data
             let responseIndex = 0;
             if (ec.length > 0)
               combinedEc.push(...responses[responseIndex++].data.data);
             if (btls.length > 0)
               combinedBtls.push(...responses[responseIndex++].data.data);
             if (fg.length > 0)
               combinedFg.push(...responses[responseIndex++].data.data);
             if (wttfuel.length > 0)
               combinedWttFuel.push(...responses[responseIndex++].data.data);
             if (food.length > 0)
               combinedFood.push(...responses[responseIndex++].data.data);
             if (material.length > 0)
               combinedMaterial.push(...responses[responseIndex++].data.data);
             if (waste.length > 0)
               combinedWaste.push(...responses[responseIndex++].data.data);
             if (water.length > 0)
               combinedWater.push(...responses[responseIndex++].data.data);
             if (homeOffice.length > 0)
               combinedHomeOffice.push(...responses[responseIndex++].data.data);
             if (hotelAccommodation && hotelAccommodation.length > 0)
               combinedHotelAccommodation.push(
                 ...responses[responseIndex++].data.data
               );
           })
         );


          // Set combined data states
          setEcData(combinedEc);
          setBtlsData(combinedBtls);
          setFgData(combinedFg);
          setWttFuelData(combinedWttFuel);
          setFoodData(combinedFood);
          setMaterialData(combinedMaterial);
          setWasteData(combinedWaste);
          setWaterData(combinedWater);
          setHomeOfficeData(combinedHomeOffice);
          setHotelAccommodationData(combinedHotelAccommodation);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reports]); // Add 'reports' to dependency array to refetch data when it changes

  const chartHeight = 450;

  const tooltipOptions = {
    bodyFont: {
      size: 15, // Set font size to 15
    },
    titleFont: {
      size: 15, // Set font size to 15
    },
    padding: 16, // Increase padding for better visibility
  };

  const barColors = [
    "#FBAF58", // Light orange
    "#2E4F50", // Dark teal
    "#A6D39F", // Light green
    "#DDDCBD", // Light beige
    "#51DAD9", // Light blue
    "#2D92D5", // Dark blue
  ];
  const baseBorderColor = "rgba(47, 79, 79, 1)"; // Solid #2F4F4F
  const baseColor = "rgba(47, 79, 79, 1)"; // #2F4F4F with 60% opacity

  const wttFuelChartData = {
    labels: wttFuelData.map((item) => item.fuel),
    datasets: [
      {
        label: "CO2e Emissions",
        data: wttFuelData.map((item) => item.CO2e),
        backgroundColor: wttFuelData.map(
          (_, index) => barColors[index % barColors.length]
        ), // Cycle through barColors
        // borderColor: baseBorderColor,
        // borderWidth: 1,
      },
    ],
  };

  const wttFuelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Emissions from WTT Fuel",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
  };

  // Material and Waste chart data
  const materialWasteChartData = {
    labels: ["Material", "Waste"],
    datasets: [
      {
        label: "Material CO2e Emissions",
        data: [materialData.reduce((sum, item) => sum + item.CO2e, 0)],
        backgroundColor: baseColor,
        borderColor: baseBorderColor,
        borderWidth: 1,
      },
      {
        label: "Waste CO2e Emissions",
        data: [wasteData.reduce((sum, item) => sum + item.CO2e, 0)],
        backgroundColor: "rgba(75, 107, 107, 0.6)", // Lighter tone for differentiation
        borderColor: "rgba(75, 107, 107, 1)",
        borderWidth: 1,
      },
    ],
  };

  const materialWasteOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Emissions from Material and Waste",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
  };

  // Combined chart data for Food and Water
  const combinedChartData = {
    labels: foodData.map((item, index) => `Month ${index + 1}`),
    datasets: [
      {
        label: "Food",
        data: foodData.map((item) => item.CO2e),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fill: true,
      },
      {
        label: "Water",
        data: waterData.map((item) => item.CO2e),
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
      legend: { display: false },
      title: {
        display: true,
        text: "Combined Food and Water Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "CO2e Emissions" },
      },
    },
  };

  // Home Office data for Bubble chart
  const homeOfficeDataC = {
    datasets: homeOfficeData.map((item) => ({
      label: item.type, // Using the `type` field for the label
      data: [
        {
          x: parseFloat(item.workingFromHome) * parseFloat(item.workingRegime), // Using a combination of workingFromHome and workingRegime as the x-axis value
          y: parseFloat(item.CO2e), // Using CO2e as the y-axis value
          r: parseFloat(item.numberOfEmployees), // Using numberOfEmployees divided by 2 as the bubble size (r)
        },
      ],
      backgroundColor: "rgba(54, 162, 235, 0.6)", // Default color, can be made dynamic if needed
    })),
  };

  const homeOfficeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }, // Enable legend to distinguish between different `type` labels
      title: {
        display: true,
        text: "Home Office Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: {
        title: { display: true, text: "Working from Home * Working Regime" }, // Updated x-axis title
        beginAtZero: true, // Ensure x-axis starts from 0
      },
      y: {
        title: { display: true, text: "CO2e Emissions" },
        beginAtZero: true, // Ensure y-axis starts from 0
      },
    },
  };

  // Car Commuting chart data
  const carCategories = ["Small car", "Average car", "Medium car", "Large car"];
  const fuelTypesC = ["Petrol", "Diesel", "Hybrid", "Battery Electric Vehicle"];
  const carCommutingData = {
    labels: carCategories.map((category) => category.split(" ")[0]), // ["Small", "Average", "Medium", "Large"]
    datasets: fuelTypesC.map((fuel) => {
      return {
        label: fuel,
        data: carCategories.map((category) => {
          // Use ecData instead of ec
          const filteredData = ecData.filter(
            (item) =>
              item.vehicle === "Car" &&
              item.type === category &&
              item.fuel === fuel
          );
          return filteredData.length > 0
            ? filteredData.reduce((sum, item) => sum + item.CO2e, 0)
            : 0;
        }),
        backgroundColor:
          fuel === "Petrol"
            ? "rgba(255, 0, 0, 0.7)"
            : fuel === "Diesel"
            ? "rgba(255, 127, 0, 0.7)"
            : fuel === "Hybrid"
            ? "rgba(255, 255, 0, 0.7)"
            : "rgba(0, 255, 0, 0.7)", // For "Battery Electric Vehicle"
      };
    }),
  };

  const vehicleCategories = ["Bus", "Rental Car", "Taxi", "Train", "Motorbike"];
  const fuelTypes = ["Diesel", "CNG", "Electric", "Hybrid", "Petrol"]; // Added Petrol as it's in your data

  const publicTransportData = {
    labels: vehicleCategories,
    datasets: fuelTypes.map((fuel) => {
      return {
        label: fuel,
        data: vehicleCategories.map((category) => {
          const filteredData = ecData.filter(
            (item) =>
              (item.vehicle === category ||
                (category === "Taxi" &&
                  (item.vehicle === "Taxis" || item.vehicle === "Taxi")) ||
                (category === "Train" && item.vehicle === "Rail") ||
                (category === "Motorbike" && item.vehicle === "Motorbike")) &&
              item.fuel === fuel
          );
          return filteredData.length > 0
            ? filteredData.reduce((sum, item) => sum + item.CO2e, 0)
            : 0;
        }),
        backgroundColor:
          fuel === "Diesel"
            ? "rgba(255, 0, 0, 0.7)"
            : fuel === "CNG"
            ? "rgba(255, 127, 0, 0.7)"
            : fuel === "Electric"
            ? "rgba(255, 255, 0, 0.7)"
            : fuel === "Hybrid"
            ? "rgba(0, 255, 0, 0.7)"
            : "rgba(0, 0, 255, 0.7)", // For "Petrol"
      };
    }),
  };

  // Business Travel chart data
  const vehicleCategoriesblts = ["Cars (by size)", "Motorbike", "Vans"];
  const fuelTypesblts = ["Diesel", "Petrol", "Electric", "Hybrid"]; // Add other fuel types as necessary

  const businessTravelData = {
    labels: vehicleCategoriesblts.map((category) => category.split(" ")[0]), // ["Cars", "Motorbikes", "Vans"]
    datasets: fuelTypesblts.map((fuel) => {
      return {
        label: fuel,
        data: vehicleCategoriesblts.map((category) => {
          const filteredData = btlsData.filter(
            (item) => item.vehicle === category && item.fuel === fuel
          );
          return filteredData.length > 0
            ? filteredData.reduce((sum, item) => sum + item.CO2e, 0)
            : 0;
        }),
        backgroundColor:
          fuel === "Diesel"
            ? "rgba(255, 0, 0, 0.7)"
            : fuel === "Petrol"
            ? "rgba(255, 127, 0, 0.7)"
            : fuel === "Electric"
            ? "rgba(0, 255, 0, 0.7)"
            : "rgba(54, 162, 235, 0.7)", // For "Hybrid" or other types
      };
    }),
  };

  const businessTravelOptions = {
    indexAxis: "y", // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Display legend to differentiate fuel types
      title: {
        display: true,
        text: "Business Travel Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: "CO2e Emissions" },
        beginAtZero: true, // Ensure the x-axis starts at 0
      },
      y: {
        stacked: true,
        title: { display: true, text: "Vehicle Type" },
      },
    },
  };

  // Freighting Goods chart data
  // Segregate fg data into categories
  const segregatedData = {
    trucks: [],
    vans: [],
    ships: [],
    flights: [],
    rail: [],
  };

  fgData.forEach((item) => {
    if (
      ["HGV (all diesel)", "HGV refrigerated (all diesel)"].includes(
        item.category
      )
    ) {
      segregatedData.trucks.push(item);
    } else if (item.category === "Vans") {
      segregatedData.vans.push(item);
    } else if (["Sea tanker", "Cargo ship"].includes(item.category)) {
      segregatedData.ships.push(item);
    } else if (item.category === "Freight flights") {
      segregatedData.flights.push(item);
    } else if (item.category === "Rail") {
      segregatedData.rail.push(item);
    }
  });

  // Hotel Accommodation chart data
  const hotelAccommodationDataC = {
    labels: hotelAccommodationData.map((item) => item.starRating), // Extract star ratings for the labels
    datasets: [
      {
        data: hotelAccommodationData.map((item) => item.CO2e), // Use CO2e as the data points
        backgroundColor: hotelAccommodationData.map(
          (item) => item.color || "#FBAF58"
        ), // Use provided colors or fallback to a default color
      },
    ],
  };

  const hotelAccommodationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // Display legend to distinguish between different star ratings
      title: {
        display: true,
        text: "Hotel Accommodation Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    cutout: "50%", // For a doughnut-style pie chart, or remove for a full pie chart
  };

  const commutingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Employee Commuting Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: { title: { display: true, text: "Vehicle Type" } },
      y: { title: { display: true, text: "CO2e Emissions" } },
    },
  };

  return (
    <div>
      <h1 className="text-lg font-bold mb-2 pt-8">
        Scope 3: Indirect emissions from employee commuting, business travel and
        lodging, freighting goods, and other categories
      </h1>

      <div className="flex flex-col gap-4">
        <div
          className="w-full h-[450px] p-2 rounded-lg border border-gray-900 shadow-lg"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          <Line
            data={{
              labels: fgData.map((item) => item.distance || "Unknown"),
              datasets: [
                {
                  label: "Trucks",
                  data: segregatedData.trucks.map((item) => ({
                    x: parseFloat(item.distance),
                    y: item.CO2e >= 0 ? item.CO2e : 0,
                  })),
                  borderColor: "rgba(255, 99, 132, 1)", // Red color
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  fill: true,
                },
                {
                  label: "Vans",
                  data: segregatedData.vans.map((item) => ({
                    x: parseFloat(item.distance),
                    y: item.CO2e >= 0 ? item.CO2e : 0,
                  })),
                  borderColor: "rgba(54, 162, 235, 1)", // Blue color
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  fill: true,
                },
                {
                  label: "Ships",
                  data: segregatedData.ships.map((item) => ({
                    x: parseFloat(item.distance),
                    y: item.CO2e >= 0 ? item.CO2e : 0,
                  })),
                  borderColor: "rgba(75, 192, 192, 1)", // Teal color
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  fill: true,
                },
                {
                  label: "Flights",
                  data: segregatedData.flights.map((item) => ({
                    x: parseFloat(item.distance),
                    y: item.CO2e >= 0 ? item.CO2e : 0,
                  })),
                  borderColor: "rgba(255, 206, 86, 1)", // Yellow color
                  backgroundColor: "rgba(255, 206, 86, 0.2)",
                  fill: true,
                },
                {
                  label: "Rail",
                  data: segregatedData.rail.map((item) => ({
                    x: parseFloat(item.distance),
                    y: item.CO2e >= 0 ? item.CO2e : 0,
                  })),
                  borderColor: "rgba(153, 102, 255, 1)", // Purple color
                  backgroundColor: "rgba(153, 102, 255, 0.2)",
                  fill: true,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true },
                title: {
                  display: true,
                  text: `Emissions from Vans, Trucks, Ships, Flights, and Rail`,
                  font: { size: 15 },
                },
                tooltip: tooltipOptions,
              },
              scales: {
                x: {
                  type: "linear", // Use linear scale for x-axis
                  title: { display: true, text: "Distance (km)" },
                  beginAtZero: true, // Ensure the x-axis starts from 0
                },
                y: {
                  title: { display: true, text: "CO2e Emissions" },
                  beginAtZero: true, // Ensure the y-axis starts from 0
                },
              },
            }}
            height={chartHeight}
          />
        </div>

        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
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
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
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
        </div>

        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar
              data={businessTravelData}
              options={businessTravelOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Line
              data={materialWasteChartData}
              options={materialWasteOptions}
              height={chartHeight}
            />
          </div>
        </div>

        <div className="flex gap-4 h-[400px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar
              data={wttFuelChartData}
              options={wttFuelOptions}
              height={chartHeight}
            />
          </div>
          <div className="w-[49%] flex flex-col gap-4">
            <div
              className="h-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <Bubble
                data={homeOfficeDataC}
                options={homeOfficeOptions}
                height={chartHeight / 2}
              />
            </div>
            <div className="h-1/2 flex gap-4">
              <div
                className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
                style={{ backgroundColor: "#F5F5F5" }}
              >
                <Line
                  data={combinedChartData}
                  options={combinedChartOptions}
                  height={chartHeight / 2}
                />
              </div>
              <div
                className="w-[47%] p-2 rounded-lg border border-gray-900 shadow-lg"
                style={{ backgroundColor: "#F5F5F5" }}
              >
                <Pie
                  data={hotelAccommodationDataC}
                  options={hotelAccommodationOptions}
                  height={chartHeight / 2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope3;
