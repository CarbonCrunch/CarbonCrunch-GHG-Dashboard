import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import NavbarD from "./NavbarD";
import Sidebar from "./Sidebar";

const ViewReport = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Bioenergy");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/reports/get");
        if (response.data.data === "zero") {
          setReport(null);
        } else {
          setReport(response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch report");
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [reportId]);

  if (loading) {
    return <p>Loading report...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!report) {
    return <p>No report available</p>;
  }

  const scope1Categories = [
    "Fuels",
    "Bioenergy",
    "Refrigerants",
    "Passenger vehicles",
    "Delivery vehicles",
  ];

  const scope3Categories = [
    "BusinessTravel",
    "EmployCommuting",
    "Flights & Accomodations",
    "Food",
    "FreightingGoods",
    "Home",
    "MaterialsUsed",
    "WTTFuel",
    "WasteDisposal",
    "Water",
  ];

  const renderCategoryData = (category, data) => {
    if (!data || data.length === 0) {
      return (
        <tr key={category} className="border-b">
          <td className="p-2">{category}</td>
          <td className="p-2">-</td>
          <td className="p-2">0</td>
        </tr>
      );
    }
    return data.map((item, index) => (
      <tr key={index} className="border-b">
        <td className="p-2">{category}</td>
        <td className="p-2">{item.level2 || item.level3 || "-"}</td>
        <td className="p-2">{item.CO2e || 0}</td>
      </tr>
    ));
  };

  const totalScope1 = scope1Categories.reduce(
    (total, category) =>
      total +
      (report[category.toLowerCase()]?.reduce(
        (sum, item) => sum + (item.CO2e || 0),
        0
      ) || 0),
    0
  );

  const totalScope3 = scope3Categories.reduce(
    (total, category) =>
      total +
      (report[category.toLowerCase()]?.reduce(
        (sum, item) => sum + (item.CO2e || 0),
        0
      ) || 0),
    0
  );

  const totalScope2 = report.ehctd?.reduce(
    (total, item) => total + (item.CO2e || 0),
    0
  );

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarD />
      <div className="flex flex-1">
        <div className="w-1/6 sticky top-0 h-screen">
          <Sidebar />
        </div>
        <div className="flex-1 p-4">
          <h2 className="text-2xl font-bold mb-4">Report Details</h2>
          <h3 className="text-lg font-bold mb-4">
            Company: {report.companyName}, Facility: {report.facilityName},
            Report: {report.reportName}, Report ID: {report.reportId}
          </h3>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <thead>
              <tr>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Subcategory</th>
                <th className="p-2 text-left">t CO2e</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="p-2 font-bold">
                  Scope 1
                </td>
              </tr>
              {scope1Categories.map((category) =>
                renderCategoryData(category, report[category.toLowerCase()])
              )}
              <tr className="border-t font-bold">
                <td className="p-2">Total Scope 1</td>
                <td className="p-2"></td>
                <td className="p-2">{totalScope1}</td>
              </tr>
            </tbody>
          </table>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mb-4">
            <thead>
              <tr>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Subcategory</th>
                <th className="p-2 text-left">t CO2e</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="p-2 font-bold">
                  Scope 2
                </td>
              </tr>
              {renderCategoryData("Electricity_Heating", report.ehctd)}
              <tr className="border-t font-bold">
                <td className="p-2">Total Scope 2</td>
                <td className="p-2"></td>
                <td className="p-2">{totalScope2}</td>
              </tr>
            </tbody>
          </table>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Subcategory</th>
                <th className="p-2 text-left">t CO2e</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" className="p-2 font-bold">
                  Scope 3
                </td>
              </tr>
              {scope3Categories.map((category) =>
                renderCategoryData(category, report[category.toLowerCase()])
              )}
              <tr className="border-t font-bold">
                <td className="p-2">Total Scope 3</td>
                <td className="p-2"></td>
                <td className="p-2">{totalScope3}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewReport;
