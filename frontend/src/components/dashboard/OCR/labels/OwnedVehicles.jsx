// OwnedVehicles.js
import React from "react";

const OwnedVehicles = ({
  formData,
  handleInputChange,
  handleInputFocus,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Owned Vehicles Bill</h2>
      <div>
        <label htmlFor="level1" className="block mb-1">
          Level 1:
        </label>
        <input
          type="text"
          id="level1"
          name="level1"
          value={formData.level1}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("level1")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="level2" className="block mb-1">
          Level 2:
        </label>
        <input
          type="text"
          id="level2"
          name="level2"
          value={formData.level2}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("level2")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="level3" className="block mb-1">
          Level 3:
        </label>
        <input
          type="text"
          id="level3"
          name="level3"
          value={formData.level3}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("level3")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="fuels_used" className="block mb-1">
          Fuels Used:
        </label>
        <input
          type="text"
          id="fuels_used"
          name="fuels_used"
          value={formData.fuels_used}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("fuels_used")}
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

export default OwnedVehicles;
