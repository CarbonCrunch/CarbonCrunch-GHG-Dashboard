import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavbarD from "./NavbarD";
import Sidebar from "./Sidebar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAuth } from "../../context/AuthContext";

const ViewReport = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.post(
          `/api/reports/get`,
          {
            user, // Send user data in the request body
          },
          {
            params: { reportId },
            headers: {
              Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
            },
            withCredentials: true, // Ensure cookies are sent
          }
        );
        if (response.data.data === "zero") {
          setReport(null);
        } else {
          setReport(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch report");
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [reportId]);

  if (loading) return <p>Loading report...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!report) return <p>No report available</p>;

  const scope1Categories = [
    {
      name: "Direct emissions arising from owned or controlled stationary sources that use fossil fuels and/or emit fugitive emissions",
      subcategories: ["Fuel", "Bioenergy", "Refrigerants"],
    },
    {
      name: "Direct emissions from owned or controlled mobile sources",
      subcategories: ["Passenger vehicles", "Delivery vehicles"],
    },
  ];

  const scope2Categories = [
    {
      name: "Direct emissions arising from owned or controlled stationary sources that use fossil fuels and/or emit fugitive emissions",
      subcategories: ["Electricity", "Heat and steam", "District cooling"],
    },
  ];

  const scope3Categories = [
    {
      name: "Fuel- and energy-related activities",
      subcategories: [
        "All other fuel and energy related activities",
        "Transmission and distribution losses",
      ],
    },
    {
      name: "Waste generated in operations",
      subcategories: ["Waste water", "Waste"],
    },
    {
      name: "Purchased goods",
      subcategories: ["Water supplied", "Material use"],
    },
    {
      name: "Business travel",
      subcategories: [
        "All transportation by air",
        "Emissions arising from hotel accommodation associated with business travel",
        " All transportation by sea",
        "All transportation by land, public transport, rented/leased vehicle and taxi",
      ],
    },
    {
      name: "Upstream transportation and distribution",
      subcategories: ["Freighting goods"],
    },
    { name: "Employees commuting", subcategories: [] },
    { name: "Food", subcategories: [] },
    { name: "Home office", subcategories: [] },
  ];

  const renderTableRows = (categories, data, isScope2 = false) => {
    if (isScope2) {
      return categories.flatMap((category) => [
        <tr key={category.name} className="border-b">
          <td
            style={{ backgroundColor: "#b8ebb1" }}
            rowSpan={category.subcategories.length + 1}
            className="py-4 pl-2"
          >
            {category.name}
          </td>
        </tr>,
        ...category.subcategories.map((subcat, subIndex) => (
          <tr key={`${subcat}-${subIndex}`} className="border-b">
            <td style={{ backgroundColor: "#b8ebb1" }} className="p-2">
              {subcat}
            </td>
            <td style={{ backgroundColor: "#b8ebb1" }} className="p-2">
              {(data[subcat] || 0).toFixed(2)}
            </td>
          </tr>
        )),
      ]);
    }
    return categories.flatMap((category, index) => [
      <tr key={`${category.name}-${index}`} className="border-b">
        <td
          style={{ backgroundColor: "#b8ebb1" }}
          rowSpan={category.subcategories.length + 1}
          className="py-4 pl-2 "
        >
          {category.name}
        </td>
        {category.subcategories.length === 0 && (
          <>
            <td style={{ backgroundColor: "#b8ebb1" }} className="p-2">
              -
            </td>
            <td style={{ backgroundColor: "#b8ebb1" }} className="p-2">
              {(data[category.name.toLowerCase()] || 0).toFixed(2)}
            </td>
          </>
        )}
      </tr>,
      ...category.subcategories.map((subcat, subIndex) => (
        <tr key={`${subcat}-${subIndex}`} className="border-b">
          <td style={{ backgroundColor: "#b8ebb1" }} className="p-2">
            {isScope2 ? "Electricity_Heating" : subcat}
          </td>
          <td style={{ backgroundColor: "#b8ebb1" }} className="p-2">
            {(data[subcat.toLowerCase()] || 0).toFixed(2)}
          </td>
        </tr>
      )),
    ]);
  };
  const aggregateData = (categories, isScope2 = false) => {
    if (isScope2) {
      const aggregatedScope2 = {
        Electricity: 0,
        "Heat and steam": 0,
        "District cooling": 0,
      };
      if (report && report.ehctd) {
        report.ehctd.forEach((item) => {
          if (item.activity === "Electricity") {
            aggregatedScope2["Electricity"] += item.CO2e || 0;
          } else if (item.activity === "Heating and Steam") {
            aggregatedScope2["Heat and steam"] += item.CO2e || 0;
          } else if (item.activity === "District Cooling") {
            aggregatedScope2["District cooling"] += item.CO2e || 0;
          }
        });
      }
      return aggregatedScope2;
    }

    const aggregatedData = {};
    categories.forEach((category) => {
      if (category.subcategories.length === 0) {
        switch (category.name.toLowerCase()) {
          case "employees commuting":
            aggregatedData[category.name.toLowerCase()] = (
              report.ec || []
            ).reduce((sum, item) => sum + (item.CO2e || 0), 0);
            break;
          case "food":
            aggregatedData[category.name.toLowerCase()] = (
              report.food || []
            ).reduce((sum, item) => sum + (item.CO2e || 0), 0);
            break;
          case "home office":
            aggregatedData[category.name.toLowerCase()] = (
              report.homeOffice || []
            ).reduce((sum, item) => sum + (item.CO2e || 0), 0);
            break;
          default:
            aggregatedData[category.name.toLowerCase()] = (
              report[category.name.toLowerCase()] || []
            ).reduce((sum, item) => sum + (item.CO2e || 0), 0);
        }
      } else {
        category.subcategories.forEach((subcat) => {
          switch (subcat.toLowerCase()) {
            case "all other fuel and energy related activities":
              aggregatedData[subcat.toLowerCase()] = (
                report.wttfuel || []
              ).reduce((sum, item) => sum + (item.CO2e || 0), 0);
              break;
            case "transmission and distribution losses":
              aggregatedData[subcat.toLowerCase()] = (
                report.ehctd || []
              ).reduce((sum, item) => sum + (item.CO2eTD || 0), 0);
              break;
            case "waste water":
              aggregatedData[subcat.toLowerCase()] = (report.water || [])
                .filter((item) => item.emission === "Water Treatment")
                .reduce((sum, item) => sum + (item.CO2e || 0), 0);
              break;
            case "waste":
              aggregatedData[subcat.toLowerCase()] = (
                report.waste || []
              ).reduce((sum, item) => sum + (item.CO2e || 0), 0);
              break;
            case "water supplied":
              aggregatedData[subcat.toLowerCase()] = (report.water || [])
                .filter((item) => item.emission === "Water Supply")
                .reduce((sum, item) => sum + (item.CO2e || 0), 0);
              break;
            case "material use":
              aggregatedData[subcat.toLowerCase()] = (
                report.material || []
              ).reduce((sum, item) => sum + (item.CO2e || 0), 0);
              break;
            case "emissions arising from hotel accommodation associated with business travel":
              aggregatedData[subcat.toLowerCase()] = (
                report.fa?.hotelAccomodation || []
              ).reduce((sum, item) => sum + (item.CO2e || 0), 0);
              break;
            case "all transportation by land, public transport, rented/leased vehicle and taxi":
              aggregatedData[subcat.toLowerCase()] = (report.btls || []).reduce(
                (sum, item) => sum + (item.CO2e || 0),
                0
              );
              break;
            case "freighting goods":
              aggregatedData[subcat.toLowerCase()] = (report.fg || []).reduce(
                (sum, item) => sum + (item.CO2e || 0),
                0
              );
              break;
            case "passenger vehicles":
            case "delivery vehicles":
              aggregatedData[subcat.toLowerCase()] = (
                report.ownedVehicles || []
              )
                .filter((vehicle) => vehicle.level1 === subcat)
                .reduce((sum, vehicle) => sum + (vehicle.CO2e || 0), 0);
              break;
            default:
              aggregatedData[subcat.toLowerCase()] = (
                report[subcat.toLowerCase()] || []
              ).reduce((sum, item) => sum + (item.CO2e || 0), 0);
          }
        });
      }
    });
    return aggregatedData;
  };

  const aggregatedScope1Data = aggregateData(scope1Categories);
  const aggregatedScope2Data = aggregateData(scope2Categories, true);
  const aggregatedScope3Data = aggregateData(scope3Categories);

  const totalScope1 = Object.values(aggregatedScope1Data).reduce(
    (total, value) => total + value,
    0
  );
  const totalScope2 = Object.values(aggregatedScope2Data).reduce(
    (total, value) => total + value,
    0
  );
  const totalScope3 = Object.values(aggregatedScope3Data).reduce(
    (total, value) => total + value,
    0
  );

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Define the columns for the table
    const columns = [
      { header: "Scope", dataKey: "scope" },
      { header: "Category", dataKey: "category" },
      { header: "Subcategory", dataKey: "subcategory" },
      { header: "t CO2e", dataKey: "tCO2e" },
    ];

    const tableData = [];

    // Helper function to add rows
    const addRows = (scope, categories, data, report) => {
      let rowCount = 0;
      categories.forEach((category) => {
        const subcatCount = Math.max(category.subcategories.length, 1);
        for (let i = 0; i < subcatCount; i++) {
          const subcat = category.subcategories[i] || "-";
          let tCO2eValue = 0;

          if (scope === "Scope 2") {
            if (subcat.toLowerCase() === "electricity") {
              tCO2eValue = (report.ehctd || [])
                .filter((item) => item.activity === "Electricity")
                .reduce((sum, item) => sum + (item.CO2e || 0), 0);
            } else if (
              subcat.toLowerCase() === "transmission and distribution losses"
            ) {
              tCO2eValue = (report.ehctd || [])
                .filter((item) => item.activity === "Electricity")
                .reduce((sum, item) => sum + (item.CO2eTD || 0), 0);
            } else if (subcat.toLowerCase() === "heat and steam") {
              tCO2eValue = (report.ehctd || [])
                .filter((item) => item.activity === "Heating and Steam")
                .reduce((sum, item) => sum + (item.CO2e || 0), 0);
            } else if (subcat.toLowerCase() === "district cooling") {
              tCO2eValue = (report.ehctd || [])
                .filter((item) => item.activity === "District Cooling")
                .reduce((sum, item) => sum + (item.CO2e || 0), 0);
            }
          } else {
            tCO2eValue =
              data[subcat.toLowerCase()] ||
              data[category.name.toLowerCase()] ||
              0;
          }

          tableData.push({
            scope: rowCount === 0 ? scope : "",
            category: i === 0 ? category.name : "",
            subcategory: subcat,
            tCO2e: tCO2eValue.toFixed(2),
            rowSpan: i === 0 ? { category: subcatCount } : undefined,
          });
          rowCount++;
        }
      });
      return rowCount;
    };

    // Add Scope 1 data
    const scope1RowCount = addRows(
      "Scope 1",
      scope1Categories,
      aggregatedScope1Data,
      report
    );
    tableData.push({
      scope: "",
      category: "Total Scope 1",
      tCO2e: totalScope1.toFixed(2),
      colspan: { category: 2 },
    });

    // Add Scope 2 data
    const scope2RowCount = addRows(
      "Scope 2",
      scope2Categories,
      aggregatedScope2Data,
      report
    );
    tableData.push({
      scope: "",
      category: "Total Scope 2",
      tCO2e: totalScope2.toFixed(2),
      colspan: { category: 2 },
    });

    // Add Scope 3 data
    const scope3RowCount = addRows(
      "Scope 3",
      scope3Categories,
      aggregatedScope3Data,
      report
    );
    tableData.push({
      scope: "",
      category: "Total Scope 3",
      tCO2e: totalScope3.toFixed(2),
      colspan: { category: 2 },
    });

    // Add total emissions
    tableData.push({
      scope: "",
      category: "Total Emissions",
      subcategory: "",
      tCO2e: (totalScope1 + totalScope2 + totalScope3).toFixed(2),
      colspan: { category: 2 },
    });

    // Set up the table style
    const tableStyles = {
      theme: "grid",
      headStyles: { fillColor: [0, 123, 255], textColor: 255 },
      bodyStyles: { fillColor: 255 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
        3: { cellWidth: "auto", halign: "right" },
      },
      margin: { top: 20 },
    };

    // Add the table to the PDF
    doc.autoTable({
      columns: columns,
      body: tableData.map((row) => {
        // Map rows to include colspan and rowspan handling
        const newRow = {
          scope: row.scope,
          category: row.colspan
            ? { content: row.category, colSpan: row.colspan.category }
            : row.rowSpan
            ? { content: row.category, rowSpan: row.rowSpan.category }
            : row.category,
          subcategory: row.colspan
            ? { content: "", colSpan: row.colspan.category }
            : row.subcategory,
          tCO2e: row.tCO2e,
        };
        return newRow;
      }),
      ...tableStyles,
      didParseCell: function (data) {
        const row = data.row.index;
        const col = data.column.index;

        // Style for total rows
        if (data.cell.text[0].includes("Total")) {
          data.cell.styles.fontStyle = "bold";
          if (data.cell.text[0].includes("Total Emissions")) {
            data.cell.styles.fillColor = [152, 251, 152]; // Light green for total emissions
          } else {
            data.cell.styles.fillColor = [255, 255, 255]; // Light gray for scope totals
          }
        }

        if (row === tableData.length - 1 && col === columns.length - 1) {
          data.cell.styles.fillColor = [152, 251, 152]; // Light green for total emissions value
        }

        // Add borders
        data.cell.styles.lineWidth = 0.1;
        data.cell.styles.lineColor = [0, 0, 0];

        // Set rowspan for Scope column
        if (col === 0) {
          if (data.cell.text[0] === "Scope 1") {
            data.cell.styles.valign = "middle";
            data.cell.rowSpan = scope1RowCount + 1;
          } else if (data.cell.text[0] === "Scope 2") {
            data.cell.styles.valign = "middle";
            data.cell.rowSpan = scope2RowCount + 1;
          } else if (data.cell.text[0] === "Scope 3") {
            data.cell.styles.valign = "middle";
            data.cell.rowSpan = scope3RowCount + 1;
          }
        }

        // Center-align category cells with rowspan
        if (col === 1 && data.cell.rowSpan > 1) {
          data.cell.styles.valign = "middle";
        }
      },
    });

    // Save the PDF
    doc.save("GHG_Emissions_Report.pdf");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarD />
      <div className="flex flex-1">
        <div className="w-1/6 sticky top-0 h-screen">
          <Sidebar />
        </div>
        <div className="flex-1 p-4 m-3">
          {/* Report details */}
          <h1 className="text-2xl font-bold mb-4">Report</h1>
          <h3 className="text-lg font-semibold mb-4">
            Company: {report.companyName}, Facility: {report.facilityName},
            Report: {report.reportName}, Report ID: {report.reportId}
          </h3>
          {/* Progress bar */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-md flex justify-between items-center mb-5, mt-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Filled Parameters:</span>
                <span className="ml-2">45 / 150</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Pending Parameters:</span>
                <span className="ml-2">75 / 150</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    className="stroke-gray-300"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-green-600"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="70, 100"
                    fill="none"
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text
                    x="12"
                    y="20.35"
                    className="fill-gray-700 text-[0.5em] text-center"
                  >
                    70%
                  </text>
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium">Progress</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Manually Updated:</span>
                <span className="ml-2">15 / 45</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Automated Parameters:</span>
                <span className="ml-2">10 / 45</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/datainboard")}
            className=" mt-6 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Insert Data
          </button>
          <button
            onClick={handleDownloadPDF}
            className="ml-4 mt-6 mb-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Download Report
          </button>
          <table className="min-w-full bg-white shadow-md overflow-hidden mb-4 border-collapse">
            <thead>
              <tr>
                <th
                  style={{ backgroundColor: "#98db73" }}
                  colSpan="2"
                  className="border border-gray-300 p-2 font-bold text-left"
                >
                  Category
                </th>
                <th
                  colSpan="2"
                  style={{ textAlign: "center", backgroundColor: "#98db73" }}
                  className="border border-gray-300 p-2 font-bold text-left"
                >
                  Emission source category
                </th>
                <th
                  style={{ backgroundColor: "#98db73" }}
                  className="border border-gray-300 p-2 font-bold text-left"
                >
                  t CO2e
                </th>
              </tr>
            </thead>
            <tbody>
              <td
                style={{
                  backgroundColor: "#2c2c2c",
                  color: "white",
                  fontWeight: 500,
                }}
                rowSpan={
                  scope1Categories.length +
                  scope1Categories.reduce(
                    (acc, cat) => acc + cat.subcategories.length,
                    0
                  ) +
                  scope2Categories.length +
                  scope2Categories.reduce(
                    (acc, cat) => acc + cat.subcategories.length,
                    0
                  ) +
                  scope3Categories.length +
                  scope3Categories.reduce(
                    (acc, cat) => acc + cat.subcategories.length,
                    0
                  ) +
                  7
                }
                className="border border-gray-300 p-2"
              >
                GHG <br />
                Protocol <br />
                Standards: <br />
                Corporate <br />
                Scope - 1 and <br />
                2, Value Chain <br />- Scope 3
              </td>
              <tr>
                <td
                  style={{ backgroundColor: "#2c2c2c", color: "white" }}
                  rowSpan={
                    scope1Categories.length +
                    scope1Categories.reduce(
                      (acc, cat) => acc + cat.subcategories.length,
                      0
                    ) +
                    2
                  }
                  className="border border-gray-300 p-2"
                >
                  Scope 1
                </td>
              </tr>
              {renderTableRows(scope1Categories, aggregatedScope1Data)}
              <tr className="border-t font-bold">
                <td
                  style={{ backgroundColor: "#b8ebb1" }}
                  colSpan="2"
                  className="border border-gray-300 p-2"
                >
                  Total Scope 1
                </td>
                <td
                  style={{ backgroundColor: "#b8ebb1" }}
                  className="border border-gray-300 p-2"
                >
                  {totalScope1.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td
                  style={{ backgroundColor: "#2c2c2c", color: "white" }}
                  rowSpan={scope2Categories[0].subcategories.length + 3}
                  className="border border-gray-300 p-2"
                >
                  Scope 2
                </td>
              </tr>
              {renderTableRows(scope2Categories, aggregatedScope2Data, true)}
              <tr className="border-t font-bold">
                <td
                  style={{ backgroundColor: "#b8ebb1" }}
                  colSpan="2"
                  className="border border-gray-300 p-2"
                >
                  Total Scope 2
                </td>
                <td
                  style={{ backgroundColor: "#b8ebb1" }}
                  className="border border-gray-300 p-2"
                >
                  {totalScope2.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td
                  style={{ backgroundColor: "#2c2c2c", color: "white" }}
                  rowSpan={
                    scope3Categories.length +
                    scope3Categories.reduce(
                      (acc, cat) => acc + cat.subcategories.length,
                      0
                    ) +
                    2
                  }
                  className="border border-gray-300 p-2"
                >
                  Scope 3
                </td>
              </tr>
              {renderTableRows(scope3Categories, aggregatedScope3Data)}
              <tr className="border-t font-bold">
                <td
                  style={{ backgroundColor: "#b8ebb1" }}
                  colSpan="2"
                  className="border border-gray-300 p-2"
                >
                  Total Scope 3
                </td>
                <td
                  style={{ backgroundColor: "#b8ebb1" }}
                  className="border border-gray-300 p-2"
                >
                  {totalScope3.toFixed(2)}
                </td>
              </tr>

              <tr className="border-t font-bold">
                <td
                  style={{ padding: 20, backgroundColor: "#98db73" }}
                  colSpan="4"
                  className="border border-gray-300 p-2"
                >
                  Total Emissions{" "}
                </td>
                <td
                  style={{ padding: 20, backgroundColor: "#98db73" }}
                  className="border border-gray-300"
                >
                  {(totalScope1 + totalScope2 + totalScope3).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
