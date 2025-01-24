import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

const Utd = ({ report }) => {
  const [utdData, setutdData] = useState([]);
  const [newUtd, setnewUtd] = useState({
    date: null,
    type: "",
    utd: "",
    unit: "",
    amount: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [isYearPicker, setIsYearPicker] = useState(false);
  const [isMonthPicker, setIsMonthPicker] = useState(false);
  const { user } = useAuth();

  const typeOptions = ["Electricity"];
  const utdOptions = [
    "Carbon dioxide",
    // ... (full list of utds as provided)
    "Methane",
    // ... other utds
  ];
  const unitOptions = ["KG"];

  const permissions = user?.facilities?.[0]?.userRoles?.find(
    (role) => role.username === user.username
  )?.permissions;

  const utdsPermissions = permissions?.find(
    (perm) => perm.entity.toLowerCase() === "utd"
  );

  const hasReadPermission = utdsPermissions?.actions?.includes("read");
  const hasCreatePermission = utdsPermissions?.actions?.includes("create");
  const hasUpdatePermission = utdsPermissions?.actions?.includes("update");
  const hasDeletePermission = utdsPermissions?.actions?.includes("delete");

  // If no read permission, display a message
  if (!hasReadPermission) {
    return <p>You do not have permission to view this data.</p>;
  }

  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    utd = [],
  } = reportData || {};

  useEffect(() => {
    if (Array.isArray(utd)) {
      setutdData(
        utd.map((emission) => ({
          ...emission,
          date: new Date(emission.date),
        }))
      );
    } else {
      // If utd is not an array, set utdData to an empty array
      setutdData([]);
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

  const handleAddUtd = () => {
    if (
      newUtd.date &&
      newUtd.type &&
      newUtd.utd &&
      newUtd.unit &&
      newUtd.amount
    ) {
      if (editIndex === -1) {
        setutdData([...utdData, newUtd]);
      } else {
        const updatedutdData = [...utdData];
        updatedutdData[editIndex] = newUtd;
        setutdData(updatedutdData);
        setEditIndex(-1);
      }
      setnewUtd({
        date: null,
        type: "",
        utd: "",
        unit: "",
        amount: "",
      });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setnewUtd(utdData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedutdData = utdData.filter((_, i) => i !== index);
    setutdData(updatedutdData);
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
        `/api/reports/:reportId/utd/put`,
        { utd: utdData },
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
        toast.error("Failed to update utd data");
      }
    } catch (error) {
      console.error("Error saving utd data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save utd data"
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">UTD</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {utdData.length === 0 ? (
            <p></p>
          ) : (
            utdData.map((emission, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{emission.type}</td>
                <td className="py-3 px-6 text-left">{emission.utd}</td>
                <td className="py-3 px-6 text-left">{emission.unit}</td>
                <td className="py-3 px-6 text-left">{emission.amount}</td>
                <td className="py-3 px-6 text-left">
                  {emission.date.toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleEdit(index)}
                    className={`text-blue-500 hover:text-blue-700 mr-2 ${
                      !hasUpdatePermission
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!hasUpdatePermission}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className={`text-red-500 hover:text-red-700 ${
                      !hasDeletePermission
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!hasDeletePermission}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
          <tr>
            <td className="py-3 px-6">
              <select
                value={newUtd.type}
                onChange={(e) =>
                  setnewUtd({ ...newUtd, type: e.target.value })
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
                value={newUtd.utd}
                onChange={(e) =>
                  setnewUtd({ ...newUtd, utd: e.target.value })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Emission</option>
                {utdOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newUtd.unit}
                onChange={(e) =>
                  setnewUtd({ ...newUtd, unit: e.target.value })
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
                value={newUtd.amount}
                onChange={(e) =>
                  setnewUtd({ ...newUtd, amount: e.target.value })
                }
                placeholder="Amount"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newUtd.date}
                onChange={(date) => setnewUtd({ ...newUtd, date })}
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
                  setnewUtd({ ...newUtd, date });
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
                onClick={handleAddUtd}
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

export default Utd;
