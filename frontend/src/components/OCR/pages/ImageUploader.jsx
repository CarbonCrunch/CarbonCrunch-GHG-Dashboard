import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavbarD from "../../dashboard/NavbarD";
import Sidebar from "../../dashboard/Sidebar";

function ImageUploader({ setUploadedImage }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBillType, setSelectedBillType] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleBillTypeChange = (event) => {
    setSelectedBillType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }
    if (!selectedBillType) {
      alert("Please select a bill type");
      return;
    }
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const response = await axios.post(
        "http://localhost:5000/ocr/uploadimage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUploadedImage(URL.createObjectURL(selectedFile));
        navigate("/ocr/output", { state: { billType: selectedBillType } });
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload image");
    }
  };

  

const billTypes = [
  "Bioenergy",
  "BusinessTravel",
  "Electricity_Heating",
  "EmployCommuting",
  "Flights & Accommodations",
  "Food",
  "FreightingGoods",
  "Fuels",
  "Home",
  "MaterialsUsed",
  "OwnedVehicles",
  "Refrigerants",
  "WTTFuel",
  "WasteDisposal",
  "Water",
];


  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavbarD />
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-1/6 sticky top-0 h-screen">
            <Sidebar />
          </div>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-medium mb-4">Upload Bill Image</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              <select
                value={selectedBillType}
                onChange={handleBillTypeChange}
                className="rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="">Select Bill Type</option>
                {billTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageUploader;
