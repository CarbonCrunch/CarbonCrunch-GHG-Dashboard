import React from "react";
import Bioenergy from "./labels/Bioenergy";
import Refrigerants from "./labels/Refrigerants";
import Electricity from "./labels/Electricity";
import OwnedVehicles from "./labels/OwnedVehicles";
import WTTFuel from "./labels/WTTFuel";
import MaterialsUsed from "./labels/MaterialsUsed";
import WasteDisposal from "./labels/WasteDisposal";
import BusinessTravel from "./labels/BusinessTravel";
import FreightingGoods from "./labels/FreightingGoods";
import EmployCommuting from "./labels/EmployCommuting";
import Food from "./labels/Food";
import Water from "./labels/Water";
import Fuels from "./labels/Fuels";
import Home from "./labels/Home";
import FlightsAndAccommodations from "./labels/FlightsAndAccommodations";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Fields = ({
  formData,
  handleInputChange,
  handleInputFocus,
  handleSubmit,
  selectedBillType,
}) => {
  const renderBillComponent = () => {
    switch (selectedBillType) {
      case "Fuels":
        return (
          <Fuels
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "Bioenergy":
        return (
          <Bioenergy
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "Refrigerants":
        return (
          <Refrigerants
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "Electricity":
        return (
          <Electricity
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "OwnedVehicles":
        return (
          <OwnedVehicles
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "WTTFuel":
        return (
          <WTTFuel
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "MaterialsUsed":
        return (
          <MaterialsUsed
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "WasteDisposal":
        return (
          <WasteDisposal
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "Flights & Accomodations":
        return (
          <FlightsAndAccommodations
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );

      case "BusinessTravel":
        return (
          <BusinessTravel
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "FreightingGoods":
        return (
          <FreightingGoods
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "EmployCommuting":
        return (
          <EmployCommuting
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "Food":
        return (
          <Food
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "Water":
        return (
          <Water
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      case "Home":
        return (
          <Home
            formData={formData}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmitWithToast = async () => {
    try {
      const result = await handleSubmit();
      if (result) {
        toast.success("Form submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error("Form submission failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="md:w-1/2 pl-4 mt-4 md:mt-0">
      {/* <h2 className="text-2xl font-bold mb-4">Fields</h2> */}
      <div className="space-y-4">
        <div>
          <label htmlFor="type_of_bill" className="block mb-1">
            Type of Bill:
          </label>
        </div>
        {renderBillComponent()}
        <div>
          <label htmlFor="date" className="block mb-1">
            Date:
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            onFocus={() => handleInputFocus("date")}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSubmitWithToast}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Fields;
