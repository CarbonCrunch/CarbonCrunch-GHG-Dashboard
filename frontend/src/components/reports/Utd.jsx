import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import { useAuth } from "../../context/AuthContext";

const Utd = ({ report }) => {
  const [utdData, setUtdData] = useState([]);
  const [newUtd, setNewUtd] = useState({
    date: null,
    method: "",
    fuelType: "",
    electricityType: "",
    refrigerantType: "",
    distance: "",
    transportMode: "",
    totalMassTransported: "",
    cost: "",
    reportingCompanyMass: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const { user } = useAuth();

  const MethodOptions = [
    "Fuel-based Method",
    "Distance-based Method",
    "Spend-based Method",
  ];
  const TransportModeOptions = ["Truck", "Rail", "Ship", "Air"];

  const FuelTypeOptions = [
    "Diesel",
    "Gasoline",
    "Jet Fuel",
    "Biodiesel",
    "Ethanol",
    "Hydrogen",
    "Natural Gas",
  ];

  const ElectricityTypeOptions = [
    "Grid Electricity",
    "Renewable",
    "Coal-based",
    "Natural Gas",
    "Nuclear",
  ];

  const RefrigerantTypeOptions = [
    "R-22",
    "R-134a",
    "R-404A",
    "R-410A",
    // "Natural Refrigerants",
  ];

  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    _id = "",
    timePeriod = {},
    utd = [],
  } = reportData || {};
  //   reportId = _id;

  //   console.log("user", reportData, _id);
  useEffect(() => {
    if (utd && Array.isArray(utd)) {
      setUtdData(
        utd.map((item) => ({
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

  // Permission checks (similar to previous implementation)
  const utdPermissions =
    user?.facilities[0]?.userRoles[0]?.permissions.find(
      (perm) => perm.entity.toLowerCase() === "utd"
    )?.actions || [];

  const hasReadPermission = utdPermissions.includes("read");
  const hasCreatePermission = utdPermissions.includes("create");
  const hasUpdatePermission = utdPermissions.includes("update");
  const hasDeletePermission = utdPermissions.includes("delete");

  const handleAddUtd = () => {
    if (!hasCreatePermission) {
      toast.error("You don't have permission to create new entries");
      return;
    }

    if (newUtd.date && newUtd.method) {
      if (editIndex === -1) {
        setUtdData([...utdData, newUtd]);
      } else {
        const updatedUtdData = [...utdData];
        updatedUtdData[editIndex] = newUtd;
        setUtdData(updatedUtdData);
        setEditIndex(-1);
      }
      setNewUtd({
        date: null,
        method: "",
        fuelType: "",
        electricityType: "",
        refrigerantType: "",
        distance: "",
        massOfGoods: "",
        totalMassTransported: "",
        cost: "",
        reportingCompanyMass: "",
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

    setNewUtd(utdData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (!hasDeletePermission) {
      toast.error("You don't have permission to delete existing entries");
      return;
    }

    const updatedUtdData = utdData.filter((_, i) => i !== index);
    setUtdData(updatedUtdData);
    toast.info("Click save to permanently delete", { position: "top-right" });
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `/api/reports/:reportId/utd/put`,
        { utd: utdData },
        {
          params: { reportId, companyName, facilityName },
          headers: { Authorization: `Bearer ${user.accessToken}` },
          withCredentials: true,
        }
      );

      response.data.success
        ? toast.success(response.data.message)
        : toast.error("Failed to update UTD data");
    } catch (error) {
      console.error("Error saving UTD data:", error);
      toast.error(error.response?.data?.message || "Failed to save UTD data");
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
            <th className="py-3 px-6 text-left">Method</th>
            <th className="py-3 px-6 text-left">Fuel Type</th>
            <th className="py-3 px-6 text-left">Electricity Type</th>
            <th className="py-3 px-6 text-left">Refrigerant Type</th>
            <th className="py-3 px-6 text-left">Distance (km)</th>
            <th className="py-3 px-6 text-left">Transport Mode</th>
            <th className="py-3 px-6 text-left">Total Mass Transported</th>
            <th className="py-3 px-6 text-left">Cost</th>
            <th className="py-3 px-6 text-left">Reporting Company Mass</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {utdData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">{item.method}</td>
              <td className="py-3 px-6 text-left">{item.fuelType}</td>
              <td className="py-3 px-6 text-left">{item.electricityType}</td>
              <td className="py-3 px-6 text-left">{item.refrigerantType}</td>
              <td className="py-3 px-6 text-left">{item.distance}</td>
              <td className="py-3 px-6 text-left">{item.transportMode}</td>
              <td className="py-3 px-6 text-left">
                {item.totalMassTransported}
              </td>
              <td className="py-3 px-6 text-left">{item.cost}</td>
              <td className="py-3 px-6 text-left">
                {item.reportingCompanyMass}
              </td>
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
              <select
                value={newUtd.method}
                onChange={(e) =>
                  setNewUtd({ ...newUtd, method: e.target.value })
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
            <td className="py-3 px-6">
              <select
                value={newUtd.fuelType}
                onChange={(e) =>
                  setNewUtd({ ...newUtd, fuelType: e.target.value })
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
              <select
                value={newUtd.electricityType}
                onChange={(e) =>
                  setNewUtd({ ...newUtd, electricityType: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Electricity Type</option>
                {ElectricityTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newUtd.refrigerantType}
                onChange={(e) =>
                  setNewUtd({ ...newUtd, refrigerantType: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Refrigerant Type</option>
                {RefrigerantTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newUtd.distance}
                onChange={(e) =>
                  setNewUtd({ ...newUtd, distance: e.target.value })
                }
                placeholder="Distance (km)"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <select
                value={newUtd.transportMode}
                onChange={(e) =>
                  setNewUtd({ ...newUtd, transportMode: e.target.value })
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
              <input
                type="number"
                value={newUtd.totalMassTransported}
                onChange={(e) =>
                  setNewUtd({ ...newUtd, totalMassTransported: e.target.value })
                }
                placeholder="Total Mass Transported"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newUtd.cost}
                onChange={(e) => setNewUtd({ ...newUtd, cost: e.target.value })}
                placeholder="Cost"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newUtd.reportingCompanyMass}
                onChange={(e) =>
                  setNewUtd({ ...newUtd, reportingCompanyMass: e.target.value })
                }
                placeholder="Reporting Company Mass"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newUtd.date}
                onChange={(date) => setNewUtd({ ...newUtd, date })}
                minDate={start}
                maxDate={end}
                placeholderText="Select Date"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddUtd}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                  !hasCreatePermission ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!hasCreatePermission}
              >
                {editIndex === -1 ? <FaPlus /> : <FaEdit />}
              </button>
            </td>
          </tr>{" "}
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

export default Utd;
