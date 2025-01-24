import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import { useAuth } from "../../context/AuthContext";

const Ula = ({ report }) => {
  const [ulaData, setUlaData] = useState([]);
  const [newUla, setNewUla] = useState({
    date: null,
    companyArea: "",
    buildingTotalArea: "",
    occupancyRate: "",
    totalEnergyUse: "",
    leasedAssetArea: "",
    totalLesorAssetsArea: "",
    floorSpace: "",
    method: "",
    scope1Emissions: "",
    scope2Emissions: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const { user } = useAuth();

  const MethodOptions = [
    "Asset-specific Method",
    "Lessor-specific Method",
    "Average-data Method",
  ];

  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    ula = [],
  } = reportData || {};

  useEffect(() => {
    if (ula && Array.isArray(ula)) {
      setUlaData(
        ula.map((item) => ({
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

  const ulaPermissions =
    user?.facilities[0]?.userRoles[0]?.permissions.find(
      (perm) => perm.entity.toLowerCase() === "ula"
    )?.actions || [];

  const hasReadPermission = ulaPermissions.includes("read");
  const hasCreatePermission = ulaPermissions.includes("create");
  const hasUpdatePermission = ulaPermissions.includes("update");
  const hasDeletePermission = ulaPermissions.includes("delete");

  const handleAddUla = () => {
    if (!hasCreatePermission) {
      toast.error("You don't have permission to create new entries");
      return;
    }

    if (newUla.date && newUla.method) {
      if (editIndex === -1) {
        setUlaData([...ulaData, newUla]);
      } else {
        const updatedUlaData = [...ulaData];
        updatedUlaData[editIndex] = newUla;
        setUlaData(updatedUlaData);
        setEditIndex(-1);
      }
      setNewUla({
        date: null,
        companyArea: "",
        buildingTotalArea: "",
        occupancyRate: "",
        totalEnergyUse: "",
        leasedAssetArea: "",
        totalLesorAssetsArea: "",
        floorSpace: "",
        method: "",
        scope1Emissions: "",
        scope2Emissions: "",
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

    setNewUla(ulaData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (!hasDeletePermission) {
      toast.error("You don't have permission to delete existing entries");
      return;
    }

    const updatedUlaData = ulaData.filter((_, i) => i !== index);
    setUlaData(updatedUlaData);
    toast.info("Click save to permanently delete", { position: "top-right" });
  };

  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `/api/reports/:reportId/ula/put`,
        { ula: ulaData },
        {
          params: { reportId, companyName, facilityName },
          headers: { Authorization: `Bearer ${user.accessToken}` },
          withCredentials: true,
        }
      );

      response.data.success
        ? toast.success(response.data.message)
        : toast.error("Failed to update ULA data");
    } catch (error) {
      console.error("Error saving ULA data:", error);
      toast.error(error.response?.data?.message || "Failed to save ULA data");
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
            <th className="py-3 px-6 text-left">Company Area</th>
            <th className="py-3 px-6 text-left">Building Total Area</th>
            <th className="py-3 px-6 text-left">Occupancy Rate</th>
            <th className="py-3 px-6 text-left">Total Energy Use</th>
            <th className="py-3 px-6 text-left">Leased Asset Area</th>
            <th className="py-3 px-6 text-left">Total Lessor Assets Area</th>
            <th className="py-3 px-6 text-left">Floor Space</th>
            <th className="py-3 px-6 text-left">Method</th>
            <th className="py-3 px-6 text-left">Scope 1 Emissions</th>
            <th className="py-3 px-6 text-left">Scope 2 Emissions</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {ulaData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">{item.companyArea}</td>
              <td className="py-3 px-6 text-left">{item.buildingTotalArea}</td>
              <td className="py-3 px-6 text-left">{item.occupancyRate}</td>
              <td className="py-3 px-6 text-left">{item.totalEnergyUse}</td>
              <td className="py-3 px-6 text-left">{item.leasedAssetArea}</td>
              <td className="py-3 px-6 text-left">
                {item.totalLesorAssetsArea}
              </td>
              <td className="py-3 px-6 text-left">{item.floorSpace}</td>
              <td className="py-3 px-6 text-left">{item.method}</td>
              <td className="py-3 px-6 text-left">{item.scope1Emissions}</td>
              <td className="py-3 px-6 text-left">{item.scope2Emissions}</td>
              <td className="py-3 px-6 text-left">
                {item.date.toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">
                <button
                  onClick={() => handleEdit(index)}
                  disabled={!hasUpdatePermission}
                >
                  <FaEdit
                    className={!hasUpdatePermission ? "opacity-50" : ""}
                  />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  disabled={!hasDeletePermission}
                >
                  <FaTrash
                    className={!hasDeletePermission ? "opacity-50" : ""}
                  />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="py-3 px-6">
              <input
                type="text"
                value={newUla.companyArea}
                onChange={(e) =>
                  setNewUla({ ...newUla, companyArea: e.target.value })
                }
                placeholder="Company Area"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="text"
                value={newUla.buildingTotalArea}
                onChange={(e) =>
                  setNewUla({ ...newUla, buildingTotalArea: e.target.value })
                }
                placeholder="Building Total Area"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="number"
                value={newUla.occupancyRate}
                onChange={(e) =>
                  setNewUla({ ...newUla, occupancyRate: e.target.value })
                }
                placeholder="Occupancy Rate"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="text"
                value={newUla.totalEnergyUse}
                onChange={(e) =>
                  setNewUla({ ...newUla, totalEnergyUse: e.target.value })
                }
                placeholder="Total Energy Use"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="text"
                value={newUla.leasedAssetArea}
                onChange={(e) =>
                  setNewUla({ ...newUla, leasedAssetArea: e.target.value })
                }
                placeholder="Leased Asset Area"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="text"
                value={newUla.totalLesorAssetsArea}
                onChange={(e) =>
                  setNewUla({ ...newUla, totalLesorAssetsArea: e.target.value })
                }
                placeholder="Total Lessor Assets Area"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="text"
                value={newUla.floorSpace}
                onChange={(e) =>
                  setNewUla({ ...newUla, floorSpace: e.target.value })
                }
                placeholder="Floor Space"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <select
                value={newUla.method}
                onChange={(e) =>
                  setNewUla({ ...newUla, method: e.target.value })
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
              <input
                type="text"
                value={newUla.scope1Emissions}
                onChange={(e) =>
                  setNewUla({ ...newUla, scope1Emissions: e.target.value })
                }
                placeholder="Scope 1 Emissions"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <input
                type="text"
                value={newUla.scope2Emissions}
                onChange={(e) =>
                  setNewUla({ ...newUla, scope2Emissions: e.target.value })
                }
                placeholder="Scope 2 Emissions"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newUla.date}
                onChange={(date) => setNewUla({ ...newUla, date })}
                minDate={start}
                maxDate={end}
                placeholderText="Select Date"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddUla}
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

export default Ula;
