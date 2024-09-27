import React, { useState, useEffect } from 'react';
import image from './assets/image.png';
import dashboard from './assets/SupplierDashboard.jpeg'

const services = [
  {
    name: "GHG Accounting",
    description: `GHG accounting is the process of measuring and reporting an organization's greenhouse
     gas emissions across three categories: Scope 1, Scope 2, and Scope 3. It involves collecting activity data,
      calculating emissions using standardized factors, and reporting the results to guide sustainability 
      strategies and comply with frameworks like the GHG Protocol. This process helps organizations track their
       carbon footprint and set reduction targets.`,
    image: image
  },
  {
    name: "Scope 1 and Scope 2 Analysis",
    description: `Scope 1 and Scope 2 emissions analysis is crucial for organizations aiming to manage their carbon
     footprint. Scope 1 refers to direct emissions from sources that are owned or controlled by the company, such as
      emissions from on-site fuel combustion in boilers, furnaces, and vehicles. Scope 2 covers indirect emissions 
      from the generation of purchased electricity, steam, heating, or cooling consumed by the organization.`,
    image: image
  },
  {
    name: "GHG Inventory Management",
    description: `Greenhouse Gas (GHG) Inventory Management is the process of quantifying, tracking, 
    and reporting the greenhouse gas emissions of an organization or country. The primary objective is to understand and 
    reduce the organization’s carbon footprint by identifying the sources and quantities of GHG emissions.
    Additionally, many organizations use their GHG inventory to set emissions reduction targets and track 
    progress over time.`,
    image: image
  },
  {
    name: "Supplier ESG Management",
    description: `Supplier ESG management involves evaluating and managing the sustainability practices of a 
    company's suppliers to ensure that they align with the organization's own ESG goals. This process focuses 
    on assessing suppliers' impact on the environment, social responsibility, and governance standards.`,
    image: dashboard
  },
  {
    name: "BRSR Core Value Chain Disclosure",
    description: `Core Value Chain Disclosure in BRSR requires companies to report on the sustainability practices 
    of their entire value chain, including suppliers and distributors. It covers key aspects such as identifying 
    major partners, assessing environmental, social, and governance practices across the chain, managing related risks,
    and collaborating with partners to improve ESG performance.`,
    image: image
  },
  {
    name: "BRSR Reporting",
    description: `This is a framework introduced by the Securities and Exchange Board of India (SEBI) for listed 
    companies to disclose information about their sustainability and business responsibility practices. BRSR aims 
    to enhance transparency and promote sustainable development by requiring companies to provide detailed reports 
    on their Environmental, Social, and Governance (ESG) activities.`,
    image: image
  }
];

const OurServices = () => {
  const [selectedServiceIndex, setSelectedServiceIndex] = useState(0);

  // Automatically switch tabs every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSelectedServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 3000); // Switch every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const selectedService = services[selectedServiceIndex];

  return (
    <div className="bg-gradient-to-b from-[#1F568C] to-[#002952] min-h-screen py-12">
      <div className="text-center text-white mb-14">
        <h2 className="text-4xl font-semibold font-josefin-sans">Our Services</h2>
      </div>

      {/* Services Navigation */}
      <div className="flex justify-center space-x-2 mb-14 px-4 overflow-hidden">
        {services.map((service, index) => (
          <button
            key={index}
            onClick={() => setSelectedServiceIndex(index)}
            className={`px-4 py-2 whitespace-nowrap rounded-full font-semibold transition-colors duration-300 w-auto ${
              selectedServiceIndex === index
                ? 'bg-green-400 text-white'
                : 'bg-transparent border-2 border-green-400 text-white hover:bg-green-400 hover:text-white'
            }`}
          >
            {service.name}
          </button>
        ))}
      </div>

      {/* Service Details with Image */}
      <div className="flex flex-col h-auto mb-10 md:flex-row justify-center items-center max-w-6xl mx-auto bg-[#F3F9EE] rounded-lg shadow-lg transition-all duration-500 ease-in-out transform px-4 md:px-8">
        <div className="md:w-1/2 w-full mb-8 md:mb-0">
          <h3 className="text-2xl font-bold text-[#002952] mb-6">
            {selectedService.name}
          </h3>
          <p className="text-gray-700 mb-6">{selectedService.description}</p>
          <button className="text-[#002952] text-xl mt-10 font-semibold hover:text-green-700">
            Explore the service → 
          </button>
        </div>
        <div className="md:w-1/2 w-full">
          <img
            src={selectedService.image}
            alt={selectedService.name}
            className="rounded-r-lg object-cover h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default OurServices;
