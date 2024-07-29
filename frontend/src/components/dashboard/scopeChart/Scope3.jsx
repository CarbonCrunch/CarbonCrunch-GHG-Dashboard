import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie } from "react-chartjs-2";
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
  } = reportData;
  const { hotelAccommodation } = fa;

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
        ]);

        setEcData(ecResponse.data.data);
        setBtlsData(btlsResponse.data.data);
        setFgData(fgResponse.data.data);
        setWttFuelData(wttFuelResponse.data.data);
        setFoodData(foodResponse.data.data);
        setMaterialData(materialResponse.data.data);
        setWasteData(wasteResponse.data.data);
        setWaterData(waterResponse.data.data);
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
    hotelAccommodation,
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
  const hotelAccommodationChartData = {
    labels: hotelAccommodationData.map((item) => item.index),
    datasets: [
      {
        label: "CO2e Emissions",
        data: hotelAccommodationData.map((item) => item.CO2e),
        backgroundColor: [
        baseColor,
        "rgba(75, 107, 107, 0.6)",
        "rgba(103, 135, 135, 0.6)",
        "rgba(131, 163, 163, 0.6)",
        "rgba(159, 191, 191, 0.6)",
      ],
      borderColor: [
        baseBorderColor,
        "rgba(75, 107, 107, 1)",
        "rgba(103, 135, 135, 1)",
        "rgba(131, 163, 163, 1)",
        "rgba(159, 191, 191, 1)",
      ],
        borderWidth: 1,
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
        text: "Emissions from Hotel Accommodation",
        font: {
          size: 25, // Increase title font size by 5x
        },
      },
      tooltip: tooltipOptions,
    },
  };

  // Chart data for ec
  const ecChartData = {
    labels: ecData.map((item) => item.type),
    datasets: [
      {
        label: "CO2e Emissions",
        data: ecData.map((item) => item.CO2e),
        backgroundColor: baseColor,
        borderColor: baseBorderColor,
        borderWidth: 1,
      },
    ],
  };

  const ecOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from Employee Commuting",
        font: {
          size: 25, // Increase title font size by 5x
        },
      },
      tooltip: tooltipOptions,
    },
  };

  // Chart data for btls
  const btlsChartData = {
    labels: btlsData.map((item) => item.vehicle),
    datasets: [
      {
        label: "CO2e Emissions",
        data: btlsData.map((item) => item.CO2e),
        backgroundColor: baseColor,
        borderColor: baseBorderColor,
        borderWidth: 1,
      },
    ],
  };

  const btlsOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from Business Travel and Lodging",
        font: {
          size: 25, // Increase title font size by 5x
        },
      },
      tooltip: tooltipOptions,
    },
  };

  // Categories for fg chart
  const fgCategories = [
    "Vans",
    "HGV (all diesel)",
    "HGV refrigerated (all diesel)",
    "Freight flights",
    "Rail",
    "Sea tanker",
    "Cargo ship",
  ];

  // Aggregated CO2e data for fg categories
  const fgCO2eData = fgCategories.map((category) => {
    const categoryData = fgData.filter((item) => item.category === category);
    const totalCO2e = categoryData.reduce(
      (sum, item) => sum + (item.CO2e || 0),
      0
    );
    return totalCO2e;
  });

  // Chart data for fg
  const fgChartData = {
    labels: fgCategories,
    datasets: [
      {
        label: "CO2e Emissions",
        data: fgCO2eData,
        backgroundColor: baseColor,
        borderColor: baseBorderColor,
        borderWidth: 1,
      },
    ],
  };

  const fgOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from Freighting Goods",
        font: {
          size: 25, // Increase title font size by 5x
        },
      },
      tooltip: tooltipOptions,
    },
  };

  // Chart data for wttfuel
  const wttFuelChartData = {
    labels: wttFuelData.map((item) => item.fuel),
    datasets: [
      {
        label: "CO2e Emissions",
        data: wttFuelData.map((item) => item.CO2e),
        backgroundColor: baseColor,
        borderColor: baseBorderColor,
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

  const combinedLabels = [
    ...foodData.map((item) => item.unit),
    ...waterData.map((item) => item.emission),
  ];
  const combinedData = [
    ...foodData.map((item) => item.CO2e),
    ...waterData.map((item) => item.CO2e),
  ];

  // Chart data for combined food and water
  const combinedChartData = {
    labels: combinedLabels,
    datasets: [
      {
        label: "CO2e Emissions",
        data: combinedData,
        backgroundColor: [
          ...foodData.map(() => baseColor),
        ...waterData.map(() => "rgba(75, 107, 107, 0.6)"), 
        ],
        borderColor: [
          ...foodData.map(() => baseBorderColor),
        ...waterData.map(() => "rgba(75, 107, 107, 1)"),
        ],
        borderWidth: 1,
      },
    ],
  };

  const combinedOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from Food and Water",
        font: {
          size: 25, // Increase title font size by 5x
        },
      },
      tooltip: tooltipOptions,
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
        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar data={ecChartData} options={ecOptions} height={chartHeight} />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={btlsChartData}
              options={btlsOptions}
              height={chartHeight}
            />
          </div>
        </div>
        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar data={fgChartData} options={fgOptions} height={chartHeight} />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={wttFuelChartData}
              options={wttFuelOptions}
              height={chartHeight}
            />
          </div>
        </div>
        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Bar
              data={combinedChartData}
              options={combinedOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Line
              data={materialWasteChartData}
              options={materialWasteOptions}
              height={chartHeight}
            />
          </div>
        </div>
        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            <Pie
              data={hotelAccommodationChartData}
              options={hotelAccommodationOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
            style={{ backgroundColor: "#DDDCBD" }}
          >
            {/* This div is left empty for potential future use or to maintain layout balance */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope3;
