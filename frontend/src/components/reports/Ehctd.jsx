import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

const Ehctd = ({ report }) => {
  const [ehctdData, setEhctdData] = useState([]);
  const [newEhctd, setNewEhctd] = useState({
    date: null,
    activity: "",
    unit: "",
    amount: "",
    entity: "",
    purpose: "",
    region: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [isYearPicker, setIsYearPicker] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(false);
  const { user } = useAuth();

  const typeOptions = ["Electricity", "Heat", "Steam", "District Cooling"];
  const unitOptions = ["MWh", "Ton of refrigeration", "KG"];
  const entityOptions = ["Reporting Company", "Suppliers"];
  const purposeOptions = ["Own Use", "Resale"];
  const regionOptions = [
    "All India Average",
    "Northern",
    "Eastern",
    "Western",
    "Southern",
    "North-Eastern",
  ];
  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    ehctd = [],
  } = reportData || {};

  useEffect(() => {
    if (report && report.ehctd && Array.isArray(report.ehctd)) {
      setEhctdData(
        report.ehctd.map((item) => ({
          ...item,
          date: new Date(item.date),
        }))
      );
    } else if (report && report.ehctd) {
      setEhctdData([
        {
          ...report.ehctd,
          date: new Date(report.ehctd.date),
        },
      ]);
    } else {
      setEhctdData([]);
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

  const ehctdPermissions =
    user?.facilities[0]?.userRoles[0]?.permissions.find(
      (perm) => perm.entity.toLowerCase() === "ehctd"
    )?.actions || [];

  const hasReadPermission = ehctdPermissions.includes("read");
  const hasCreatePermission = ehctdPermissions.includes("create");
  const hasUpdatePermission = ehctdPermissions.includes("update");
  const hasDeletePermission = ehctdPermissions.includes("delete");

  const handleAddEhctd = () => {
    if (!hasCreatePermission) {
      toast.error("You don't have permission to create new entries");
      return;
    }

    if (
      newEhctd.date &&
      newEhctd.activity &&
      newEhctd.unit &&
      newEhctd.amount &&
      newEhctd.entity &&
      newEhctd.purpose &&
      newEhctd.region
    ) {
      if (editIndex === -1) {
        setEhctdData([...ehctdData, newEhctd]);
      } else {
        const updatedEhctdData = [...ehctdData];
        updatedEhctdData[editIndex] = newEhctd;
        setEhctdData(updatedEhctdData);
        setEditIndex(-1);
      }
      setNewEhctd({
        date: null,
        activity: "",
        unit: "",
        amount: "",
        entity: "",
        purpose: "",
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

    setNewEhctd(ehctdData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (!hasDeletePermission) {
      toast.error("You don't have permission to delete existing entries");
      return;
    }

    const updatedEhctdData = ehctdData.filter((_, i) => i !== index);
    setEhctdData(updatedEhctdData);
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
        `/api/reports/:reportId/ehctd/put`,
        { ehctd: ehctdData },
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
        toast.error("Failed to update EHCTD data");
      }
    } catch (error) {
      console.error("Error saving EHCTD data:", error);
      toast.error(error.response?.data?.message || "Failed to save EHCTD data");
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
            <th className="py-3 px-6 text-left">Activity</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Entity</th>
            <th className="py-3 px-6 text-left">Region</th>
            <th className="py-3 px-6 text-left">Purpose</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {ehctdData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">{item.activity}</td>
              <td className="py-3 px-6 text-left">{item.unit}</td>
              <td className="py-3 px-6 text-left">{item.amount}</td>
              <td className="py-3 px-6 text-left">
                {item.date.toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">{item.entity}</td>
              <td className="py-3 px-6 text-left">{item.region}</td>

              <td className="py-3 px-6 text-left">{item.purpose}</td>
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
                value={newEhctd.activity}
                onChange={(e) =>
                  setNewEhctd({ ...newEhctd, activity: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Activity</option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newEhctd.unit}
                onChange={(e) =>
                  setNewEhctd({ ...newEhctd, unit: e.target.value })
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
                value={newEhctd.amount}
                onChange={(e) =>
                  setNewEhctd({ ...newEhctd, amount: e.target.value })
                }
                placeholder="Amount"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newEhctd.date}
                onChange={(date) => setNewEhctd({ ...newEhctd, date })}
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
                  setNewEhctd({ ...newEhctd, date });
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
                value={newEhctd.entity}
                onChange={(e) =>
                  setNewEhctd({ ...newEhctd, entity: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Entity</option>
                {entityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newEhctd.region}
                onChange={(e) =>
                  setNewEhctd({ ...newEhctd, region: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Region</option>
                {regionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newEhctd.purpose}
                onChange={(e) =>
                  setNewEhctd({ ...newEhctd, purpose: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Purpose</option>
                {purposeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddEhctd}
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

export default Ehctd;
