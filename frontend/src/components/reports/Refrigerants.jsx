import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Refrigerants = ({ report }) => {
  const [refrigerantData, setRefrigerantData] = useState([]);
  const [newRefrigerant, setNewRefrigerant] = useState({
    date: null,
    emission: "",
    unit: "",
    amount: "",
  });
  const [editIndex, setEditIndex] = useState(-1);

  const emissionOptions = [
    "Carbon dioxide",
    "Carbon tetrachloride",
    "CFC-11/R11 = trichlorofluoromethane",
    "CFC-12/R12 = dichlorodifluoromethane",
    "CFC-13",
    "CFC-113",
    "CFC-114",
    "CFC-115",
    "Dimethylether",
    "Halon-1211",
    "Halon-1301",
    "Halon-2402",
    "HCFC-21",
    "HCFC-22/R22 = chlorodifluoromethane",
    "HCFC-123",
    "HCFC-124",
    "HCFC-141b",
    "HCFC-142b",
    "HCFC-225ca",
    "HCFC-225cb",
    "HFC-23",
    "HFC-32",
    "HFC-41",
    "HFC-125",
    "HFC-134",
    "HFC-134a",
    "HFC-143",
    "HFC-143a",
    "HFC-152",
    "HFC-152a",
    "HFC-161",
    "HFC-227ea",
    "HFC-236cb",
    "HFC-236ea",
    "HFC-236fa",
    "HFC-245ca",
    "HFC-245fa",
    "HFC-365mfc",
    "HFC-43-10mee",
    "HFE-125",
    "HFE-134",
    "HFE-143a",
    "HFE-236ca12 (HG-10)",
    "HFE-245cb2",
    "HFE-245fa2",
    "HFE-254cb2",
    "HFE-338pcc13 (HG-01)",
    "HFE-347mcc3",
    "HFE-347pcf2",
    "HFE-356pcc3",
    "HFE-43-10pccc124 (H-Galden1040x)",
    "HFE-449sl (HFE-7100)",
    "HFE-569sf2 (HFE-7200)",
    "HCFE-235da2",
    "Methane",
    "Methyl bromide",
    "Methyl chloride",
    "Methyl chloroform",
    "Methylene chloride",
    "Nitrogen trifluoride",
    "Nitrous oxide",
    "Perfluorobutane (PFC-3-1-10)",
    "Perfluorocyclobutane (PFC-318)",
    "Perfluorocyclopropane",
    "Perfluoroethane (PFC-116)",
    "Perfluorohexane (PFC-5-1-14)",
    "Perfluoromethane (PFC-14)",
    "Perfluoropentane (PFC-4-1-12)",
    "Perfluoropropane (PFC-218)",
    "PFC-9-1-18",
    "PFPMIE",
    "R290 = propane",
    "R403A",
    "R404A",
    "R406A",
    "R407A",
    "R407C",
    "R407F",
    "R408A",
    "R409A",
    "R410A",
    "R502",
    "R507A",
    "R508B",
    "R600A = isobutane",
    "Sulphur hexafluoride (SF6)",
    "Trifluoromethyl sulphur pentafluoride",
  ];
  const unitOptions = ["KG"];

  const reportData = report[0];
  const { companyName, facilityName, refrigerants, reportId, timePeriod } =
    reportData;

  useEffect(() => {
    if (refrigerants) {
      setRefrigerantData(
        refrigerants.map((refrigerant) => ({
          ...refrigerant,
          date: new Date(refrigerant.date),
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

  const handleAddRefrigerant = () => {
    if (
      newRefrigerant.date &&
      newRefrigerant.emission &&
      newRefrigerant.unit &&
      newRefrigerant.amount
    ) {
      if (editIndex === -1) {
        setRefrigerantData([...refrigerantData, newRefrigerant]);
      } else {
        const updatedRefrigerantData = [...refrigerantData];
        updatedRefrigerantData[editIndex] = newRefrigerant;
        setRefrigerantData(updatedRefrigerantData);
        setEditIndex(-1);
      }
      setNewRefrigerant({ date: null, emission: "", unit: "", amount: "" });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewRefrigerant(refrigerantData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedRefrigerantData = refrigerantData.filter(
      (_, i) => i !== index
    );
    setRefrigerantData(updatedRefrigerantData);
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
        `/api/reports/:reportId/refrigerants/put`,
        { refrigerants: refrigerantData },
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
        toast.error("Failed to update refrigerant data");
      }
    } catch (error) {
      console.error("Error saving refrigerant data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save refrigerant data"
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Emission</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Amount kg</th>
            <th className="py-3 px-6 text-left">Date</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {refrigerantData.map((refrigerant, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">{refrigerant.emission}</td>
              <td className="py-3 px-6 text-left">{refrigerant.unit}</td>
              <td className="py-3 px-6 text-left">{refrigerant.amount}</td>
              <td className="py-3 px-6 text-left">
                {refrigerant.date.toLocaleDateString()}
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
                value={newRefrigerant.emission}
                onChange={(e) =>
                  setNewRefrigerant({
                    ...newRefrigerant,
                    emission: e.target.value,
                  })
                }
                className="border p-1 w-full"
              >
                <option value="">Select Emission</option>
                {emissionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </td>
            <td className="py-3 px-6">
              <select
                value={newRefrigerant.unit}
                onChange={(e) =>
                  setNewRefrigerant({ ...newRefrigerant, unit: e.target.value })
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
                value={newRefrigerant.amount}
                onChange={(e) =>
                  setNewRefrigerant({
                    ...newRefrigerant,
                    amount: e.target.value,
                  })
                }
                placeholder="Amount"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <DatePicker
                selected={newRefrigerant.date}
                onChange={(date) =>
                  setNewRefrigerant({ ...newRefrigerant, date })
                }
                minDate={start}
                maxDate={end}
                placeholderText="Select Date"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddRefrigerant}
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

export default Refrigerants;
