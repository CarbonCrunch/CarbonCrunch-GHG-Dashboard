import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

const Wttfuels = ({ report }) => {
  const [wttfuelsData, setWttfuelsData] = useState([]);
  const [newWttfuel, setNewWttfuel] = useState({
    date: null,
    type: "",
    fuel: "",
    unit: "",
    amount: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
    const [isYearPicker, setIsYearPicker] = useState(false);
    const [isMonthPicker, setIsMonthPicker] = useState(false);
  const { user } = useAuth();

  const permissions = user?.facilities?.[0]?.userRoles?.find(
    (role) => role.username === user.username
  )?.permissions;

  const wttfuelPermissions = permissions?.find(
    (perm) => perm.entity.toLowerCase() === "wttfuel"
  );

  const hasReadPermission = wttfuelPermissions?.actions?.includes("read");
  const hasCreatePermission = wttfuelPermissions?.actions?.includes("create");
  const hasUpdatePermission = wttfuelPermissions?.actions?.includes("update");
  const hasDeletePermission = wttfuelPermissions?.actions?.includes("delete");

  // If no read permission, display a message
  if (!hasReadPermission) {
    return <p>You do not have permission to view this data.</p>;
  }

  const typeOptions = ["WTT- gaseous fuels", "WTT- liquid fuels"];
  const fuelOptions = [
    "Butane",
    "CNG",
    "LNG",
    "LPG",
    "Natural Gas",
    "Other Petroleum Gas",
    "Propane",
    "Aviation Spirit",
    "Aviation Turbine Fuel",
    "Burning Oil",
    "Diesel (average biofuel blend)",
    "Diesel (100% mineral diesel)",
    "Fuel Oil",
    "Gas Oil",
    "Lubricants",
    "Naphtha",
    "Petrol (average biofuel blend)",
    "Petrol (100% mineral petrol)",
    "Processed fuel oils - residual oil",
    "Processed fuel oils - distillate oil",
    "Refinery Miscellaneous",
    "Waste oils",
    "Marine gas oil",
    "Marine fuel oil",
    "Natural gas (100% mineral blend)",
  ];
  const unitOptions = ["litres", "cubic metres"];
  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    wttfuel = [],
  } = reportData || {};

  useEffect(() => {
    if (wttfuel && Array.isArray(wttfuel)) {
      setWttfuelsData(
        wttfuel.map((wttfuel) => ({
          ...wttfuel,
          date: new Date(wttfuel.date),
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

  const handleAddWttfuel = () => {
    if (
      newWttfuel.date &&
      newWttfuel.type &&
      newWttfuel.fuel &&
      newWttfuel.unit &&
      newWttfuel.amount
    ) {
      if (editIndex === -1) {
        setWttfuelsData([...wttfuelsData, newWttfuel]);
      } else {
        const updatedWttfuelsData = [...wttfuelsData];
        updatedWttfuelsData[editIndex] = newWttfuel;
        setWttfuelsData(updatedWttfuelsData);
        setEditIndex(-1);
      }
      setNewWttfuel({ date: null, type: "", fuel: "", unit: "", amount: "" });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewWttfuel(wttfuelsData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedWttfuelsData = wttfuelsData.filter((_, i) => i !== index);
    setWttfuelsData(updatedWttfuelsData);
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
      // console.log("wttfuelsData", wttfuelsData);
      const response = await axios.patch(
        `/api/reports/:reportId/wtt-fuels/put`,
        { wttfuel: wttfuelsData },
        {
          params: {
            reportId,
            companyName,
            facilityName,
          },
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
          },
          withCredentials: true, // Ensure cookies are sent
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update WTT fuels data");
      }
    } catch (error) {
      console.error("Error saving WTT fuels data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save WTT fuels data"
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Fuel</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {wttfuelsData.map((wttfuel, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">
                {wttfuel.date.toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">{wttfuel.type}</td>
              <td className="py-3 px-6 text-left">{wttfuel.fuel}</td>
              <td className="py-3 px-6 text-left">{wttfuel.unit}</td>
              <td className="py-3 px-6 text-left">{wttfuel.amount}</td>
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
              <DatePicker
                selected={newWttfuel.date}
                onChange={(date) => setNewWttfuel({ ...newWttfuel, date })}
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
                          setIsMonthPicker(true); // Show month picker when month is clicked
                          setIsYearPicker(false); // Hide year picker
                        }}
                      >
                        {date.toLocaleString("default", { month: "long" })}
                      </div>
                      <div
                        className="react-datepicker__current-year"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsYearPicker(true); // Show year picker when year is clicked
                          setIsMonthPicker(false); // Hide month picker
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
                showYearPicker={isYearPicker} // Show only year picker if isYearPicker is true
                showMonthYearPicker={isMonthPicker} // Show month picker if isMonthPicker is true
                onSelect={(date) => {
                  setNewWttfuel({ ...newWttfuel, date });
                  if (isYearPicker) {
                    setIsYearPicker(false); // Switch to date picker after selecting a year
                    setIsMonthPicker(true); // Show month picker after selecting a year
                  } else if (isMonthPicker) {
                    setIsMonthPicker(false); // Switch to date picker after selecting a month
                  }
                }}
              />
            </td>
            <td className="py-3 px-6">
              <select
                value={newWttfuel.type}
                onChange={(e) =>
                  setNewWttfuel({ ...newWttfuel, type: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Type</option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newWttfuel.fuel}
                onChange={(e) =>
                  setNewWttfuel({ ...newWttfuel, fuel: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Fuel</option>
                {fuelOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newWttfuel.unit}
                onChange={(e) =>
                  setNewWttfuel({ ...newWttfuel, unit: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Unit</option>
                {unitOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newWttfuel.amount}
                onChange={(e) =>
                  setNewWttfuel({ ...newWttfuel, amount: e.target.value })
                }
                placeholder="Amount"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddWttfuel}
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
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center ${
            !hasCreatePermission && !hasUpdatePermission
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!hasCreatePermission && !hasUpdatePermission}
        >
          <FaSave className="mr-2" /> Save
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Wttfuels;
