import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

const Ec = ({ report }) => {
  const [ecData, setEcData] = useState([]);
  const [newEc, setNewEc] = useState({
    date: null,
    vehicle: "",
    type: "",
    fuel: "",
    unit: "",
    distance: "",
    method: "",
    quantityOfFuel: "",
    totalNumberOfEmployees: "",
    percentageOfEmployeesUsingModeOfTransport: "",
    numberOfWorkingDays: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [isYearPicker, setIsYearPicker] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(false);
  const { user } = useAuth();

  const MethodOptions = [
    "Fuel-based method",
    "Distance-based method",
    "Average-data method",
  ];
  const VehicleOptions = ["Car", "Ferry", "Motorbike", "Taxi", "Bus", "Rail"];
  const Level2Options = [
    "Small car",
    "Medium car",
    "Large car",
    "Average car",
    "Foot passenger",
    "Car passenger",
    "Average (all passenger)",
    "Small",
    "Medium",
    "Large",
    "Average",
    "Regular taxi",
    "Black cab",
    "Local bus (not London)",
    "Local London bus",
    "Average local bus",
    "Coach",
    "National rail",
    "International rail",
    "Light rail and tram",
    "London Underground",
  ];
  const FuelOptions = [
    "Battery Electric Vehicle",
    "CNG",
    "Diesel",
    "Hybrid",
    "LPG",
    "Petrol",
    "Plug-in Hybrid Electric Vehicle",
  ];
  const UnitOptions = ["KM", "Passenger.KM"];

  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    ec = [],
  } = reportData || {};

  useEffect(() => {
    if (ec && Array.isArray(ec)) {
      setEcData(
        ec.map((item) => ({
          ...item,
          date: new Date(item.date),
        }))
      );
    }
  }, [report]);

  const getDateRange = () => {
    if (!timePeriod || typeof timePeriod !== "object") {
      return { start: new Date(), end: new Date() };
    }

    const { start, end } = timePeriod;
    return { start: new Date(start), end: new Date(end) };
  };

  const { start, end } = getDateRange();

  // Check user permissions for ec entity
  const ecPermissions =
    user?.facilities[0]?.userRoles[0]?.permissions.find(
      (perm) => perm.entity.toLowerCase() === "ec"
    )?.actions || [];

  const hasReadPermission = ecPermissions.includes("read");
  const hasCreatePermission = ecPermissions.includes("create");
  const hasUpdatePermission = ecPermissions.includes("update");
  const hasDeletePermission = ecPermissions.includes("delete");

  const handleAddEc = () => {
    if (!hasCreatePermission) {
      toast.error("You don't have permission to create new entries");
      return;
    }

    if (
      newEc.date &&
      newEc.vehicle &&
      newEc.type &&
      newEc.fuel &&
      newEc.unit &&
      newEc.distance
    ) {
      if (editIndex === -1) {
        setEcData([...ecData, newEc]);
      } else {
        const updatedEcData = [...ecData];
        updatedEcData[editIndex] = newEc;
        setEcData(updatedEcData);
        setEditIndex(-1);
      }
      setNewEc({
        date: null,
        vehicle: "",
        type: "",
        fuel: "",
        unit: "",
        distance: "",
      });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    if (!hasUpdatePermission) {
      toast.error("You don't have permission to update existing entries");
      return;
    }

    setNewEc(ecData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (!hasDeletePermission) {
      toast.error("You don't have permission to delete existing entries");
      return;
    }

    const updatedEcData = ecData.filter((_, i) => i !== index);
    setEcData(updatedEcData);
    toast.info("Now click on save to permanently delete", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `/api/reports/:reportId/ec/put`,
        { ec: ecData },
        {
          params: {
            reportId,
            companyName,
            facilityName,
          },
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update EC data");
      }
    } catch (error) {
      console.error("Error saving EC data:", error);
      toast.error(error.response?.data?.message || "Failed to save EC data");
    }
  };

  if (!hasReadPermission) {
    return <p>You don't have permission to view this data.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Vehicle</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Fuel</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Distance (km)</th>
            <th className="py-3 px-6 text-left">Method</th>
            <th className="py-3 px-6 text-left">Quantity of Fuel</th>
            <th className="py-3 px-6 text-left">Total Number of Employees</th>
            <th className="py-3 px-6 text-left">
              % of Employees Using Mode of Transport
            </th>
            <th className="py-3 px-6 text-left">Number of Working Days</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 text-sm font-light">
          {ecData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">{item.vehicle}</td>
              <td className="py-3 px-6 text-left">{item.type}</td>
              <td className="py-3 px-6 text-left">{item.fuel}</td>
              <td className="py-3 px-6 text-left">{item.unit}</td>
              <td className="py-3 px-6 text-left">{item.distance}</td>
              <td className="py-3 px-6 text-left">{item.method}</td>
              <td className="py-3 px-6 text-left">{item.quantityOfFuel}</td>
              <td className="py-3 px-6 text-left">
                {item.totalNumberOfEmployees}
              </td>
              <td className="py-3 px-6 text-left">
                {item.percentageOfEmployeesUsingModeOfTransport}
              </td>
              <td className="py-3 px-6 text-left">
                {item.numberOfWorkingDays}
              </td>
              <td className="py-3 px-6 text-left">
                {item.date.toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">
                <button
                  onClick={() => handleEdit(index)}
                  className={`text-blue-500 hover:text-blue-700 mr-2 ${
                    !hasUpdatePermission ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!hasUpdatePermission}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className={`text-red-500 hover:text-red-700 ${
                    !hasDeletePermission ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!hasDeletePermission}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="py-3 px-6">
              <select
                value={newEc.vehicle}
                onChange={(e) =>
                  setNewEc({ ...newEc, vehicle: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Vehicle</option>
                {VehicleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newEc.type}
                onChange={(e) => setNewEc({ ...newEc, type: e.target.value })}
                className="border p-1 w-full"
              >
                <option value="">Select Type</option>
                {Level2Options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newEc.fuel}
                onChange={(e) => setNewEc({ ...newEc, fuel: e.target.value })}
                className="border p-1 w-full"
              >
                <option value="">Select Fuel</option>
                {FuelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newEc.unit}
                onChange={(e) => setNewEc({ ...newEc, unit: e.target.value })}
                className="border p-1 w-full"
              >
                <option value="">Select Unit</option>
                {UnitOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newEc.distance}
                onChange={(e) =>
                  setNewEc({ ...newEc, distance: e.target.value })
                }
                placeholder="Distance (km)"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <select
                value={newEc.method}
                onChange={(e) => setNewEc({ ...newEc, method: e.target.value })}
                className="border p-1 w-full"
              >
                <option value="">Select Method</option>
                {MethodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newEc.quantityOfFuel}
                onChange={(e) =>
                  setNewEc({ ...newEc, quantityOfFuel: e.target.value })
                }
                placeholder="Quantity of Fuel"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newEc.totalNumberOfEmployees}
                onChange={(e) =>
                  setNewEc({ ...newEc, totalNumberOfEmployees: e.target.value })
                }
                placeholder="Total Number of Employees"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newEc.percentageOfEmployeesUsingModeOfTransport}
                onChange={(e) =>
                  setNewEc({
                    ...newEc,
                    percentageOfEmployeesUsingModeOfTransport: e.target.value,
                  })
                }
                placeholder="% of Employees Using Mode"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newEc.numberOfWorkingDays}
                onChange={(e) =>
                  setNewEc({ ...newEc, numberOfWorkingDays: e.target.value })
                }
                placeholder="Number of Working Days"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newEc.date}
                onChange={(date) => ({ ...newEc, date })}
                minDate={start}
                maxDate={end}
                placeholderText="Select Date"
                className="border p-1 w-full"
                showPopperArrow={false}
                renderCustomHeader={({
                  date,
                  changeYear,
                  changeMonth,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div
                    className="react-datepicker__header"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      className="react-datepicker__navigation react-datepicker__navigation--previous"
                    >
                      {"<"}
                    </button>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <div
                        className="react-datepicker__current-month"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsMonthPicker(true);
                          setIsYearPicker(false);
                        }}
                      >
                        {date.toLocaleString("default", { month: "long" })}
                      </div>
                      <div
                        className="react-datepicker__current-year"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsYearPicker(true);
                          setIsMonthPicker(false);
                        }}
                      >
                        {date.getFullYear()}
                      </div>
                    </div>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      className="react-datepicker__navigation react-datepicker__navigation--next"
                    >
                      {">"}
                    </button>
                  </div>
                )}
                showYearPicker={isYearPicker}
                showMonthYearPicker={isMonthPicker}
                onSelect={(date) => {
                  ({ ...newEc, date });
                  if (isYearPicker) {
                    setIsYearPicker(false);
                    setIsMonthPicker(true);
                  } else if (isMonthPicker) {
                    setIsMonthPicker(false);
                  }
                }}
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddEc}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                  !hasCreatePermission ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!hasCreatePermission}
              >
                {editIndex === -1 ? <FaPlus /> : <FaEdit />}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaSave className="mr-2" /> Save
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Ec;
