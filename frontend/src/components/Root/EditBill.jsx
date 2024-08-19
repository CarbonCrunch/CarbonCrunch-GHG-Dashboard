import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import NavbarD from "../dashboard/NavbarD";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditBill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bill } = location.state || {};

  const [notes, setNotes] = useState("");

  if (!bill) {
    return <div>No bill data available</div>;
  }

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `/api/bills/${bill.billId}/put`,
        {
          notes, // Data sent in the request body
        },
        {
          params: {
            billId: bill.billId,
            companyName: bill.companyName,
            facilityName: bill.facilityName,
          },  
        }
      );
      if (response.status === 200) {
        toast.success("Bill updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update the bill.");
    }
  };


  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <ToastContainer />
      <NavbarD />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/6 flex-shrink-0 sticky top-0 h-screen bg-white shadow-lg">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex flex-1 p-6 space-x-6 bg-white shadow-lg rounded-lg m-4">
          {/* Left Side: Image */}
          <div className="w-1/2 flex items-center justify-center bg-gray-100 rounded-lg p-4 shadow-inner">
            <img
              src={bill.URL}
              alt={bill.billName}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Vertical Rule */}
          <div className="border-l-2 border-gray-300"></div>

          {/* Right Side: Bill Details */}
          <div className="w-1/2 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">
                Bill ID:
              </label>
              <div className="text-gray-800 bg-gray-100 p-2 rounded-lg shadow-inner">
                {bill.billId}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">
                Bill Name:
              </label>
              <div className="text-gray-800 bg-gray-100 p-2 rounded-lg shadow-inner">
                {bill.billName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">
                Company Name:
              </label>
              <div className="text-gray-800 bg-gray-100 p-2 rounded-lg shadow-inner">
                {bill.companyName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">
                Facility Name:
              </label>
              <div className="text-gray-800 bg-gray-100 p-2 rounded-lg shadow-inner">
                {bill.facilityName}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">
                Type of Bill:
              </label>
              <div className="text-gray-800 bg-gray-100 p-2 rounded-lg shadow-inner">
                {bill.type_off_bill}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">
                Username:
              </label>
              <div className="text-gray-800 bg-gray-100 p-2 rounded-lg shadow-inner">
                {bill.addedBy}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">
                Created At:
              </label>
              <div className="text-gray-800 bg-gray-100 p-2 rounded-lg shadow-inner">
                {bill.dateAdded}
              </div>
            </div>

            {/* Additional Input Field */}
            <div className="space-y-2">
              <label className="block text-lg font-semibold text-gray-700">
                Additional Notes:
              </label>
              <input
                type="text"
                placeholder="Enter any notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Update Button */}
            <div className="mt-6">
              <button
                onClick={handleUpdate}
                className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBill;
