import React, { useState } from 'react';
import photo from './assets/photo.png';

const CarbonRiskCalculator = () => {
  const [industry, setIndustry] = useState('');
  const [employees, setEmployees] = useState('');
  const [operationalDays, setOperationalDays] = useState('');
  const [location, setLocation] = useState('');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    if (!industry || !employees || !operationalDays || !location) {
      alert('Please fill in all required fields.');
      return;
    }

    const data = {
      industry,
      employees: Number(employees),
      operationalDays: Number(operationalDays),
      location,
    };

    try {
      const industryAverages = {
        manufacturing: 20000,
        services: 6000,
        retail: 4500,
        hospitality: 8000,
      };

      const emissionFactors = {
        usa: 0.453,
        europe: 0.276,
        china: 0.681,
      };

      const carbonTaxRates = {
        usa: 50,
        europe: 60,
        china: 30,
      };

      const averageEnergyPerEmployee = industryAverages[data.industry];
      if (!averageEnergyPerEmployee) {
        alert('Invalid industry selected.');
        return;
      }

      const emissionFactor = emissionFactors[data.location];
      if (!emissionFactor) {
        alert('Invalid location selected.');
        return;
      }

      const carbonTaxRate = carbonTaxRates[data.location];
      const standardOperationalDays = 250;
      let annualEnergyConsumption = data.employees * averageEnergyPerEmployee;
      annualEnergyConsumption *= data.operationalDays / standardOperationalDays;

      const ghgEmissions = (annualEnergyConsumption * emissionFactor) / 1000;
      const carbonTaxLiability = ghgEmissions * carbonTaxRate;
      const totalFinancialRisk = carbonTaxLiability;

      setResults({
        energyConsumption: Math.round(annualEnergyConsumption),
        ghgEmissions: ghgEmissions.toFixed(2),
        carbonTaxLiability: Math.round(carbonTaxLiability),
        totalFinancialRisk: Math.round(totalFinancialRisk),
      });
    } catch (error) {
      console.error('Calculation Error:', error);
      alert('An unexpected error occurred during calculation. Please try again.');
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-2xl  md:text-3xl font-bold mb-14 text-center text-[#002952]">
          Carbon Risk Calculator
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div>
            <div className="space-y-6">
              {/* Industry Sector */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-800">
                  Industry Sector <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-1 block w-full p-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">Select Industry</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="services">Services (Office)</option>
                  <option value="retail">Retail</option>
                  <option value="hospitality">Hospitality</option>
                </select>
              </div>

              {/* Number of Employees */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-800">
                  Number of Employees <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full p-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                />
              </div>

              {/* Operational Days */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-800">
                  Operational Days per Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full p-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  value={operationalDays}
                  onChange={(e) => setOperationalDays(e.target.value)}
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-800">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-1 block w-full p-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  <option value="usa">USA</option>
                  <option value="europe">Europe</option>
                  <option value="china">China</option>
                </select>
              </div>

              {/* Calculate Button */}
              <div className="text-center mt-6">
                <button
                  onClick={handleCalculate}
                  className="px-6 py-3 bg-[#002952] text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
                >
                  Calculate
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="relative">
            {results ? (
              <div className="space-y-6 text-gray-800 bg-gray-50 p-6 rounded-md shadow-md">
                <h2 className="text-xl font-bold">Results</h2>
                <div className="flex justify-between">
                  <span>Estimated Annual Energy Consumption:</span>
                  <span className="font-semibold">
                    {results.energyConsumption.toLocaleString()} kWh/year
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GHG Emissions:</span>
                  <span className="font-semibold">{results.ghgEmissions} tonnes CO₂e/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Potential Carbon Tax Liability:</span>
                  <span className="font-semibold">
                    ${results.carbonTaxLiability.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Potential Financial Risk:</span>
                  <span className="font-semibold text-red-600">
                    ${results.totalFinancialRisk.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0">
                <img
                  src={photo}
                  alt="Placeholder"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarbonRiskCalculator;
