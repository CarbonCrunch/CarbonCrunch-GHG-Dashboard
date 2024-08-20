import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import NavbarD from "../dashboard/NavbarD";
import Sidebar from "../dashboard/Sidebar";

const billTypes = [
  "Bioenergy",
  "BusinessTravel",
  "Electricity_Heating",
  "EmployCommuting",
  "Flights & Accommodations",
  "Food",
  "FreightingGoods",
  "Fuels",
  "Home",
  "MaterialsUsed",
  "OwnedVehicles",
  "Refrigerants",
  "WTTFuel",
  "WasteDisposal",
  "Water",
];

const ViewBills = () => {
  const [companyName, setCompanyName] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [bills, setBills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tableData, setTableData] = useState([]);

  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get("/api/bills/getBills", {
        params: { companyName, facilityName },
      });
      const { data } = response.data;
      console.log("data", response.data);
      setBills(data); // Assuming `data` contains the array of bills
      const transformedData = data.map((bill) => ({
        billId: bill.billId,
        status: "Pending", // Default status as "Pending"
        billName: bill.billName || `Bill ${bill.billId}`,
        dateAdded: new Date(bill.createdAt).toLocaleDateString(),
        addedBy: bill.username,
        amountValue: "", // Placeholder, as amount is not in the schema
        type_off_bill: bill.type_off_bill, // Store the bill type for filtering
        URL: bill.URL,
        companyName: bill.companyName,
        facilityName: bill.facilityName,
      }));
      setTableData(transformedData);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setTableData([]);
    }
  };

  const handleStatusToggle = useCallback((billId) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.billId === billId
          ? {
              ...item,
              status: item.status === "Pending" ? "On-going" : "Pending",
            }
          : item
      )
    );
  }, []);

  const handleRowClick = (bill) => {
    navigate(`/viewbills/${bill.billId}`, { state: { bill } });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <button
            className={`px-4 py-2 rounded-lg ${
              row.original.status === "Pending"
                ? "bg-yellow-500 text-white"
                : "bg-green-500 text-white"
            }`}
            onClick={() => handleStatusToggle(row.original.billId)}
          >
            {row.original.status}
          </button>
        ),
      },
      {
        Header: "Bill Name",
        accessor: "billName",
      },
      {
        Header: "Company Name",
        accessor: "companyName",
      },
      {
        Header: "Facility Name",
        accessor: "facilityName",
      },
      {
        Header: "URL",
        accessor: "URL",
        Cell: ({ value }) => (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View Document
          </a>
        ),
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
    ],
    [handleStatusToggle]
  );

  const filteredData = useMemo(
    () =>
      selectedCategory
        ? tableData.filter((bill) => bill.type_off_bill === selectedCategory)
        : tableData,
    [selectedCategory, tableData]
  );

  const tableInstance = useTable({ columns, data: filteredData });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <NavbarD />
      <div className="flex flex-1">
        <div className="w-1/6 flex-shrink-0 sticky top-0 h-screen bg-white shadow-lg">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 bg-white shadow-lg rounded-lg m-4">
          <div className="mb-6">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Facility Name"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
              >
                Search
              </button>
            </div>
          </div>

          <div className="mb-6">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {billTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="min-w-full bg-white shadow-md rounded-lg overflow-hidden"
            >
              <thead className="bg-gray-200">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        key={column.id}
                        className="px-6 py-3 border-b border-gray-300 text-left text-sm font-semibold text-gray-700"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.length > 0 ? (
                  rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className="bg-white hover:bg-gray-100 transition duration-300 cursor-pointer"
                        onClick={() => handleRowClick(row.original)}
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
                  })
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      No bills found for the selected category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBills;
