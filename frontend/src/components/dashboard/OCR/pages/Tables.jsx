import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTable } from "react-table";
import Header from "../Header";

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Filled Parameters", "Pending Parameters"],
  datasets: [
    {
      data: [45, 75],
      backgroundColor: ["#36A2EB", "#FF6384"],
      hoverBackgroundColor: ["#36A2EB", "#FF6384"],
    },
  ],
};

const tableData = [
  {
    status: "To review",
    documentName: "[SAMPLE]_tax_invoice_eu_4.pdf",
    dateAdded: "256911136",
    addedBy: "@vedikaparwal",
    amountValue: "1478.47",
  },
  {
    status: "To review",
    documentName: "[SAMPLE]_tax_invoice_eu.pdf",
    dateAdded: "143453775",
    addedBy: "143453775",
    amountValue: "143453775",
  },
  // Add more rows as needed
];

const columns = [
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Document name",
    accessor: "documentName",
  },
  {
    Header: "Date Added",
    accessor: "dateAdded",
  },
  {
    Header: "Added By",
    accessor: "addedBy",
  },
  {
    Header: "Amount Value",
    accessor: "amountValue",
  },
];

const categories = [
  "Bioenergy",
  "Refrigerants",
  "Electricity",
  "Owned Vehicles",
  "WTT Fuel",
  "Materials Used",
  "Waste Disposal",
  "Business Travel",
  "Freighting Goods",
  "Employee Commuting",
  "Food",
  "Water",
  "Fuels",
  "Home",
  "Flights And Accommodations",
];

function Tables() {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData });

  return (
    <>
      <Header />
    <div className="App p-8 bg-gray-100">

      {/* Progress Container */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex-1 space-y-2">
          <p className="text-gray-700 text-lg">
            Filled Parameters: <span className="font-semibold">45 / 150</span>
          </p>
          <p className="text-gray-700 text-lg">
            Pending Parameters: <span className="font-semibold">75 / 150</span>
          </p>
        </div>
        <div className="flex-none">
          <Doughnut data={data} />
        </div>
        <div className="flex-1 space-y-2 text-right">
          <p className="text-gray-700 text-lg">
            Manually Updated: <span className="font-semibold">15 / 45</span>
          </p>
          <p className="text-gray-700 text-lg">
            Automated Parameters: <span className="font-semibold">10 / 45</span>
          </p>
        </div>
      </div>


      {/* Category Slider */}
      <div className="flex overflow-x-auto mb-8 space-x-4">
        {categories.map((category, index) => (
          <button
            key={index}
            className="flex-shrink-0 px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition duration-300"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Buttons for Pending Parameters */}
      <div className="mb-8 flex space-x-4">
        <button className="px-4 py-2 bg-[#002952] text-white rounded-lg shadow hover:bg-[#003D7A] transition duration-300">
          Pending Parameters
        </button>
        <button className="px-4 py-2 bg-[#A6D3A0] text-white rounded-lg shadow hover:bg-[#8BB78D] transition duration-300">
          Manually Update
        </button>
        <button className="px-4 py-2 bg-[#DDDCBD] text-white rounded-lg shadow hover:bg-[#BEBE9F] transition duration-300">
          Automate Parameter
        </button>
      </div>

      {/* Document Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Document Table</h2>
        <table
          {...getTableProps()}
          className="min-w-full bg-white shadow-md rounded-lg overflow-hidden"
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-50">
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-6 py-3 border-b border-gray-200 text-left text-sm font-semibold text-gray-600"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="bg-white hover:bg-gray-100 transition duration-300"
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 border-b border-gray-200 text-sm text-gray-700"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}

export default Tables;
