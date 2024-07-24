import React, { useState } from "react";
import { FaPlus, FaSave } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Fuel = ({ report }) => {
  const [fuelData, setFuelData] = useState(report.fuel || []);
  const [newFuel, setNewFuel] = useState({
    type: "",
    fuelType: "",
    unit: "",
    amount: "",
  });

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
  const reportData = Array.isArray(report) ? report[0] : report;
  const { timePeriod, reportId, companyName, facilityName } = reportData;
  

  const formatTimePeriod = () => {
    // console.log("fuel",timePeriod);
    // console.log("fuelR",report);


    if (!timePeriod || typeof timePeriod !== "object") {
      return "Invalid time period";
    }

    const { type, start, end } = timePeriod;

    switch (type) {
      case "monthly":
        return new Date(start).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
      case "quarterly":
        const quarter = Math.floor(new Date(start).getMonth() / 3) + 1;
        return `Q${quarter} ${new Date(start).getFullYear()}`;
      case "yearly":
        return new Date(start).getFullYear().toString();
      case "custom":
        return `${new Date(start).toLocaleDateString()} - ${new Date(
          end
        ).toLocaleDateString()}`;
      default:
        return "Invalid time period";
    }
  };

  const handleAddFuel = () => {
    if (newFuel.type && newFuel.fuelType && newFuel.unit && newFuel.amount) {
      setFuelData([...fuelData, newFuel]);
      setNewFuel({ type: "", fuelType: "", unit: "", amount: "" });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleSave = async () => {
    try {
        // console.log("fuelData", fuelData);
        // // console.log("report", report);
        // console.log("reportId:", reportId);
        // console.log("companyName:", companyName);
        // console.log("facilityName:", facilityName);
        
      const response = await axios.put(
        `/api/reports/:reportId/fuel/put`,
        { fuel: fuelData },
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
            <th className="py-3 px-6 text-left">Time Period</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Fuel</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Amount</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {fuelData.map((fuel, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">
                {formatTimePeriod()}
              </td>
              <td className="py-3 px-6 text-left">{fuel.type}</td>
              <td className="py-3 px-6 text-left">{fuel.fuelType}</td>
              <td className="py-3 px-6 text-left">{fuel.unit}</td>
              <td className="py-3 px-6 text-left">{fuel.amount}</td>
            </tr>
          ))}
          <tr>
            <td className="py-3 px-6 text-left">
              {formatTimePeriod()}
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
          </tr>
        </tbody>
      </table>
      <div className="mt-4 flex justify-end space-x-2">
        <button
          onClick={handleAddFuel}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Add
        </button>
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
