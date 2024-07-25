import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Bioenergy = ({ report }) => {
  const [bioenergyData, setBioenergyData] = useState([]);
  const [newBioenergy, setNewBioenergy] = useState({
    date: null,
    type: "",
    fuelType: "",
    unit: "",
    amount: "",
  });
  const [editIndex, setEditIndex] = useState(-1);

  const typeOptions = ["Biofuel", "Biomass", "Biogas"];
  const fuelOptions = [
    "Bioethanol",
    "Biodiesel ME",
    "Biodiesel ME (from used cooking oil)",
    "Biodiesel ME (from tallow)",
    "Wood logs",
    "Wood chips",
    "Wood pellets",
    "Grass/straw",
    "Biogas",
    "Landfill gas",
  ];
  const unitOptions = ["Litres", "Tonnes"];
  const reportData = report[0];
  const { companyName, facilityName, bioenergy, reportId, timePeriod } =
    reportData;

  useEffect(() => {
    if (bioenergy) {
      setBioenergyData(
        bioenergy.map((item) => ({
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

  const handleAddBioenergy = () => {
    if (
      newBioenergy.date &&
      newBioenergy.type &&
      newBioenergy.fuelType &&
      newBioenergy.unit &&
      newBioenergy.amount
    ) {
      if (editIndex === -1) {
        setBioenergyData([...bioenergyData, newBioenergy]);
      } else {
        const updatedBioenergyData = [...bioenergyData];
        updatedBioenergyData[editIndex] = newBioenergy;
        setBioenergyData(updatedBioenergyData);
        setEditIndex(-1);
      }
      setNewBioenergy({
        date: null,
        type: "",
        fuelType: "",
        unit: "",
        amount: "",
      });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewBioenergy(bioenergyData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedBioenergyData = bioenergyData.filter((_, i) => i !== index);
    setBioenergyData(updatedBioenergyData);
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
        `/api/reports/:reportId/bioenergy/put`,
        { bioenergy: bioenergyData },
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
        toast.error("Failed to update bioenergy data");
      }
    } catch (error) {
      console.error("Error saving bioenergy data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save bioenergy data"
      );
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
          {bioenergyData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">{item.type}</td>
              <td className="py-3 px-6 text-left">{item.fuelType}</td>
              <td className="py-3 px-6 text-left">{item.unit}</td>
              <td className="py-3 px-6 text-left">{item.amount}</td>
              <td className="py-3 px-6 text-left">
                {item.date.toLocaleDateString()}
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
                value={newBioenergy.type}
                onChange={(e) =>
                  setNewBioenergy({ ...newBioenergy, type: e.target.value })
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
                value={newBioenergy.fuelType}
                onChange={(e) =>
                  setNewBioenergy({ ...newBioenergy, fuelType: e.target.value })
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
                value={newBioenergy.unit}
                onChange={(e) =>
                  setNewBioenergy({ ...newBioenergy, unit: e.target.value })
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
                value={newBioenergy.amount}
                onChange={(e) =>
                  setNewBioenergy({ ...newBioenergy, amount: e.target.value })
                }
                placeholder="Amount"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newBioenergy.date}
                onChange={(date) => setNewBioenergy({ ...newBioenergy, date })}
                minDate={start}
                maxDate={end}
                placeholderText="Select Date"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddBioenergy}
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

export default Bioenergy;
