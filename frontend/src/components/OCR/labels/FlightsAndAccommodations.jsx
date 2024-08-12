// FlightsAndAccommodations.js
import React, { useState } from "react";

const FlightsAndAccommodations = ({
  formData,
  handleInputChange,
  handleInputFocus,
}) => {
  const [hotelRows, setHotelRows] = useState([
    { id: 1, occupiedRooms: "", nightsPerRoom: "" },
  ]);
  const [flightRows, setFlightRows] = useState([
    { id: 1, origin: "", destination: "", class: "", tripType: "", kgCO2e: "" },
  ]);

  const addHotelRow = () => {
    const newRow = {
      id: hotelRows.length + 1,
      occupiedRooms: "",
      nightsPerRoom: "",
    };
    setHotelRows([...hotelRows, newRow]);
  };

  const addFlightRow = () => {
    const newRow = {
      id: flightRows.length + 1,
      origin: "",
      destination: "",
      class: "",
      tripType: "",
      kgCO2e: "",
    };
    setFlightRows([...flightRows, newRow]);
  };

  const deleteHotelRow = (id) => {
    setHotelRows(hotelRows.filter((row) => row.id !== id));
  };

  const deleteFlightRow = (id) => {
    setFlightRows(flightRows.filter((row) => row.id !== id));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-4">Flights & Accommodations</h2>

      <div>
        <h3 className="text-xl font-semibold mb-2">Hotel Accommodation</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Index</th>
              <th>No. of occupied rooms</th>
              <th>No. of nights per room</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {hotelRows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="number"
                    value={formData[`occupiedRooms${row.id}`] || ""}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus(`occupiedRooms${row.id}`)}
                    name={`occupiedRooms${row.id}`}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={formData[`nightsPerRoom${row.id}`] || ""}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus(`nightsPerRoom${row.id}`)}
                    name={`nightsPerRoom${row.id}`}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </td>
                <td>
                  <button
                    onClick={() => deleteHotelRow(row.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addHotelRow}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Row
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Flight Accommodation</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Index</th>
              <th>Origin</th>
              <th>Destination</th>
              <th>Class</th>
              <th>Single Way/Return</th>
              <th>kg CO2e</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {flightRows.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="text"
                    value={formData[`origin${row.id}`] || ""}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus(`origin${row.id}`)}
                    name={`origin${row.id}`}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData[`destination${row.id}`] || ""}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus(`destination${row.id}`)}
                    name={`destination${row.id}`}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={formData[`class${row.id}`] || ""}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus(`class${row.id}`)}
                    name={`class${row.id}`}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </td>
                <td>
                  <select
                    value={formData[`tripType${row.id}`] || ""}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus(`tripType${row.id}`)}
                    name={`tripType${row.id}`}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="">Select</option>
                    <option value="single">Single Way</option>
                    <option value="return">Return</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={formData[`kgCO2e${row.id}`] || ""}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus(`kgCO2e${row.id}`)}
                    name={`kgCO2e${row.id}`}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </td>
                <td>
                  <button
                    onClick={() => deleteFlightRow(row.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addFlightRow}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Row
        </button>
      </div>
    </div>
  );
};

export default FlightsAndAccommodations;