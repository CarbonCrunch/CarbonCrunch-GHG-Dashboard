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
    cost: "",
    quantity: "",
    method: " ",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [isYearPicker, setIsYearPicker] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(false);
  const { user } = useAuth();

  const VehicleOptions = ["Cars (by size)", "Motorbike", "Taxi", "Air", "Rail"];
  const TypeOptions = [
    "Small car",
    "Medium car",
    "Large car",
    "Average car",
    "Small",
    "Medium",
    "Large",
    "Air",
    "Rail",
    "Average taxi",
  ];
  const FuelOptions = [
    "Unknown",
    "All fuels",
    "Diesel",
    "Petrol",
    "Hybrid",
    "Unknown",
    "CNG",
    "LPG",
  ];
  const UnitOptions = ["km"];
  const MethodOptions = [
    "Fuel-based method",
    "Distance-based method",
    "Spend-based method",
  ];

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
          method: item.method || "Fuel-based method",
          cost: item.cost || "",
          quantity: item.quantity || "",
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

  // Check user permissions for btls entity
  const btlsPermissions =
    user?.facilities[0]?.userRoles[0]?.permissions.find(
      (perm) => perm.entity.toLowerCase() === "btls"
    )?.actions || [];

  const hasReadPermission = btlsPermissions.includes("read");
  const hasCreatePermission = btlsPermissions.includes("create");
  const hasUpdatePermission = btlsPermissions.includes("update");
  const hasDeletePermission = btlsPermissions.includes("delete");

  const handleAddBtls = () => {
    if (!hasCreatePermission) {
      toast.error("You don't have permission to create new entries");
      return;
    }

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
    if (!hasUpdatePermission) {
      toast.error("You don't have permission to update existing entries");
      return;
    }

    setNewBtls(btlsData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (!hasDeletePermission) {
      toast.error("You don't have permission to delete existing entries");
      return;
    }

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
  // console.log("bltsData", btlsData);

  const handleSave = async () => {
    try {
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
            Authorization: `Bearer ${user.accessToken}`,
          },
          withCredentials: true,
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

  if (!hasReadPermission) {
    return <p>You don't have permission to view this data.</p>;
  }

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
            <th className="py-3 px-6 text-left">Cost of transit</th>
            <th className="py-3 px-6 text-left">Quantity of fuel</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Method</th>
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
              <td className="py-3 px-6 text-left">{item.cost}</td>
              <td className="py-3 px-6 text-left">{item.quantity}</td>
              <td className="py-3 px-6 text-left">
                {item.date.toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">{item.method}</td>
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
              <input
                type="number"
                value={newBtls.cost}
                onChange={(e) =>
                  setNewBtls({ ...newBtls, cost: e.target.value })
                }
                placeholder="Cost"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newBtls.quantity}
                onChange={(e) =>
                  setNewBtls({ ...newBtls, quantity: e.target.value })
                }
                placeholder="Quantity"
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
                          setIsMonthPicker(true);
                          setIsYearPicker(false);
                        }}
                      >
                        {date.toLocaleString("default", { month: "long" })}
                      </div>
                      <div
                        className="react-datepicker__current-year"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setIsYearPicker(true);
                          setIsMonthPicker(false);
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
                showYearPicker={isYearPicker}
                showMonthYearPicker={isMonthPicker}
                onSelect={(date) => {
                  setNewBtls({ ...newBtls, date });
                  if (isYearPicker) {
                    setIsYearPicker(false);
                    setIsMonthPicker(true);
                  } else if (isMonthPicker) {
                    setIsMonthPicker(false);
                  }
                }}
              />
            </td>
            <td className="py-3 px-6">
              <select
                value={newBtls.method}
                onChange={(e) =>
                  setNewBtls({ ...newBtls, method: e.target.value })
                }
                className="border p-1 w-full"
              >
                {MethodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddBtls}
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
