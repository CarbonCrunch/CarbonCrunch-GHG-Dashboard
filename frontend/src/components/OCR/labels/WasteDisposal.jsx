// WasteDisposal.js
import React from "react";

const WasteDisposal = ({
  formData,
  handleInputChange,
  handleInputFocus,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Waste Disposal Bill</h2>
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
        <label htmlFor="waste_type" className="block mb-1">
          Waste Type:
        </label>
        <input
          type="text"
          id="waste_type"
          name="waste_type"
          value={formData.waste_type}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("waste_type")}
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

export default WasteDisposal;
