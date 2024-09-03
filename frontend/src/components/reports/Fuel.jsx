import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

const Fuel = ({ report }) => {
  const [fuelData, setFuelData] = useState([]);
  const [newFuel, setNewFuel] = useState({
    date: null,
    type: "",
    fuelType: "",
    unit: "",
    amount: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [isYearPicker, setIsYearPicker] = useState(false); 
  const [isMonthPicker, setIsMonthPicker] = useState(false);
  const { user } = useAuth();

  const typeOptions = ["Gaseous fuels", "Liquid fuels", "Solid fuels"];
  const fuelOptions = [
    "CNG",
    "LNG",
    "LPG",
    "Natural gas",
    "Natural gas (100% mineral blend)",
    "Other petroleum gas",
    "Aviation spirit",
    "Aviation turbine fuel",
    "Burning oil",
    "Diesel (average biofuel blend)",
    "Diesel (100% mineral diesel)",
    "Fuel oil",
    "Gas oil",
    "Lubricants",
    "Naphtha",
    "Petrol (average biofuel blend)",
    "Petrol (100% mineral petrol)",
    "Processed fuel oils - residual oil",
    "Processed fuel oils - distillate oil",
    "Waste oils",
    "Marine gas oil",
    "Marine fuel oil",
    "Coal (industrial)",
    "Coal (electricity generation)",
    "Coal (domestic)",
    "Coking coal",
    "Petroleum coke",
    "Coal (electricity generation - home produced)",
  ];
  const unitOptions = ["Litres", "Tonnes", "Cubic Metre"];
  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    fuel = [],
  } = reportData || {};
  // console.log("reportData", reportData);

  useEffect(() => {
    if (Array.isArray(fuel)) {
      setFuelData(
        fuel.map((fuel) => ({
          ...fuel,
          date: new Date(fuel.date),
        }))
      );
    } else {
      // If fuel is not an array, set fuelData to an empty array
      setFuelData([]);
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

  const handleAddFuel = () => {
    if (
      newFuel.date &&
      newFuel.type &&
      newFuel.fuelType &&
      newFuel.unit &&
      newFuel.amount
    ) {
      if (editIndex === -1) {
        setFuelData([...fuelData, newFuel]);
      } else {
        const updatedFuelData = [...fuelData];
        updatedFuelData[editIndex] = newFuel;
        setFuelData(updatedFuelData);
        setEditIndex(-1);
      }
      setNewFuel({ date: null, type: "", fuelType: "", unit: "", amount: "" });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewFuel(fuelData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedFuelData = fuelData.filter((_, i) => i !== index);
    setFuelData(updatedFuelData);
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
        `/api/reports/:reportId/fuel/put`,
        { fuel: fuelData },
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
        toast.error("Failed to update fuel data");
      }
    } catch (error) {
      console.error("Error saving fuel data:", error);
      toast.error(error.response?.data?.message || "Failed to save fuel data");
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
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {fuelData.length === 0 ? (
            // Display a message when there is no data
            <p></p>
          ) : (
            fuelData.map((fuel, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">
                  {fuel.date.toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left">{fuel.type}</td>
                <td className="py-3 px-6 text-left">{fuel.fuelType}</td>
                <td className="py-3 px-6 text-left">{fuel.unit}</td>
                <td className="py-3 px-6 text-left">{fuel.amount}</td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
          <tr>
            <td className="py-3 px-6">
              <DatePicker
                selected={newFuel.date}
                onChange={(date) => setNewFuel({ ...newFuel, date })}
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
                  setNewFuel({ ...newFuel, date });
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
                value={newFuel.type}
                onChange={(e) =>
                  setNewFuel({ ...newFuel, type: e.target.value })
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
                value={newFuel.fuelType}
                onChange={(e) =>
                  setNewFuel({ ...newFuel, fuelType: e.target.value })
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
                value={newFuel.unit}
                onChange={(e) =>
                  setNewFuel({ ...newFuel, unit: e.target.value })
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
                value={newFuel.amount}
                onChange={(e) =>
                  setNewFuel({ ...newFuel, amount: e.target.value })
                }
                placeholder="Amount"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddFuel}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

export default Fuel;
