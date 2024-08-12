// WTTFuel.js
import React from "react";

const WTTFuel = ({ formData, handleInputChange, handleInputFocus }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">WTT Fuel Bill</h2>
      <div>
        <label htmlFor="type" className="block mb-1">
          Type:
        </label>
        <input
          type="text"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("type")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="fuel" className="block mb-1">
          Fuel:
        </label>
        <input
          type="text"
          id="fuel"
          name="fuel"
          value={formData.fuel}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("fuel")}
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

export default WTTFuel;
