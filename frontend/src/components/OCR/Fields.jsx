import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Fuel from "../reports/Fuel";
import Bioenergy from "../reports/Bioenergy";
import Refrigerants from "../reports/Refrigerants";
import Ov from "../reports/Ov";
import Wttfuels from "../reports/Wttfuels";
import Materials from "../reports/Materials";
import Waste from "../reports/Waste";
import Fa from "../reports/Fa";
import Ehctd from "../reports/Ehctd";
import Btls from "../reports/Btls";
import Ec from "../reports/Ec";
import Fg from "../reports/Fg";
import Food from "../reports/Food";
import HomeOffice from "../reports/HomeOffice";
import Water from "../reports/Water";
import { useAuth } from "../../context/AuthContext";

const componentMap = {
  Fuels: Fuel,
  Bioenergy: Bioenergy,
  Refrigerants: Refrigerants,
  OwnedVehicles: Ov,
  WTTFuel: Wttfuels,
  MaterialsUsed: Materials,
  WasteDisposal: Waste,
  "Flights & Accomodations": Fa,
  Electricity_Heating: Ehctd,
  BusinessTravel: Btls,
  FreightingGoods: Fg,
  EmployCommuting: Ec,
  Food: Food,
  Home: HomeOffice,
  Water: Water,
};

const Fields = ({
  formData,
  handleInputChange,
  handleInputFocus,
  selectedBillType,
}) => {

  const { user } = useAuth();

 


  const SelectedComponent = componentMap[selectedBillType];



  return (
    <div className="w-full pl-4 mt-4 md:mt-0">
      <div className="space-y-4 ">
        {/* Display Report Information */}
        <div>
          <p>
            <strong>Bill ID:</strong> {billId}
          </p>
          <p>
            <strong>Company Name:</strong> {companyName}
          </p>
          <p>
            <strong>Facility Name:</strong> {facilityName}
          </p>
        </div>

        {/* Type of Bill Section */}
        <div>
          <label htmlFor="type_of_bill" className="block mb-1">
            Type of Bill: {selectedBillType}
          </label>

          <div>
            {loading ? (
              <p>Loading report...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : report ? (
              <div className="overflow-x-auto ">
                <div className="whitespace-nowrap">
                  {SelectedComponent && (
                    <SelectedComponent
                      handleInputFocus={handleInputFocus}
                      handleInputChange={handleInputChange}
                      formData={formData}
                      report={report}
                    />
                  )}
                </div>
              </div>
            ) : (
              <p>No report data available.</p>
            )}
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Fields;
