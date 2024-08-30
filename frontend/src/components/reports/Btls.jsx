import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

const Btls = ({ report }) => {
  const [btlsData, setBtlsData] = useState([]);
  const [newBtls, setNewBtls] = useState({
    date: null,
    vehicle: "",
    type: "",
    fuel: "",
    unit: "km",
    distance: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
    const { user } = useAuth();


  const VehicleOptions = ["Cars (by size)", "Motorbike", "Taxi",];
  const TypeOptions = [
    "Small car",
    "Medium car",
    "Large car",
    "Average car",
    "Small",
    "Medium",
    "Large",
    "Average",
    "Average taxi",
  ];
  const FuelOptions = [
    "Plug-in Hybrid Electric Vehicle",
    "Battery Electric Vehicle",
    "Diesel",
    "Petrol",
    "Hybrid",
    "Unknown",
    "CNG",
    "LPG",
  ];
  const UnitOptions = ["km"];

  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    btls = [],
  } = reportData || {};
  
  useEffect(() => {
    if (btls && Array.isArray(btls)) {
      setBtlsData(
        btls.map((item) => ({
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

  const handleAddBtls = () => {
    if (
      newBtls.date &&
      newBtls.vehicle &&
      newBtls.type &&
      newBtls.fuel &&
      newBtls.unit &&
      newBtls.distance
    ) {
      if (editIndex === -1) {
        setBtlsData([...btlsData, newBtls]);
      } else {
        const updatedBtlsData = [...btlsData];
        updatedBtlsData[editIndex] = newBtls;
        setBtlsData(updatedBtlsData);
        setEditIndex(-1);
      }
      setNewBtls({
        date: null,
        vehicle: "",
        type: "",
        fuel: "",
        unit: "km",
        distance: "",
      });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewBtls(btlsData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedBtlsData = btlsData.filter((_, i) => i !== index);
    setBtlsData(updatedBtlsData);
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
      // console.log("btlsData", btlsData);
      const response = await axios.patch(
        `/api/reports/:reportId/btls/put`,
        { btls: btlsData },
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
        toast.error("Failed to update BTLS data");
      }
    } catch (error) {
      console.error("Error saving BTLS data:", error);
      toast.error(error.response?.data?.message || "Failed to save BTLS data");
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
            <th className="py-3 px-6 text-left">Distance</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {btlsData.map((item, index) => (
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
                value={newBtls.vehicle}
                onChange={(e) =>
                  setNewBtls({ ...newBtls, vehicle: e.target.value })
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
                value={newBtls.type}
                onChange={(e) =>
                  setNewBtls({ ...newBtls, type: e.target.value })
                }
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
                value={newBtls.fuel}
                onChange={(e) =>
                  setNewBtls({ ...newBtls, fuel: e.target.value })
                }
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
                value={newBtls.unit}
                onChange={(e) =>
                  setNewBtls({ ...newBtls, unit: e.target.value })
                }
                className="border p-1 w-full"
              >
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
                value={newBtls.distance}
                onChange={(e) =>
                  setNewBtls({ ...newBtls, distance: e.target.value })
                }
                placeholder="Distance"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newBtls.date}
                onChange={(date) => setNewBtls({ ...newBtls, date })}
                minDate={start}
                maxDate={end}
                placeholderText="Select Date"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddBtls}
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

export default Btls;
