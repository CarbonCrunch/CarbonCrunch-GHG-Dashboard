import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Ehctd = ({ report }) => {
  const [ehctdData, setEhctdData] = useState([]);
  const [newEhctd, setNewEhctd] = useState({
    date: null,
    activity: "",
    unit: "",
    amount: "",
  });
  const [editIndex, setEditIndex] = useState(-1);

  const typeOptions = [
    "Electricity",
    "Heating and Steam",
    "District Cooling",
  ];
  const unitOptions = ["kWh", "Ton of refrigeration", "KG"];

  const reportData = report[0];
  const { companyName, facilityName, ehctd, reportId, timePeriod } = reportData;

  useEffect(() => {
    console.log("reportData", reportData);
    console.log("ehctd", ehctd);
    if (report && report.ehctd && Array.isArray(report.ehctd)) {
      setEhctdData(
        report.ehctd.map((item) => ({
          ...item,
          date: new Date(item.date),
        }))
      );
    } else if (report && report.ehctd) {
      // If ehctd is not an array, but exists, wrap it in an array
      setEhctdData([
        {
          ...report.ehctd,
          date: new Date(report.ehctd.date),
        },
      ]);
    } else {
      // If there's no ehctd data, set an empty array
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

  const handleAddEhctd = () => {
    if (
      newEhctd.date &&
      newEhctd.activity &&
      newEhctd.unit &&
      newEhctd.amount
    ) {
      if (editIndex === -1) {
        setEhctdData([...ehctdData, newEhctd]);
      } else {
        const updatedEhctdData = [...ehctdData];
        updatedEhctdData[editIndex] = newEhctd;
        setEhctdData(updatedEhctdData);
        setEditIndex(-1);
      }
      setNewEhctd({ date: null, activity: "", unit: "", amount: "" });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewEhctd(ehctdData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
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
      // console.log("ehctdData", ehctdData);
      const response = await axios.patch(
        `/api/reports/:reportId/ehctd/put`,
        { ehctd: ehctdData },
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
        toast.error("Failed to update EHCTD data");
      }
    } catch (error) {
      console.error("Error saving EHCTD data:", error);
      toast.error(error.response?.data?.message || "Failed to save EHCTD data");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Activity</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Date</th>
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
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddEhctd}
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

export default Ehctd;
