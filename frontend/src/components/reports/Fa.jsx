import React, { useState, useEffect } from "react";
import { FaPlus, FaSave, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Fa = ({ report }) => {
  const [hotelData, setHotelData] = useState([]);
  const [flightData, setFlightData] = useState([]);
  const [newHotel, setNewHotel] = useState({
    occupiedRooms: "",
    nightsPerRoom: "",
    date: null,
  });
  const [newFlight, setNewFlight] = useState({
    origin: "",
    destination: "",
    class: "",
    tripType: "",
    kgCO2e: "",
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState("hotel");

  const reportData = report;
  const { companyName, facilityName, reportId, timePeriod, fa } = reportData;

  useEffect(() => {
    if (fa) {
      if (fa.hotelAccommodation) {
        setHotelData(fa.hotelAccommodation);
      }
      if (fa.flightAccommodation) {
        setFlightData(fa.flightAccommodation);
      }
    }
  }, [fa]);

  const getDateRange = () => {
    if (!timePeriod || typeof timePeriod !== "object") {
      return { start: new Date(), end: new Date() };
    }
    const { start, end } = timePeriod;
    return { start: new Date(start), end: new Date(end) };
  };

  const { start, end } = getDateRange();

  const handleAddHotel = () => {
    if (newHotel.occupiedRooms && newHotel.nightsPerRoom && newHotel.date) {
      if (editIndex === -1) {
        setHotelData([
          ...hotelData,
          { ...newHotel, index: hotelData.length + 1 },
        ]);
      } else {
        const updatedHotelData = [...hotelData];
        updatedHotelData[editIndex] = { ...newHotel, index: editIndex + 1 };
        setHotelData(updatedHotelData);
        setEditIndex(-1);
      }
      setNewHotel({ occupiedRooms: "", nightsPerRoom: "", date: null, abc: "abc" });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleAddFlight = () => {
    if (
      newFlight.origin &&
      newFlight.destination &&
      newFlight.class &&
      newFlight.tripType
    ) {
      if (editIndex === -1) {
        setFlightData([
          ...flightData,
          { ...newFlight, index: flightData.length + 1 },
        ]);
      } else {
        const updatedFlightData = [...flightData];
        updatedFlightData[editIndex] = { ...newFlight, index: editIndex + 1 };
        setFlightData(updatedFlightData);
        setEditIndex(-1);
      }
      setNewFlight({
        origin: "",
        destination: "",
        class: "",
        tripType: "",
      });
    } else {
      toast.error("Please fill all fields");
    }
  };

  const handleEdit = (index, type) => {
    if (type === "hotel") {
      setNewHotel(hotelData[index]);
    } else {
      setNewFlight(flightData[index]);
    }
    setEditIndex(index);
    setActiveTab(type);
  };

  const handleDelete = (index, type) => {
    if (type === "hotel") {
      const updatedHotelData = hotelData.filter((_, i) => i !== index);
      setHotelData(updatedHotelData);
    } else {
      const updatedFlightData = flightData.filter((_, i) => i !== index);
      setFlightData(updatedFlightData);
    }
    toast.info("Now click on save to permanently delete");
  };

  const handleSave = async () => {
    try {
      // console.log("hotelAccommodation", hotelData);
      // console.log("flightAccommodation", flightData);

      const response = await axios.patch(
        `/api/reports/${reportId}/fa/put`,
        { hotelAccommodation: hotelData, flightAccommodation: flightData },
        {
          params: {
            companyName,
            facilityName,
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update accommodation data");
      }
    } catch (error) {
      console.error("Error saving accommodation data:", error);
      toast.error(
        error.response?.data?.message || "Failed to save accommodation data"
      );
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <button
          onClick={() => setActiveTab("hotel")}
          className={`mr-2 ${
            activeTab === "hotel" ? "bg-blue-500 text-white" : "bg-gray-200"
          } px-4 py-2 rounded`}
        >
          Hotel Accommodation
        </button>
        <button
          onClick={() => setActiveTab("flight")}
          className={`${
            activeTab === "flight" ? "bg-blue-500 text-white" : "bg-gray-200"
          } px-4 py-2 rounded`}
        >
          Flight Accommodation
        </button>
      </div>

      {activeTab === "hotel" && (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Index</th>
              <th className="py-3 px-6 text-left">No. of occupied rooms</th>
              <th className="py-3 px-6 text-left">No. of nights per room</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {hotelData.map((hotel, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left">{hotel.occupiedRooms}</td>
                <td className="py-3 px-6 text-left">{hotel.nightsPerRoom}</td>
                <td className="py-3 px-6 text-left">
                  {new Date(hotel.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleEdit(index, "hotel")}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(index, "hotel")}
                    className="text-red-500 hover:text-red-700"
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
                  value={hotelData.length + 1}
                  readOnly
                  className="border p-1 w-full"
                />
              </td>
              <td className="py-3 px-6">
                <input
                  type="number"
                  value={newHotel.occupiedRooms}
                  onChange={(e) =>
                    setNewHotel({ ...newHotel, occupiedRooms: e.target.value })
                  }
                  placeholder="Occupied Rooms"
                  className="border p-1 w-full"
                />
              </td>
              <td className="py-3 px-6">
                <input
                  type="number"
                  value={newHotel.nightsPerRoom}
                  onChange={(e) =>
                    setNewHotel({ ...newHotel, nightsPerRoom: e.target.value })
                  }
                  placeholder="Nights per Room"
                  className="border p-1 w-full"
                />
              </td>
              <td className="py-3 px-6">
                <DatePicker
                  selected={newHotel.date}
                  onChange={(date) => setNewHotel({ ...newHotel, date })}
                  minDate={start}
                  maxDate={end}
                  placeholderText="Select Date"
                  className="border p-1 w-full"
                />
              </td>
              <td className="py-3 px-6">
                <button
                  onClick={handleAddHotel}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editIndex === -1 ? <FaPlus /> : <FaEdit />}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {activeTab === "flight" && (
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Index</th>
              <th className="py-3 px-6 text-left">Origin</th>
              <th className="py-3 px-6 text-left">Destination</th>
              <th className="py-3 px-6 text-left">Class</th>
              <th className="py-3 px-6 text-left">Single Way/Return</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {flightData.map((flight, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{index + 1}</td>
                <td className="py-3 px-6 text-left">{flight.origin}</td>
                <td className="py-3 px-6 text-left">{flight.destination}</td>
                <td className="py-3 px-6 text-left">{flight.class}</td>
                <td className="py-3 px-6 text-left">{flight.tripType}</td>
                <td className="py-3 px-6 text-left">{flight.kgCO2e}</td>
                <td className="py-3 px-6 text-left">
                  <button
                    onClick={() => handleEdit(index, "flight")}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(index, "flight")}
                    className="text-red-500 hover:text-red-700"
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
                  value={flightData.length + 1}
                  readOnly
                  className="border p-1 w-full"
                />
              </td>
              <td className="py-3 px-6">
                <input
                  type="text"
                  value={newFlight.origin}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, origin: e.target.value })
                  }
                  placeholder="Origin"
                  className="border p-1 w-full"
                />
              </td>
              <td className="py-3 px-6">
                <input
                  type="text"
                  value={newFlight.destination}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, destination: e.target.value })
                  }
                  placeholder="Destination"
                  className="border p-1 w-full"
                />
              </td>
              <td className="py-3 px-6">
                <input
                  type="text"
                  value={newFlight.class}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, class: e.target.value })
                  }
                  placeholder="Class"
                  className="border p-1 w-full"
                />
              </td>
              <td className="py-3 px-6">
                <select
                  value={newFlight.tripType}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, tripType: e.target.value })
                  }
                  className="border p-1 w-full"
                >
                  <option value="">Select Trip Type</option>
                  <option value="Single Way">Single Way</option>
                  <option value="Return">Return</option>
                </select>
              </td>
              <td className="py-3 px-6">
                <input
                  type="number"
                  value={newFlight.kgCO2e}
                  onChange={(e) =>
                    setNewFlight({ ...newFlight, kgCO2e: e.target.value })
                  }
                  placeholder="kg CO2e"
                  className="border p-1 w-full"
                />
              </td>
              <td className="py-3 px-6">
                <button
                  onClick={handleAddFlight}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editIndex === -1 ? <FaPlus /> : <FaEdit />}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}

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

export default Fa;
