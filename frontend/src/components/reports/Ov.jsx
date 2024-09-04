import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

const Ov = ({ report }) => {
  const [ovData, setOvData] = useState([]);
  const [newOv, setNewOv] = useState({
    date: null,
    level1: "",
    level2: "",
    level3: "",
    fuel: "",
    unit: "",
    distance: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [isYearPicker, setIsYearPicker] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(false);
  const { user } = useAuth();

  const permissions = user?.facilities?.[0]?.userRoles?.find(
    (role) => role.username === user.username
  )?.permissions;

  const ownedVehiclesPermissions = permissions?.find(
    (perm) => perm.entity.toLowerCase() === "ownedvehicles"
  );

  const hasReadPermission = ownedVehiclesPermissions?.actions?.includes("read");
  const hasCreatePermission =
    ownedVehiclesPermissions?.actions?.includes("create");
  const hasUpdatePermission =
    ownedVehiclesPermissions?.actions?.includes("update");
  const hasDeletePermission =
    ownedVehiclesPermissions?.actions?.includes("delete");

  // If no read permission, display a message
  if (!hasReadPermission) {
    return <p>You do not have permission to view this data.</p>;
  }

  const Level1Options = ["Passenger vehicles", "Delivery vehicles"];
  const Level2Options = ["Cars (by size)", "Motorbikes", "Vans"];
  const Level3Options = [
    "Small car",
    "Medium car",
    "Large car",
    "Small",
    "Medium",
    "Large",
    "Large van",
    "Medium van",
    "Small van",
  ];
  const FuelOptions = [
    "Plug-in Hybrid Electric Vehicle",
    "Battery Electric Vehicle",
    "Diesel",
    "Petrol",
    "Hybrid",
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
    ownedVehicles = [],
  } = reportData || {};
  useEffect(() => {
    if (ownedVehicles) {
      setOvData(
        ownedVehicles.map((item) => ({
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

  const handleAddOv = () => {
    if (
      newOv.date &&
      newOv.level1 &&
      newOv.level2 &&
      newOv.level3 &&
      newOv.fuel &&
      newOv.unit &&
      newOv.distance
    ) {
      if (editIndex === -1) {
        setOvData([...ovData, newOv]);
      } else {
        const updatedOvData = [...ovData];
        updatedOvData[editIndex] = newOv;
        setOvData(updatedOvData);
        setEditIndex(-1);
      }
      setNewOv({
        date: null,
        level1: "",
        level2: "",
        level3: "",
        fuel: "",
        unit: "",
        distance: "",
      });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewOv(ovData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedOvData = ovData.filter((_, i) => i !== index);
    setOvData(updatedOvData);
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
    // console.log("ovData", ovData);
    try {
      const response = await axios.patch(
        `/api/reports/:reportId/owned-vehicles/put`,
        { ownedVehicles: ovData },
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
        toast.error("Failed to update owned vehicles data");
      }
    } catch (error) {
      console.error("Error saving owned vehicles data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save owned vehicles data"
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Level 1</th>
            <th className="py-3 px-6 text-left">Level 2</th>
            <th className="py-3 px-6 text-left">Level 3</th>
            <th className="py-3 px-6 text-left">Fuel</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Distance (km)</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {ovData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">
                {item.date.toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">{item.level1}</td>
              <td className="py-3 px-6 text-left">{item.level2}</td>
              <td className="py-3 px-6 text-left">{item.level3}</td>
              <td className="py-3 px-6 text-left">{item.fuel}</td>
              <td className="py-3 px-6 text-left">{item.unit}</td>
              <td className="py-3 px-6 text-left">{item.distance}</td>
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
              <DatePicker
                selected={newOv.date}
                onChange={(date) => setNewOv({ ...newOv, date })}
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
                  setNewOv({ ...newOv, date });
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
                value={newOv.level1}
                onChange={(e) => setNewOv({ ...newOv, level1: e.target.value })}
                className="border p-1 w-full"
              >
                <option value="">Select Level 1</option>
                {Level1Options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newOv.level2}
                onChange={(e) => setNewOv({ ...newOv, level2: e.target.value })}
                className="border p-1 w-full"
              >
                <option value="">Select Level 2</option>
                {Level2Options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newOv.level3}
                onChange={(e) => setNewOv({ ...newOv, level3: e.target.value })}
                className="border p-1 w-full"
              >
                <option value="">Select Level 3</option>
                {Level3Options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newOv.fuel}
                onChange={(e) => setNewOv({ ...newOv, fuel: e.target.value })}
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
                value={newOv.unit}
                onChange={(e) => setNewOv({ ...newOv, unit: e.target.value })}
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
                value={newOv.distance}
                onChange={(e) =>
                  setNewOv({ ...newOv, distance: e.target.value })
                }
                placeholder="Distance (km)"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddOv}
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
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center ${
            !hasCreatePermission && !hasUpdatePermission
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!hasCreatePermission && !hasUpdatePermission}
        >
          <FaSave className="mr-2" /> Save
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Ov;
