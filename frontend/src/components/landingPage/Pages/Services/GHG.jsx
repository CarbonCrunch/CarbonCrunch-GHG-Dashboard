import React from 'react';
import image from '../../assets/image.png'

const GHG = () => {
  return (
    <div className="bg-white min-h-screen py-12">
      {/* Header Section */}
      <div className="text-center text-black mb-14">
        <h1 className="text-4xl font-semibold font-josefin-sans">
          GHG
        </h1>
      </div>

      {/* Service Detail Section */}
      <div className="flex flex-col md:flex-row items-center max-w-5xl mx-auto bg-[#F3F9EE] rounded-lg shadow-lg p-6 md:p-8 transition-all duration-500 ease-in-out">
        {/* Image Section */}
        <div className="md:w-1/2 w-full mb-8 md:mb-0">
          <img
            src={image}
            alt='image'
            className="rounded-lg object-cover h-auto w-full shadow-md"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 w-full pl-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#002952] mb-6">
            GHG Accounting
          </h2>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
          GHG accounting is the process of measuring and reporting an organization's greenhouse gas emissions across three categories: Scope 1, Scope 2, and Scope 3. It involves collecting activity data, calculating emissions using standardized factors, and reporting the results to guide sustainability strategies and comply with frameworks like the GHG Protocol. This process helps organizations track their carbon footprint and set reduction targets.
          </p>

          {/* Call to Action Button */}
          <button className="bg-[#006400] text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-[#228B22] transition-colors duration-300 shadow-md">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default GHG;