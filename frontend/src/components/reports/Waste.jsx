import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Waste = ({ report }) => {
  const [wasteData, setWasteData] = useState([]);
  const [newWaste, setNewWaste] = useState({
    date: null,
    type: "",
    fuel: "",
    unit: "",
    amount: "",
  });
  const [editIndex, setEditIndex] = useState(-1);

  const typeOptions = [
    "Construction",
    "Electrical items",
    "Metal",
    "Other",
    "Paper",
    "Plastic",
    "Refuse",
  ];

  const fuelOptions = [
    "Aggregates",
    "Asbestos",
    "Asphalt",
    "Average construction",
    "Batteries",
    "Books",
    "Bricks",
    "Clothing",
    "Commercial and industrial waste",
    "Concrete",
    "Glass",
    "Household residual waste",
    "Insulation",
    "Metal: aluminium cans and foil (excl. forming)",
    "Metal: mixed cans",
    "Metal: scrap metal",
    "Metal: steel cans",
    "Metals",
    "Mineral oil",
    "Organic: food and drink waste",
    "Organic: garden waste",
    "Organic: mixed food and garden waste",
    "Paper and board: board",
    "Paper and board: mixed",
    "Paper and board: paper",
    "Plastics: average plastic film",
    "Plastics: average plastic rigid",
    "Plastics: average plastics",
    "Plastics: HDPE (incl. forming)",
    "Plastics: LDPE and LLDPE (incl. forming)",
    "Plastics: PET (incl. forming)",
    "Plastics: PP (incl. forming)",
    "Plastics: PS (incl. forming)",
    "Plastics: PVC (incl. forming)",
    "Plasterboard",
    "Soils",
    "Tyres",
    "WEEE - fridges and freezers",
    "WEEE - large",
    "WEEE - mixed",
    "WEEE - small",
    "Wood",
  ];

  const unitOptions = ["tonnes"];

  const reportData = report;
  const { companyName, facilityName, waste, reportId, timePeriod } = reportData;

  useEffect(() => {
    if (waste && Array.isArray(waste)) {
      setWasteData(
        waste.map((wasteItem) => ({
          ...wasteItem,
          date: new Date(wasteItem.date),
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

  const handleAddWaste = () => {
    if (
      newWaste.date &&
      newWaste.type &&
      newWaste.fuel &&
      newWaste.unit &&
      newWaste.amount
    ) {
      if (editIndex === -1) {
        setWasteData([...wasteData, newWaste]);
      } else {
        const updatedWasteData = [...wasteData];
        updatedWasteData[editIndex] = newWaste;
        setWasteData(updatedWasteData);
        setEditIndex(-1);
      }
      setNewWaste({ date: null, type: "", fuel: "", unit: "", amount: "" });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewWaste(wasteData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedWasteData = wasteData.filter((_, i) => i !== index);
    setWasteData(updatedWasteData);
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
      // console.log("wasteData", wasteData);
      const response = await axios.patch(
        `/api/reports/:reportId/waste/put`,
        { waste: wasteData },
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
        toast.error("Failed to update waste data");
      }
    } catch (error) {
      console.error("Error saving waste data:", error);
      toast.error(error.response?.data?.message || "Failed to save waste data");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Fuel</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {wasteData.map((waste, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">{waste.type}</td>
              <td className="py-3 px-6 text-left">{waste.fuel}</td>
              <td className="py-3 px-6 text-left">{waste.unit}</td>
              <td className="py-3 px-6 text-left">{waste.amount}</td>
              <td className="py-3 px-6 text-left">
                {waste.date.toLocaleDateString()}
              </td>
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
              <select
                value={newWaste.type}
                onChange={(e) =>
                  setNewWaste({ ...newWaste, type: e.target.value })
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
                value={newWaste.fuel}
                onChange={(e) =>
                  setNewWaste({ ...newWaste, fuel: e.target.value })
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
                value={newWaste.unit}
                onChange={(e) =>
                  setNewWaste({ ...newWaste, unit: e.target.value })
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
                value={newWaste.amount}
                onChange={(e) =>
                  setNewWaste({ ...newWaste, amount: e.target.value })
                }
                placeholder="Amount"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newWaste.date}
                onChange={(date) => setNewWaste({ ...newWaste, date })}
                minDate={start}
                maxDate={end}
                placeholderText="Select Date"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddWaste}
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

export default Waste;
