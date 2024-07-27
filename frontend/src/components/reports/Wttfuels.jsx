import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const reportData = report[0];
  const { companyName, facilityName, wttfuel, reportId, timePeriod } =
    reportData;


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

export default Wttfuels;
