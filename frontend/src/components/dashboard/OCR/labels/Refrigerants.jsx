import React from "react";

const Refrigerants = ({
  formData,
  handleInputChange,
  handleInputFocus,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Refrigerants Bill</h2>
      <div>
        <label htmlFor="emission" className="block mb-1">
          Emission:
        </label>
        <input
          type="text"
          id="emission"
          name="emission"
          value={formData.emission}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("emission")}
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
          Amount (kg):
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

export default Refrigerants;
