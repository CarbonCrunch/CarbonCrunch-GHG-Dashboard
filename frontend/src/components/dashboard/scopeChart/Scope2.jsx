import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  BubbleController,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  BubbleController
);

const Scope2 = ({ reports }) => {
  const [ehctdData, setEhctdData] = useState([]);
  const [homeOfficeData, setHomeOfficeData] = useState([]);

  const reportData = reports[0];
  const { companyName, facilityName, reportId, ehctd, homeOffice } = reportData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ehctdResponse, homeOfficeResponse] = await Promise.all([
          axios.get(`/api/reports/${reportId}/CO2eEhctd`, {
            params: {
              companyName,
              facilityName,
              reportId,
              ehctd: JSON.stringify(ehctd),
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

        setEhctdData(ehctdResponse.data.data);
        setHomeOfficeData(homeOfficeResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reportId, companyName, facilityName, ehctd, homeOffice]);

  const chartHeight = 450; // Reduced height by 25%

  const tooltipOptions = {
    bodyFont: {
      size: 24, // Increase font size by 4x
    },
    titleFont: {
      size: 24, // Increase font size by 4x
    },
    padding: 16, // Increase padding for better visibility
  };

  const ehctdChartData = {
    labels: ehctdData.map((item) => item.activity),
    datasets: [
      {
        label: "CO2e Emissions",
        data: ehctdData.map((item) => item.CO2e),
        backgroundColor: "rgba(47, 79, 79, 1)", 
        borderColor: "rgba(47, 79, 79, 1)", // Solid #2F4F4F
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const ehctdOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from Electricity, Heat & Steam, District Cooling",
        font: {
          size: 25, // Increase title font size by 5x
        },
      },
      tooltip: tooltipOptions,
    },
  };

  const homeOfficeChartData = {
    datasets: homeOfficeData.map((item, index) => ({
      label: item.type,
      data: [
        {
          x: index,
          y: item.CO2e,
          r: item.numberOfEmployees,
        },
      ],
      backgroundColor:
        index % 2 === 0
          ? "rgba(47, 79, 79, 1)"
          : "rgba(75, 107, 107, 0.6)", // Lighter tone
      borderColor:
        index % 2 === 0
          ? "rgba(47, 79, 79, 1)" // Solid #2F4F4F
          : "rgba(75, 107, 107, 1)", // Lighter tone
    })),
  };

  const homeOfficeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Emissions from Home Office",
        font: {
          size: 25, // Increase title font size by 5x
        },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Index",
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
  return (
    <div>
      <h1 className="text-lg font-bold mb-2 pt-8">
        Scope 2: Indirect emissions from the generation of purchased
        electricity, steam, heating, and cooling consumed by the reporting
        company
      </h1>
      <div className="flex gap-4 h-[450px]">
        <div
          className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
          style={{ backgroundColor: "#DDDCBD" }}
        >
          <Line
            data={ehctdChartData}
            options={ehctdOptions}
            height={chartHeight}
          />
        </div>
        <div
          className="w-1/2 p-2 rounded-lg border border-gray-300 shadow-lg"
          style={{ backgroundColor: "#DDDCBD" }}
        >
          <Bubble
            data={homeOfficeChartData}
            options={homeOfficeOptions}
            height={chartHeight}
          />
        </div>
      </div>
    </div>
  );
};

export default Scope2;
