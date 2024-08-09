// MaterialsUsed.js
import React from "react";

const MaterialsUsed = ({
  formData,
  handleInputChange,
  handleInputFocus,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Materials Used Bill</h2>
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
        <label htmlFor="material" className="block mb-1">
          Material:
        </label>
        <input
          type="text"
          id="material"
          name="material"
          value={formData.material}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("material")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
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

export default MaterialsUsed;
