// Home.js
import React from "react";

const Home = ({ formData, handleInputChange, handleInputFocus }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Home Bill</h2>
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
        <label htmlFor="number_of_employees" className="block mb-1">
          No. of Employees:
        </label>
        <input
          type="number"
          id="number_of_employees"
          name="number_of_employees"
          value={formData.number_of_employees}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("number_of_employees")}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label htmlFor="working_regime" className="block mb-1">
          Working Regime (%):
        </label>
        <input
          type="number"
          id="working_regime"
          name="working_regime"
          value={formData.working_regime}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("working_regime")}
          className="w-full p-2 border border-gray-300 rounded"
          min="0"
          max="100"
        />
      </div>
      <div>
        <label htmlFor="working_from_home" className="block mb-1">
          Working from Home (%):
        </label>
        <input
          type="number"
          id="working_from_home"
          name="working_from_home"
          value={formData.working_from_home}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("working_from_home")}
          className="w-full p-2 border border-gray-300 rounded"
          min="0"
          max="100"
        />
      </div>
      <div>
        <label htmlFor="number_of_months" className="block mb-1">
          Number of Months:
        </label>
        <input
          type="number"
          id="number_of_months"
          name="number_of_months"
          value={formData.number_of_months}
          onChange={handleInputChange}
          onFocus={() => handleInputFocus("number_of_months")}
          className="w-full p-2 border border-gray-300 rounded"
          min="1"
          max="12"
        />
      </div>
    </div>
  );
};

export default Home;
