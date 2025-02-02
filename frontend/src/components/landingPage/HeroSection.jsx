import React from 'react';
import carbonfootprint from './assets/carbonfootprint.png';

const HeroSection = () => {
  return (
    <section className="bg-white py-28 flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-40">
      {/* Left Content */}
      <div className="text-center md:text-left max-w-xl mt-10 md:mt-0">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-4 leading-tight font-poppins">
          Streamline Your Sustainability <br />
          Reporting With <span className="text-[#6DAC31]">CARBON CRUNCH</span>
        </h1>
        <p className="text-[20px] md:text-[24px] font-extralight text-gray-700 mb-6 font-poppins">
          <span className="font-medium">95%</span> Accurate Carbon Calculations Trusted by Industry Leaders
        </p>
      </div>

      {/* Right Content - Image (Hidden on small screens) */}
      <div className="hidden md:block mt-8 md:mt-0">
        <img
          src={carbonfootprint}
          alt="Sustainability Reporting Illustration"
          className="w-[600px] h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default HeroSection;
