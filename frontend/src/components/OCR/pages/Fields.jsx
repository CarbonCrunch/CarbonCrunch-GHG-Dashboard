import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Fields = ({ formData, handleSubmit, handleInputChange, handleInputFocus }) => {


  return (
    <>
      <div className="flex flex-1 p-6 space-x-6 bg-white shadow-lg rounded-lg m-4">
        {/* Right Side: Bill Details */}
        <div className="w-full flex flex-col justify-center space-y-6">
          {/* Type Input Field */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-700">
              Info:
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              onFocus={() => handleInputFocus("type")}
              className="w-full p-2 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Update Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fields;
