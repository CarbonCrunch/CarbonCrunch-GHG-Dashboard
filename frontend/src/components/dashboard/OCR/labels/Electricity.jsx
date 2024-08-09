// Electricity.js
import React from "react";

const Electricity = ({ formData, handleInputChange, handleInputFocus }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        Electricity, Heat, Cooling, T&D Bill
      </h2>
      <div>
        <label htmlFor="activity" className="block mb-1">
          Activity:
        </label>
        <input
          type="text"
          id="activity"
          name="activity"
          value={formData.activity}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("activity")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="unit" className="block mb-1">
          Unit:
        </label>
        <input
          type="text"
          id="unit"
          name="unit"
          value={formData.unit}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("unit")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="amount" className="block mb-1">
          Amount:
        </label>
        <input
          type="text"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("amount")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default Electricity;
