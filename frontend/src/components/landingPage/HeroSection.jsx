import React from 'react';
import carbonfootprint from './assets/carbonfootprints.png';
import "animate.css/animate.compat.css"
import {Globe} from '../ui/globe'

const HeroSection = () => {
  return (
    <section className="bg-white py-36 flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-40 relative overflow-hidden mt-28 z-auto">
      {/* Left Content */}
      <div className="text-center md:text-left max-w-xl mt-10 md:mt-0 flex-grow z-10">
        <h1 className="text-[28px] md:text-[32px] font-semibold text-black mb-4 leading-tight font-poppins">
          Streamline Your Sustainability <br />
          Reporting With <span className="text-[#6DAC31]">CARBON CRUNCH</span>
        </h1>
        <p className="text-[20px] md:text-[24px] font-extralight text-gray-700 mb-6 font-poppins">
          <span className="font-medium">95%</span> Accurate Carbon Calculations Trusted by Industry Leaders
        </p>
      </div>

      {/* Right Content - Image */}
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[65vw] overflow-hidden"> {/* Hidden on small screens, visible on medium and up */}
        <img
          src={carbonfootprint}
          alt="Sustainability Reporting Illustration"
          className="w-[5000px] h-auto object-cover"
          style={{ transform: 'translateX(40%)' }}
        />
      </div>
    </section>
  );
};

export default HeroSection;