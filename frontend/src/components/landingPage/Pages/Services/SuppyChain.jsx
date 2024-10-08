import React from 'react';
import Navbar from '../../NavBar';

const SupplyChain = ({ name, description, image }) => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar/>

      {/* Full Page Banner Image */}
      <div className="w-full h-[20vh] md:h-[40vh] bg-gray-500">
        <img 
          src={image} 
          alt={name} 
          className="object-cover w-full h-full opacity-50"
        />
      </div>

      {/* Heading and Description */}
      <div className="px-6 py-12 md:py-16 md:px-20 flex flex-col justify-center items-center">
        <h1 className="text-3xl md:text-5xl font-bold text-black mb-6">
          {name}
        </h1>
        <p className="text-gray-700 text-base md:text-lg mb-8 leading-relaxed max-w-3xl">
          {description}
        </p>
        <button className="bg-[#002952] text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-[#004080] transition-colors duration-300 shadow-md">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default SupplyChain;