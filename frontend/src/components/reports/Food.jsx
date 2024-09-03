import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../context/AuthContext";

const Food = ({ report }) => {
  const [foodData, setFoodData] = useState([]);
  const [newFood, setNewFood] = useState({
    date: null,
    type: "",
    fuel: "",
    unit: "",
    amount: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
    const [isYearPicker, setIsYearPicker] = useState(false);
    const [isMonthPicker, setIsMonthPicker] = useState(false);
  const { user } = useAuth();

  const FuelOptions = [
    "1 standard breakfast",
    "1 gourmet breakfast",
    "1 cold or hot snack",
    "1 average meal",
    "Non-alcoholic beverage",
    "Alcoholic beverage",
    "1 hot snack (burger + fries)",
    "1 sandwich",
    "Meal, vegan",
    "Meal, vegetarian",
    "Meal, with beef",
    "Meal, with chicken",
  ];

  const UnitOptions = ["breakfast", "hot snack", "meal", "litre", "sandwich"];

  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    timePeriod = {},
    food = [],
  } = reportData || {};
  useEffect(() => {
    if (food && Array.isArray(food)) {
      setFoodData(
        food.map((item) => ({
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

  const handleAddFood = () => {
    if (newFood.date && newFood.fuel && newFood.unit && newFood.amount) {
      if (editIndex === -1) {
        setFoodData([...foodData, newFood]);
      } else {
        const updatedFoodData = [...foodData];
        updatedFoodData[editIndex] = newFood;
        setFoodData(updatedFoodData);
        setEditIndex(-1);
      }
      setNewFood({ date: null, fuel: "", unit: "", amount: "" });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index) => {
    setNewFood(foodData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedFoodData = foodData.filter((_, i) => i !== index);
    setFoodData(updatedFoodData);
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
      console.log("foodData", foodData);
      const response = await axios.patch(
        `/api/reports/:reportId/food/put`,
        { food: foodData },
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
        toast.error("Failed to update food data");
      }
    } catch (error) {
      console.error("Error saving food data:", error);
      toast.error(error.response?.data?.message || "Failed to save food data");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Date</th>
            {/* <th className="py-3 px-6 text-left">Type</th> */}
            <th className="py-3 px-6 text-left">Fuel</th>
            <th className="py-3 px-6 text-left">Unit</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {foodData.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left">
                {item.date.toLocaleDateString()}
              </td>
              {/* <td className="py-3 px-6 text-left">{item.type}</td> */}
              <td className="py-3 px-6 text-left">{item.fuel}</td>
              <td className="py-3 px-6 text-left">{item.unit}</td>
              <td className="py-3 px-6 text-left">{item.amount}</td>
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
              <DatePicker
                selected={newFood.date}
                onChange={(date) => setNewFood({ ...newFood, date })}
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
                  setNewFood({ ...newFood, date });
                  if (isYearPicker) {
                    setIsYearPicker(false); // Switch to date picker after selecting a year
                    setIsMonthPicker(true); // Show month picker after selecting a year
                  } else if (isMonthPicker) {
                    setIsMonthPicker(false); // Switch to date picker after selecting a month
                  }
                }}
              />
            </td>
            {/* <td className="py-3 px-6">
              <input
                type="text"
                value={newFood.type}
                onChange={(e) =>
                  setNewFood({ ...newFood, type: e.target.value })
                }
                placeholder="Type"
                className="border p-1 w-full"
              />
            </td> */}
            <td className="py-3 px-6">
              <select
                value={newFood.fuel}
                onChange={(e) =>
                  setNewFood({ ...newFood, fuel: e.target.value })
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
                value={newFood.unit}
                onChange={(e) =>
                  setNewFood({ ...newFood, unit: e.target.value })
                }
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
                value={newFood.amount}
                onChange={(e) =>
                  setNewFood({ ...newFood, amount: e.target.value })
                }
                placeholder="Amount"
                className="border p-1 w-full"
              />
            </td>
            <td className="py-3 px-6">
              <button
                onClick={handleAddFood}
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

export default Food;
