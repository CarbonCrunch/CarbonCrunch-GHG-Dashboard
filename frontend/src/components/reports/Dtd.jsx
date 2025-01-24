import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import { useAuth } from "../../context/AuthContext";

const Dtd = ({ report }) => {
  const [dtdData, setDtdData] = useState([]);
  const [newDtd, setNewDtd] = useState({
    date: null,
    massOfGoodsTransported: "",
    transportDistance: "",
    transportMode: "",
    method: "",
    fuelType: "",
    fuelConsumption: "",
    financialExpenditure: "",
    numberOfTrips: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [isYearPicker, setIsYearPicker] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(false);
  const { user } = useAuth();

  const TransportModeOptions = [
    "Truck",
    "Rail",
    "Ship",
    "Air",
    "Van",
    "Cargo Plane",
    "Container Ship",
  ];
  const MethodOptions = [
    "Fuel-based Method",
    "Distance-based Method",
    "Spend-based Method",
  ];
  const FuelTypeOptions = [
    "Diesel",
    "Gasoline",
    "Natural Gas",
    "Propane",
    "Kerosene",
  ];

  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    dtd = [],
  } = reportData || {};

  useEffect(() => {
    if (dtd && Array.isArray(dtd)) {
      setDtdData(
        dtd.map((item) => ({
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

  // Permission checks
  const dtdPermissions =
    user?.facilities[0]?.userRoles[0]?.permissions.find(
      (perm) => perm.entity.toLowerCase() === "dtd"
    )?.actions || [];

  const hasReadPermission = dtdPermissions.includes("read");
  const hasCreatePermission = dtdPermissions.includes("create");
  const hasUpdatePermission = dtdPermissions.includes("update");
  const hasDeletePermission = dtdPermissions.includes("delete");

  const handleAddDtd = () => {
    if (!hasCreatePermission) {
      toast.error("You don't have permission to create new entries");
      return;
    }

    if (newDtd.date && newDtd.transportMode && newDtd.massOfGoodsTransported) {
      if (editIndex === -1) {
        setDtdData([...dtdData, newDtd]);
      } else {
        const updatedDtdData = [...dtdData];
        updatedDtdData[editIndex] = newDtd;
        setDtdData(updatedDtdData);
        setEditIndex(-1);
      }
      setNewDtd({
        date: null,
        massOfGoodsTransported: "",
        transportDistance: "",
        transportMode: "",
        fuelConsumption: "",
        financialExpenditure: "",
        numberOfTrips: "",
      });
    } else {
      toast.error("Please fill required fields");
    }
  };

  const handleEdit = (index) => {
    if (!hasUpdatePermission) {
      toast.error("You don't have permission to update existing entries");
      return;
    }

    setNewDtd(dtdData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (!hasDeletePermission) {
      toast.error("You don't have permission to delete existing entries");
      return;
    }

    const updatedDtdData = dtdData.filter((_, i) => i !== index);
    setDtdData(updatedDtdData);
    toast.info("Click save to permanently delete", { position: "top-right" });
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `/api/reports/:reportId/dtd/put`,
        { dtd: dtdData },
        {
          params: { reportId, companyName, facilityName },
          headers: { Authorization: `Bearer ${user.accessToken}` },
          withCredentials: true,
        }
      );

      response.data.success
        ? toast.success(response.data.message)
        : toast.error("Failed to update DTD data");
    } catch (error) {
      console.error("Error saving DTD data:", error);
      toast.error(error.response?.data?.message || "Failed to save DTD data");
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
            <th className="py-3 px-6 text-left">Mass of Goods (tonnes)</th>
            <th className="py-3 px-6 text-left">Transport Distance (km)</th>
            <th className="py-3 px-6 text-left">Transport Mode</th>
            <th className="py-3 px-6 text-left">Method</th>
            <th className="py-3 px-6 text-left">Fuel Type</th>
            <th className="py-3 px-6 text-left">Fuel Consumption</th>
            <th className="py-3 px-6 text-left">Financial Expenditure</th>
            <th className="py-3 px-6 text-left">Number of Trips</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {dtdData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">
                {item.massOfGoodsTransported}
              </td>
              <td className="py-3 px-6 text-left">{item.transportDistance}</td>
              <td className="py-3 px-6 text-left">{item.transportMode}</td>
              <td className="py-3 px-6 text-left">{item.method}</td>
              <td className="py-3 px-6 text-left">{item.fuelType}</td>
              <td className="py-3 px-6 text-left">{item.fuelConsumption}</td>
              <td className="py-3 px-6 text-left">
                {item.financialExpenditure}
              </td>
              <td className="py-3 px-6 text-left">{item.numberOfTrips}</td>
              <td className="py-3 px-6 text-left">
                {item.date.toLocaleDateString()}
              </td>
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
              <input
                type="number"
                value={newDtd.massOfGoodsTransported}
                onChange={(e) =>
                  setNewDtd({
                    ...newDtd,
                    massOfGoodsTransported: e.target.value,
                  })
                }
                placeholder="Mass of Goods (tonnes)"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newDtd.transportDistance}
                onChange={(e) =>
                  setNewDtd({ ...newDtd, transportDistance: e.target.value })
                }
                placeholder="Transport Distance (km)"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <select
                value={newDtd.transportMode}
                onChange={(e) =>
                  setNewDtd({ ...newDtd, transportMode: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Transport Mode</option>
                {TransportModeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newDtd.method}
                onChange={(e) =>
                  setNewDtd({ ...newDtd, method: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Method</option>
                {MethodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <select
                value={newDtd.fuelType}
                onChange={(e) =>
                  setNewDtd({ ...newDtd, fuelType: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Fuel Type</option>
                {FuelTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newDtd.fuelConsumption}
                onChange={(e) =>
                  setNewDtd({ ...newDtd, fuelConsumption: e.target.value })
                }
                placeholder="Fuel Consumption"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newDtd.financialExpenditure}
                onChange={(e) =>
                  setNewDtd({ ...newDtd, financialExpenditure: e.target.value })
                }
                placeholder="Financial Expenditure"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newDtd.numberOfTrips}
                onChange={(e) =>
                  setNewDtd({ ...newDtd, numberOfTrips: e.target.value })
                }
                placeholder="Number of Trips"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newDtd.date}
                onChange={(date) => setNewDtd({ ...newDtd, date })}
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
                  setNewDtd({ ...newDtd, date });
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
              <button
                onClick={handleAddDtd}
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

export default Dtd;
