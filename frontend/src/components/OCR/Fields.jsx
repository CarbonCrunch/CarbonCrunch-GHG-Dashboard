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
import axios from "axios";
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
  const [report, setReport] = useState(null); // State to store reports
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/reports/get");
        if (response.data.data === "zero") {
          setReport([]);
        } else {
          setReport(response.data.data);
          console.log("report", response.data.data);
        }
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching the report."
        );
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const reportData = report;
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
  } = reportData || {};
  // console.log("reportData", report);

  const SelectedComponent = componentMap[selectedBillType];

  const handleSubmitWithToast = () => {
    // Your submit logic here
    toast.success("Form submitted successfully!");
  };

  return (
    <div className="w-full pl-4 mt-4 md:mt-0">
      <div className="space-y-4 ">
        {/* Display Report Information */}
        <div>
          <p>
            <strong>Report ID:</strong> {reportId}
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
            Type of Bill:
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

        {/* Submit Button */}
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
    </div>
  );
};

export default Fields;
