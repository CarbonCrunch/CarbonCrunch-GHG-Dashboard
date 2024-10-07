import React from 'react';
import anomaly from '../assets/anomaly.png';
import csri from '../assets/csri.png';
import brsr from '../assets/brsr.png';
import esrs from '../assets/esrs.png';
import ghg from '../assets/ghg.png';
import gri from '../assets/gri.png';
import repanalysis from '../assets/repanalysis.png';
import selfai from '../assets/selfai.png';
import supply from '../assets/supply.png';
import Navbar from '../NavBar';

const services = [
  {
    title: 'GHG Accounting - Scope 1, Scope 2, Scope 3',
    imgSrc: ghg,
    description: 'Comprehensive carbon reporting, covering Scope 1, 2, and 3 emissions for full transparency.',
  },
  {
    title: 'Self-Serve AI Assistant',
    imgSrc: selfai,
    description: 'AI-assisted sustainability reporting and real-time insights for better decision-making.',
  },
  {
    title: 'Reporting Analysis',
    imgSrc: repanalysis,
    description: 'Detailed reporting analysis to identify key trends and areas of improvement in your ESG practices.',
  },
  {
    title: 'Anomaly Detection',
    imgSrc: anomaly,
    description: 'Automatically detects anomalies in your carbon data, ensuring accurate emissions tracking.',
  },
  {
    title: 'Supply Chain Analysis',
    imgSrc: supply,
    description: 'Assess the carbon impact across your entire supply chain, optimizing for sustainability.',
  },
  {
    title: 'BRSR Reporting',
    imgSrc: brsr,
    description: 'Automate BRSR reporting with tools that ensure compliance with the latest guidelines.',
  },
  {
    title: 'GRI Reporting',
    imgSrc: gri,
    description: 'Generate GRI reports compliant with global sustainability standards.',
  },
  {
    title: 'CSRD',
    imgSrc: csri,
    description: 'Simplify the complex CSRD reporting requirements with our integrated tools.',
  },
  {
    title: 'ESRS',
    imgSrc: esrs,
    description: 'Ensure transparency and compliance in your reports with ESRS standards.',
  },
];

const ServiceCard = ({ title, imgSrc, description }) => (
  <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col justify-between items-start transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
    <img src={imgSrc} alt={title} className="w-14 h-14 mb-5 object-contain" />
    <h3 className="text-xl font-semibold text-navy-700">{title}</h3>
    <p className="text-gray-500 mt-3">{description}</p>
  </div>
);

const Services = () => {
  return (
    <div className="bg-gradient-to-b from-white to-[#F0F4F8] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <Navbar/>
        <h1 className="text-5xl font-bold text-center mb-14 text-[#002952] tracking-tight mt-16">
          Our Services
        </h1>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Explore our wide range of sustainability solutions tailored to meet your organization’s needs. Simplify your carbon reporting, automate analysis, and optimize your environmental strategy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              imgSrc={service.imgSrc}
              description={service.description}
            />
          ))}
        </div>

        <div className="text-center mt-14">
          <button className="bg-[#002952] text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-[#004080] transition-colors duration-300 shadow-md">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;