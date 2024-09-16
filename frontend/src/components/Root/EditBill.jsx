import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar";
import NavbarD from "../dashboard/NavbarD";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Canvas from "../OCR/Canvas";
import { useAuth } from "../../context/AuthContext";

const EditBill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bill } = location.state || {};
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [activeField, setActiveField] = useState(null);
  const [containerRef, setContainerRef] = useState(null);

  console.log("Bill data", bill);
  if (!bill) {
    return <div>No bill data available</div>;
  }

  useEffect(() => {
    const uploadImageToOCR = async () => {
      try {
        // Step 1: Get the image from the Cloudinary URL
        const imageUrl = bill.URL; // Use the bill's image URL
        const response = await axios.get(imageUrl, {
          responseType: "blob",
          withCredentials: false,
        }); // Download the image as a blob
        // console.log("Image response", response, bill);

        // Step 2: Create form data and append the image blob
        const formData = new FormData();
        formData.append("image", response.data, "image.png"); // Append the image as "image.png"

        // Step 3: Send the image to the OCR service
        const ocrResponse = await axios.post(
          "http://localhost:5000/ocr/uploadimage",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (ocrResponse.status !== 200) {
          throw new Error("Image upload to OCR service failed");
        } else {
          toast.success("Image successfully uploaded to OCR service");
        }
      } catch (error) {
        toast.error("Failed to upload image to OCR service.");
      }
    };

    // Trigger the image upload when the component mounts
    uploadImageToOCR();
  }, []);

  useEffect(() => {
    if (containerRef) {
      const containerWidth = containerRef.offsetWidth;
      const screenWidth = window.innerWidth;
      if (containerWidth > screenWidth) {
        containerRef.style.overflow = "hidden";
      }
    }
  }, [containerRef]);

  const handleInputFocus = (field) => {
    setActiveField(field);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `/api/bills/${bill.billId}/put`,
        {
          formData,
          _id: bill._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
          },
          withCredentials: true, // Ensure cookies are sent
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
            {/* <img
              src={bill.URL}
              alt={bill.billName}
              className="max-w-full h-auto rounded-lg shadow-lg"
            /> */}
            <Canvas
              uploadedImage={bill.URL}
              activeField={activeField}
              setFormData={setFormData}
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
                Info:
              </label>
              <input
                type="text"
                id="Info"
                name="Info"
                value={formData.Info}
                onChange={handleInputChange}
                onFocus={() => handleInputFocus("Info")}
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
