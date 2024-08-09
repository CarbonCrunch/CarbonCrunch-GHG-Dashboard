import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Fields from "../Fields";
import Canvas from "../Canvas";
import Header from "../Header";

function ImageViewer({ uploadedImage }) {
  const location = useLocation();
  const selectedBillType = location.state?.billType || "";

  const [formData, setFormData] = useState({});
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    setFormData({ type_of_bill: selectedBillType });
  }, [selectedBillType]);

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

  const handleSubmit = async (event) => {
    // event.preventDefault();
    // console.log("formData", formData);
    const jsonData = JSON.stringify(formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/output",
        jsonData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Sent JSON Object:", jsonData);
      // console.log("Response from backend:", response.data);
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1">
            <div className="md:w-1/2 pr-4">
              <Link
                to="/uploadimage"
                className="mb-4 inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Upload Another Image
              </Link>
              {/* See Tables Button */}
              <Link
                to="/tables"
                className="ml-1 mb-4 inline-block bg-[#002952] text-white px-4 py-2 rounded hover:bg-[#003D7A] transition duration-300"
              >
                See Tables
              </Link>
            </div>
            <div className="overflow-auto max-w-full max-h-[600px] border border-gray-300 rounded">
              <div className="min-w-[800px] min-h-[600px]">
                <Canvas
                  uploadedImage={uploadedImage}
                  activeField={activeField}
                  setFormData={setFormData}
                />
              </div>
            </div>
          </div>
          <div className="hidden md:block w-px bg-gray-200 mx-4"></div>
          <Fields
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
            handleSubmit={handleSubmit}
            selectedBillType={selectedBillType}
          />
        </div>
      </div>
    </>
  );
}

export default ImageViewer;
