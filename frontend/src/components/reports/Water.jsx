import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

const Water = ({ report }) => {
  const [waterData, setWaterData] = useState([]);
  const [newWater, setNewWater] = useState({
    date: null,
    emission: "",
    unit: "cubic meter",
    amount: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
    const [isYearPicker, setIsYearPicker] = useState(false);
    const [isMonthPicker, setIsMonthPicker] = useState(false);
    const { user } = useAuth();

    const permissions = user?.facilities?.[0]?.userRoles?.find(
      (role) => role.username === user.username
    )?.permissions;

    const waterPermissions = permissions?.find(
      (perm) => perm.entity.toLowerCase() === "water"
    );

    const hasReadPermission = waterPermissions?.actions?.includes("read");
    const hasCreatePermission = waterPermissions?.actions?.includes("create");
    const hasUpdatePermission = waterPermissions?.actions?.includes("update");
    const hasDeletePermission = waterPermissions?.actions?.includes("delete");

    // If no read permission, display a message
    if (!hasReadPermission) {
      return <p>You do not have permission to view this data.</p>;
    }

  const emissionOptions = ["Water Supply", "Water Treatment"];
  const unitOptions = ["cubic meter"];
  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    water = [],
  } = reportData || {};
  useEffect(() => {
    if (water && Array.isArray(water)) {
      setWaterData(
        water.map((water) => ({
          ...water,
          date: new Date(water.date),
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

  const handleAddWater = () => {
    if (
      newWater.date &&
      newWater.emission &&
      newWater.unit &&
      newWater.amount
    ) {
      if (editIndex === -1) {
        setWaterData([...waterData, newWater]);
      } else {
        const updatedWaterData = [...waterData];
        updatedWaterData[editIndex] = newWater;
        setWaterData(updatedWaterData);
        setEditIndex(-1);
      }
      setNewWater({
        date: null,
        emission: "",
        unit: "cubic meter",
        amount: "",
      });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewWater(waterData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedWaterData = waterData.filter((_, i) => i !== index);
    setWaterData(updatedWaterData);
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
      // console.log("waterData", waterData);
      const response = await axios.patch(
        `/api/reports/:reportId/water/put`,
        { water: waterData },
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
        toast.error("Failed to update water data");
      }
    } catch (error) {
      console.error("Error saving water data:", error);
      toast.error(error.response?.data?.message || "Failed to save water data");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Emission</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Amount (kg)</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {waterData.map((water, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">
                {water.date.toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">{water.emission}</td>
              <td className="py-3 px-6 text-left">{water.unit}</td>
              <td className="py-3 px-6 text-left">{water.amount}</td>
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
                selected={newWater.date}
                onChange={(date) => setNewWater({ ...newWater, date })}
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
                  setNewWater({ ...newWater, date });
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
                value={newWater.emission}
                onChange={(e) =>
                  setNewWater({ ...newWater, emission: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Emission</option>
                {emissionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newWater.unit}
                onChange={(e) =>
                  setNewWater({ ...newWater, unit: e.target.value })
                }
                className="border p-1 w-full"
              >
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
                value={newWater.amount}
                onChange={(e) =>
                  setNewWater({ ...newWater, amount: e.target.value })
                }
                placeholder="Amount (kg)"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddWater}
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

export default Water;
