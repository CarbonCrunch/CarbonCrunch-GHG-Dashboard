import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Ec = ({ report }) => {
  const [ecData, setEcData] = useState([]);
  const [newEc, setNewEc] = useState({
    date: null,
    vehicle: "",
    type: "",
    fuel: "",
    unit: "",
    distance: "",
  });
  const [editIndex, setEditIndex] = useState(-1);

  const VehicleOptions = ["Car", "Ferry", "Motorbike", "Taxi", "Bus", "Rail"];
 const Level2Options = [
   // For Cars (by size)
   "Small car",
   "Medium car",
   "Large car",
   "Average car",

   // For Ferry
   "Foot passenger",
   "Car passenger",
   "Average (all passenger)",

   // For Motorbike
   "Small",
   "Medium",
   "Large",
   "Average",

   // For Taxis
   "Regular taxi",
   "Black cab",

   // For Bus
   "Local bus (not London)",
   "Local London bus",
   "Average local bus",
   "Coach",

   // For Rail
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
  const { companyName, facilityName, ec, reportId, timePeriod } = reportData;

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

  const handleAddEc = () => {
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
    setNewEc(ecData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
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
      // console.log("ecData", ecData);
      const response = await axios.patch(
        `/api/reports/:reportId/ec/put`,
        { ec: ecData },
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
        toast.error("Failed to update EC data");
      }
    } catch (error) {
      console.error("Error saving EC data:", error);
      toast.error(error.response?.data?.message || "Failed to save EC data");
    }
  };

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
              <DatePicker
                selected={newEc.date}
                onChange={(date) => setNewEc({ ...newEc, date })}
                minDate={start}
                maxDate={end}
                placeholderText="Select Date"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddEc}
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

export default Ec;
