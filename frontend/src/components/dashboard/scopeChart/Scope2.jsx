import React from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

  // const [ehctdData, setEhctdData] = useState([]);

  // const reportData = reports[0];
  // const { companyName, facilityName, reportId, ehctd } = reportData;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [ehctdResponse] = await Promise.all([
  //         axios.get(/api/reports/${reportId}/CO2eEhctd, {
  //           params: {
  //             companyName,
  //             facilityName,
  //             reportId,
  //             ehctd: JSON.stringify(ehctd),
  //           },
  //         }),
  //       ]);

  //       setEhctdData(ehctdResponse.data.data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [reportId, companyName, facilityName, ehctd]);

const Scope2 = () => {
  const chartHeight = 450;

  const hardCodedData = [
    { activity: "Heating and Steam", CO2e: 575, date: "2024-02-06" },
    { activity: "District Cooling", CO2e: 13112, date: "2024-01-31" },
    { activity: "Electricity", CO2e: 33, date: "2024-02-01" },
    { activity: "Electricity", CO2e: 45, date: "2024-02-15" },
    { activity: "Heating and Steam", CO2e: 600, date: "2024-02-20" },
    { activity: "District Cooling", CO2e: 12000, date: "2024-02-10" },
  ];

  const uniqueActivities = [
    ...new Set(hardCodedData.map((item) => item.activity)),
  ];
  const sortedData = hardCodedData.sort(
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
        bodyFont: { size: 24 },
        titleFont: { size: 24 },
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
          className="w-2/3 p-2 rounded-lg border border-gray-300 shadow-lg"
          style={{ backgroundColor: "#DDDCBD" }}
        >
          <Line data={chartData} options={options} height={chartHeight} />
        </div>
        <div
          className="w-1/3 p-2 rounded-lg border border-gray-300 shadow-lg"
          style={{ backgroundColor: "#DDDCBD" }}
        >
          
        </div>
      </div>
    </div>
  );
};

export default Scope2;
