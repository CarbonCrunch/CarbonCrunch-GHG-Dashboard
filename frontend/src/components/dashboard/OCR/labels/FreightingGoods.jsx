// FreightingGoods.js
import React from "react";

const FreightingGoods = ({
  formData,
  handleInputChange,
  handleInputFocus,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Freighting Goods Bill</h2>
      <div>
        <label htmlFor="category" className="block mb-1">
          Category:
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("category")}
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
        <label htmlFor="weight" className="block mb-1">
          Weight:
        </label>
        <input
          type="text"
          id="weight"
          name="weight"
          value={formData.weight}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("weight")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="distance" className="block mb-1">
          Distance:
        </label>
        <input
          type="text"
          id="distance"
          name="distance"
          value={formData.distance}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("distance")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
    </div>
  );
};

export default FreightingGoods;
