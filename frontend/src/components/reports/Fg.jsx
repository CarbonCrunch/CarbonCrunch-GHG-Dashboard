import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Fg = ({ report }) => {
  const [fgData, setFgData] = useState([]);
  const [newFg, setNewFg] = useState({
    date: null,
    category: "",
    type: "",
    fuel: "",
    unit: "",
    distance: "",
    weight: "",
  });
  const [editIndex, setEditIndex] = useState(-1);

  const CategoryOptions = [
    "Vans",
    "HGV (all diesel)",
    "HGV refrigerated (all diesel)",
    "Freight flights",
    "Rail",
    "Sea tanker",
    "Cargo ship",
  ];

  const TypeOptions = [
    "Class I (up to 1.305 tonnes)",
    "Class II (1.305 to 1.74 tonnes)",
    "Class III (1.74 to 3.5 tonnes)",
    "Average (up to 3.5 tonnes)",
    "Rigid (>3.5 - 7.5 tonnes)",
    "Rigid (>7.5 tonnes-17 tonnes)",
    "Rigid (>17 tonnes)",
    "All rigids",
    "Articulated (>3.5 - 33t)",
    "Articulated (>33t)",
    "All artics",
    "All HGVs",
    "Domestic, to/from UK",
    "Short-haul, to/from UK",
    "Long-haul, to/from UK",
    "International, to/from non-UK",
    "Freight train",
    "Crude tanker",
    "Products tanker",
    "Chemical tanker",
    "LNG tanker",
    "LPG Tanker",
    "Bulk carrier",
    "General cargo",
    "Container ship",
    "Vehicle transport",
    "RoRo-Ferry",
    "Large RoPax ferry",
    "Refrigerated cargo",
  ];

  const FuelOptions = [
    "Diesel",
    "Petrol",
    "CNG",
    "LPG",
    "Unknown",
    "Plug-in Hybrid Electric Vehicle",
    "Battery Electric Vehicle",
    "Average laden",
    "With RF",
    "Without RF",
  ];

  const UnitOptions = ["tonne.km"];

  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    fg = [],
  } = reportData || {};
  useEffect(() => {
    if (fg && Array.isArray(fg)) {
      setFgData(
        fg.map((item) => ({
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

  const handleAddFg = () => {
    if (
      newFg.date &&
      newFg.category &&
      newFg.type &&
      newFg.fuel &&
      newFg.unit &&
      newFg.distance &&
      newFg.weight
    ) {
      if (editIndex === -1) {
        setFgData([...fgData, newFg]);
      } else {
        const updatedFgData = [...fgData];
        updatedFgData[editIndex] = newFg;
        setFgData(updatedFgData);
        setEditIndex(-1);
      }
      setNewFg({
        date: null,
        category: "",
        type: "",
        fuel: "",
        unit: "",
        distance: "",
        weight: "",
      });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewFg(fgData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedFgData = fgData.filter((_, i) => i !== index);
    setFgData(updatedFgData);
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
      // console.log("fgData", fgData);
      const response = await axios.patch(
        `/api/reports/:reportId/fg/put`,
        { fg: fgData },
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
        toast.error("Failed to update freight data");
      }
    } catch (error) {
      console.error("Error saving freight data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save freight data"
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Fuel</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Distance (km)</th>
            <th className="py-3 px-6 text-left">Weight (kg)</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {fgData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">
                {item.date.toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">{item.category}</td>
              <td className="py-3 px-6 text-left">{item.type}</td>
              <td className="py-3 px-6 text-left">{item.fuel}</td>
              <td className="py-3 px-6 text-left">{item.unit}</td>
              <td className="py-3 px-6 text-left">{item.distance}</td>
              <td className="py-3 px-6 text-left">{item.weight}</td>
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
                selected={newFg.date}
                onChange={(date) => setNewFg({ ...newFg, date })}
                minDate={start}
                maxDate={end}
                placeholderText="Select Date"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <select
                value={newFg.category}
                onChange={(e) =>
                  setNewFg({ ...newFg, category: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Category</option>
                {CategoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newFg.type}
                onChange={(e) => setNewFg({ ...newFg, type: e.target.value })}
                className="border p-1 w-full"
              >
                <option value="">Select Type</option>
                {TypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newFg.fuel}
                onChange={(e) => setNewFg({ ...newFg, fuel: e.target.value })}
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
                value={newFg.unit}
                onChange={(e) => setNewFg({ ...newFg, unit: e.target.value })}
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
                value={newFg.distance}
                onChange={(e) =>
                  setNewFg({ ...newFg, distance: e.target.value })
                }
                placeholder="Distance (km)"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newFg.weight}
                onChange={(e) => setNewFg({ ...newFg, weight: e.target.value })}
                placeholder="Weight (kg)"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddFg}
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

export default Fg;
