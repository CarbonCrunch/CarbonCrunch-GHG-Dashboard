import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Scope2 = ({ reports }) => {
  const [ehctdData, setEhctdData] = useState([]);

  const reportData = reports;
  const { companyName, facilityName, reportId, ehctd } = reportData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ehctdResponse] = await Promise.all([
          axios.get(`/api/reports/${reportId}/CO2eEhctd`, {
            params: {
              companyName,
              facilityName,
              reportId,
              ehctd: JSON.stringify(ehctd),
            },
          }),
        ]);

        setEhctdData(ehctdResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reportId, companyName, facilityName, ehctd]);

  const chartHeight = 450;

  const filteredData = ehctdData.filter((item) =>
    ["Electricity", "Heating and Steam", "District Cooling"].includes(
      item.activity
    )
  );

  const uniqueActivities = [
    "Electricity",
    "Heating and Steam",
    "District Cooling",
  ];
  const sortedData = filteredData.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const uniqueDates = [...new Set(sortedData.map((item) => item.date))];

  const datasets = uniqueActivities.map((activity, index) => {
    const color = `hsl(${index * 120}, 70%, 50%)`;
    return {
      label: activity,
      data: uniqueDates.map((date) => {
        const dataPoint = sortedData.find(
          (item) => item.date === date && item.activity === activity
        );
        return dataPoint ? dataPoint.CO2e : null;
      }),
      borderColor: color,
      backgroundColor: color,
      fill: false,
      tension: 0.4,
      spanGaps: true, // This will connect the lines across gaps
    };
  });

  const chartData = {
    labels: uniqueDates,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "CO2e Emissions",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Scope 2 Emissions Over Time",
        font: { size: 25 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y} CO2e`;
          },
        },
        bodyFont: { size: 15 },
        titleFont: { size: 15 },
        padding: 16,
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
          className="w-full p-2 rounded-lg border border-gray-900 shadow-lg"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          <Line data={chartData} options={options} height={chartHeight} />
        </div>
      </div>
    </div>
  );
};

export default Scope2;
