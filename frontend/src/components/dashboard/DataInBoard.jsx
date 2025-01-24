import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";
import { useAuth } from "../../context/AuthContext";
import Fuel from "../reports/Fuel";
import Bioenergy from "../reports/Bioenergy";
import Refrigerants from "../reports/Refrigerants";
import Ec from "../reports/Ec";
import Ov from "../reports/Ov";
import Wttfuels from "../reports/Wttfuels";
import Materials from "../reports/Materials";
import Waste from "../reports/Waste";
import Fa from "../reports/Fa";
import Btls from "../reports/Btls";
import Fg from "../reports/Fg";
import Ehctd from "../reports/Ehctd";
import Food from "../reports/Food";
import HomeOffice from "../reports/HomeOffice";
import Water from "../reports/Water";
import Utd from "../reports/Utd";
import Dtd from "../reports/Dtd";
import Ula from "../reports/Ula";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const DataInBoard = () => {
  const [report, setReport] = useState(null);
  const [allReports, setAllReports] = useState(null); // State to store all reports for Admin
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fuels");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { user } = useAuth();
  const today = new Date();
  const tenYearsAgo = new Date(today);
  tenYearsAgo.setFullYear(today.getFullYear() - 10);
  const [startDate, setStartDate] = useState(tenYearsAgo);
  const [endDate, setEndDate] = useState(today);
  const [facilityName, setFacilityName] = useState(
    user?.facilities[0]?.facilityName || ""
  );
  // console.log("User", user);
  useEffect(() => {
    if (user.role === "FacAdmin") {
      fetchReports();
    } else if (user.role === "Admin") {
      fetchFacilityReports();
    }
  }, [user.role, facilityName]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/reports/getUserReports",
        {
          user, // Send user data in the request body
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      if (response.data.data === "zero") {
        setReport([]);
      } else {
        setReport(response.data.data);
        console.log("Fetched Reports:", response.data.data);
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch reports");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilityReports = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/reports/getCompanyReport",
        {
          user, // Send user data in the request body
        },
        {
          withCredentials: true, // Ensure cookies are sent
        }
      );
      if (response.data.data === "zero") {
        setReport([]);
      } else {
        // Save all reports for calculating total CO2e
        setAllReports(response.data.data);
        console.log("All Reports:", response.data.data);

        // Filter reports by facilityName for Admin role
        const filteredReports = response.data.data.filter(
          (report) => report.facilityName === facilityName
        );
        setReport(filteredReports);
        console.log("Filtered Reports:", filteredReports);
        // toast.success(`Fetched for "${facilityName}"`); // Show toast notification
      }
      setError(null);
    } catch (err) {
      setError("Failed to fetch reports for facility");
      console.error("Error fetching facility reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const hasReadPermission = (entity) => {
    const userPermissions =
      user?.facilities[0]?.userRoles[0]?.permissions || [];
    // console.log("User Permissions", userPermissions);
    const permission = userPermissions.find(
      (perm) => perm?.entity?.toLowerCase() === entity?.toLowerCase()
    );

    return permission?.actions.includes("read");
  };

  const categories = [
    "Bioenergy",
    "BusinessTravel",
    "Electricity_Heating",
    "EmployCommuting",
    "Flights & Accomodations",
    "Food",
    "FreightingGoods",
    "Fuels",
    "HomeOffice",
    "MaterialsUsed",
    "OwnedVehicles",
    "Refrigerants",
    "WasteDisposal",
    "Water",
    "WTTFuel",
    "Downstream Transportation and Distribution",
    "Upstream Transportation and Distribution",
    "Upstream Leased Assets",
    "Use of Sold Products",
    "End of Life Treatment of Sold Products",
    "Downstream Leased Assets",
    "Franchises",
    "Processing of Sold Products",
  ];

  const filterOptions = [
    { value: "All", label: "All Categories" },
    { value: "CM-3", label: "CM-3 (Fuel and Electricity)" },
    {
      value: "CM-4",
      label: "CM-4 (Upstream Transportation and Distribution)",
    },
    { value: "CM-5", label: "CM-5 (Waste Generated in Operations)" },
    { value: "CM-6", label: "CM-6 (Business Travel)" },
    { value: "CM-7", label: "CM-7 (Employee Commuting)" },
    {
      value: "CM-9",
      label: "CM-9 (Upstream Leased Assets)",
    },
    {
      value: "CM-9",
      label: "CM-9 (Downstream Transportation and Distribution)",
    },
  ];
  // Filter categories based on the selected filter
  const filteredCategories =
    selectedFilter === "CM-3"
      ? [
          "Select",
          "Bioenergy",
          "Electricity_Heating",
          "Fuels",
          "Refrigerants",
          "WTTFuel",
        ]
      : selectedFilter === "CM-4"
      ? ["Select", "Upstream Transportation and Distribution"]
      : selectedFilter === "CM-5"
      ? ["Select", "WasteDisposal"]
      : selectedFilter === "CM-6"
      ? ["Select", "BusinessTravel", "Flights & Accomodations"]
      : selectedFilter === "CM-7"
      ? ["Select", "EmployCommuting"]
      : selectedFilter === "CM-8"
      ? ["Select", "Upstream Leased Assets"]
      : selectedFilter === "CM-9"
      ? ["Select", "Downstream Transportation and Distribution"]
      : categories;

  const componentMap = {
    Fuels: Fuel,
    Bioenergy: Bioenergy,
    Refrigerants: Refrigerants,
    OwnedVehicles: Ov,
    WTTFuel: Wttfuels,
    MaterialsUsed: Materials,
    WasteDisposal: Waste,
    "Flights & Accomodations": Fa,
    Electricity_Heating: Ehctd,
    BusinessTravel: Btls,
    FreightingGoods: Fg,
    EmployCommuting: Ec,
    Food: Food,
    HomeOffice: HomeOffice,
    Water: Water,
    "Downstream Transportation and Distribution": Dtd,
    "Upstream Transportation and Distribution": Utd,
    "Upstream Leased Assets": Ula,
    "Use of Sold Products": null,
    "End of Life Treatment of Sold Products": null,
    "Downstream Leased Assets": null,
    Franchises: null,
    "Processing of Sold Products": null,
  };

  const categoryMap = {
    Fuels: "fuel",
    Bioenergy: "bioenergy",
    Refrigerants: "refrigerants",
    OwnedVehicles: "ownedVehicles",
    WTTFuel: "wttfuel",
    MaterialsUsed: "material",
    WasteDisposal: "waste",
    "Flights & Accomodations": "fa",
    Electricity_Heating: "ehctd",
    BusinessTravel: "btls",
    FreightingGoods: "fg",
    EmployCommuting: "ec",
    Food: "food",
    HomeOffice: "homeOffice",
    Water: "water",
    "Downstream Transportation and Distribution": "dtd",
    "Upstream Transportation and Distribution": "utd",
    "Upstream Leased Assets": "ula",
    "Use of Sold Products": "usop",
    "End of Life Treatment of Sold Products": "eol",
    "Downstream Leased Assets": "dla",
    Franchises: "franchises",
    "Processing of Sold Products": "posp",
  };

  const SelectedComponent = componentMap[selectedCategory];

  const calculatePieData = () => {
    if (!report || !selectedCategory) return { labels: [], datasets: [] };

    const key = categoryMap[selectedCategory];
    const items =
      user.role === "Admin" ? getAllCategoryItems(key) : report[key];
    // console.log("items", items)

    if (!Array.isArray(items) || items.length === 0) {
      return { labels: [], datasets: [] };
    }

    const dataMap = {};

    items.forEach((item) => {
      let sector = "";
      let co2e = 0;

      switch (selectedCategory) {
        case "Fuels":
        case "Bioenergy":
          sector = item.fuelType;
          co2e = item.CO2e;
          break;

        case "MaterialsUsed":
        case "WasteDisposal":
        case "WTTFuel":
          sector = item.fuel;
          co2e = item.CO2e;
          break;
        case "Refrigerants":
        case "Water":
          sector = item.emission;
          co2e = item.CO2e;
          break;
        case "OwnedVehicles":
          sector = item.fuel;
          co2e = item.CO2e;
          break;
        case "HomeOffice":
          sector = item.type;
          co2e = item.CO2e;
          break;
        case "FreightingGoods":
          sector = item.category;
          co2e = item.CO2e;
          break;
        case "Flights & Accomodations":
          if (item.flightAccommodation) {
            item.flightAccommodation.forEach((flight) => {
              sector = "Flight Accommodation";
              co2e = flight.CO2e;
              if (sector in dataMap) {
                dataMap[sector] += co2e;
              } else {
                dataMap[sector] = co2e;
              }
            });
          }
          // Calculate CO2e for hotel accommodations
          if (item.hotelAccommodation) {
            item.hotelAccommodation.forEach((hotel) => {
              sector = "Hotel Accommodation";
              co2e = hotel.CO2e;
              if (sector in dataMap) {
                dataMap[sector] += co2e;
              } else {
                dataMap[sector] = co2e;
              }
            });
          }
          break;
        case "EmployCommuting":
        case "Electricity_Heating":
        case "BusinessTravel":
          sector = item.type || item.activity;
          co2e = item.CO2e;
          break;
        default:
          sector = "Unknown";
          co2e = item.CO2e;
      }

      if (sector in dataMap) {
        dataMap[sector] += co2e;
      } else {
        dataMap[sector] = co2e;
      }
    });

    return {
      labels: Object.keys(dataMap),
      datasets: [
        {
          data: Object.values(dataMap),
          backgroundColor: [
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#E91E63",
            "#9C27B0",
            "#673AB7",
            "#3F51B5",
            "#2196F3",
            "#03A9F4",
            "#00BCD4",
            "#009688",
            "#795548",
          ],
          borderColor: "#FFFFFF",
          borderWidth: 2,
        },
      ],
    };
  };

  const getAllCategoryItems = (key) => {
    // Combine all items for the selected category across all facilities
    if (!allReports) return [];
    return allReports.reduce((acc, report) => {
      return acc.concat(report[key] || []);
    }, []);
  };

  const pieData = calculatePieData();

  const totalFootprint =
    pieData.datasets[0]?.data.reduce((a, b) => a + b, 0) || 0;

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarD />
      <div className="flex flex-1">
        <div className="w-1/6 sticky top-0 h-screen">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-4">{selectedCategory}</h1>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border p-2 rounded"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="border p-2 rounded"
              />
              <button className="p-2 bg-green-500 text-white rounded">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-start ml-auto mr-20 space-y-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="filter" className="mr-2">
                  Filter:
                </label>
                <select
                  id="filter"
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="p-2 border rounded"
                >
                  {filterOptions.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="category" className="mr-2">
                  Category:
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-2 border rounded"
                >
                  {filteredCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      disabled={!hasReadPermission(categoryMap[category])}
                      style={{
                        cursor: hasReadPermission(categoryMap[category])
                          ? "pointer"
                          : "not-allowed",
                      }}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchFacilityReports(); // Trigger fetch on Enter key press
                    }
                  }}
                  className="p-2 border rounded"
                  placeholder="Enter Facility Name"
                />
                <button
                  onClick={fetchFacilityReports}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Fetch
                </button>
              </div>
            </div>
          </div>

          <div className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-4">
              {user.role === "Admin"
                ? "Total Footprints of All Facilities"
                : "Carbon Footprint Overview"}
            </h2>
            <div className="flex">
              <div className="w-2/3">
                <div className="border p-4 rounded-md">
                  <Pie
                    data={pieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "70%",
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                    }}
                    height={350}
                  />
                </div>
              </div>
              <div className="w-1/2 pl-4 pb-4">
                <div className="border h-1/2 p-8 mb-4 rounded-md">
                  <h3 className="text-lg font-semibold">Total Footprints</h3>
                  <p className="text-2xl font-bold">
                    {totalFootprint.toFixed(2)} kg CO2-eq
                  </p>
                  <p className="text-green-500">
                    -10% less than industry average
                  </p>
                </div>
                <div className="border h-1/2 p-8 rounded-md">
                  <h3 className="text-lg font-semibold">
                    Average Footprint / Activity
                  </h3>
                  <p className="text-2xl font-bold">000 kg CO2-eq</p>
                  <p className="text-green-500">
                    -10% less than industry average
                  </p>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6 mt-6">
            {loading ? (
              <p>Loading report...</p>
            ) : error ? (
              <div>
                <p className="text-red-500">{error}</p>
                {SelectedComponent && <SelectedComponent report={report} />}
              </div>
            ) : report ? (
              Array.isArray(report) && report.length > 0 ? (
                <div>
                  {SelectedComponent && (
                    <SelectedComponent report={report[0]} />
                  )}
                </div>
              ) : (
                <div>
                  {SelectedComponent && <SelectedComponent report={report} />}
                </div>
              )
            ) : (
              <p>No report data available.</p>
            )}
          </main>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default DataInBoard;
