import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const Scope2 = ({ reports }) => {
  const [ehctdData, setEhctdData] = useState([]);

  const reportData = reports[0];
  const { companyName, facilityName, reportId, ehctd, homeOffice } = reportData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ehctdResponse = await axios.get(
          `/api/reports/${reportId}/CO2eEhctd`,
          {
            params: {
              companyName,
              facilityName,
              reportId,
              ehctd: JSON.stringify(ehctd),
            },
          }
        );

        setEhctdData(ehctdResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reportId, companyName, facilityName, ehctd]);

  const chartHeight = 450; // Reduced height by 25%

  const ehctdChartData = {
    labels: ehctdData.map((item) => item.activity),
    datasets: [
      {
        label: "CO2e Emissions",
        data: ehctdData.map((item) => item.CO2e),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
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
        text: "CO2e Emissions from Electricity, Heat & Steam, District Cooling",
      },
    },
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">
        Scope 2: Indirect emissions from the generation of purchased
        electricity, steam, heating, and cooling consumed by the reporting
        company
      </h3>
      <div className="flex flex-col gap-4">
        <div className="h-[450px]">
          <Line
            data={ehctdChartData}
            options={ehctdOptions}
            height={chartHeight}
          />
        </div>
      </div>
    </div>
  );
};

export default Scope2;
