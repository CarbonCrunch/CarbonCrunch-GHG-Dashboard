import React from "react";
import co2 from "./assets/co2.png";
import graph from "./assets/graph.png";
import brain from "./assets/brain.png";
import Group from "./assets/Group.png";

const WhyUs = () => {
  const cardStyle = {
    background: "linear-gradient(180deg, #E1F0D3 0%, #B2E177 100%)", // Updated gradient
    borderRadius: "15px", // Rounded corners
    padding: "30px", // Reduced padding for better mobile spacing
    textAlign: "left", // Left-align text
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between", // Aligning content as in the image
    height: "250px", // Ensure the divs have equal height
  };

  const imgStyle = {
    width: "100px", // Adjust image size for mobile
    alignSelf: "flex-end", // Align the image to the bottom right corner
  };

  const textStyle = {
    color: "#002952",
  };

  return (
    <div className="p-6 md:p-12 mr-24 ml-24" style={{ backgroundColor: "#FFFFFF" }}>
      <h2 className="text-center text-2xl md:text-4xl font-bold mb-10 mt-7" style={textStyle}>
        Why Us?
      </h2>

      {/* First Row with 1/3 and 2/3 split */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* First div - 1/3 of width */}
        <div className="w-full md:w-1/3 h-full" style={cardStyle}>
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-4" style={textStyle}>
              Automated Data Collection
            </h3>
          </div>
          <div className="flex flex-row gap-4 items-start">
            <p className="text-base md:text-lg" style={textStyle}>
              Our system automates carbon data collection, saving time, reducing errors, and ensuring accurate sustainability reporting.
            </p>
            <img src={co2} alt="Automated Data Collection" style={imgStyle} />
          </div>
        </div>

        {/* Second div - 2/3 of width */}
        <div className="w-full md:w-2/3 h-full" style={cardStyle}>
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-4" style={textStyle}>
              Monitoring & Reporting
            </h3>
          </div>
          <div className="flex flex-row gap-4 items-start">
            <p className="text-base md:text-lg" style={textStyle}>
              Effortlessly track and report carbon emissions with automated monitoring, ensuring accuracy and compliance in sustainability reporting.
            </p>
            <img src={graph} alt="Monitoring & Reporting" style={{ width: "120px" }} />
          </div>
        </div>
      </div>

      {/* Second Row with 2/3 and 1/3 split */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* First div - 1/2 of width */}
        <div className="w-full md:w-1/2 h-full" style={cardStyle}>
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-4" style={textStyle}>
              AI-Driven Insights
            </h3>
          </div>
          <div className="flex flex-row gap-4 items-start">
            <p className="text-base md:text-lg" style={textStyle}>
              Leverage AI-driven insights to uncover hidden patterns, optimize sustainability strategies, and drive impactful decision-making.
            </p>
            <img src={brain} alt="AI-Driven Insights" style={imgStyle} />
          </div>
        </div>

        {/* Second div - 1/2 of width */}
        <div className="w-full md:w-1/2 h-full" style={cardStyle}>
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-4" style={textStyle}>
              Simplified Certification Process
            </h3>
          </div>
          <div className="flex flex-row gap-4 items-start">
            <p className="text-base md:text-lg" style={textStyle}>
              Streamline your certification process with our simplified, automated solution, reducing complexity and ensuring faster compliance.
            </p>
            <img src={Group} alt="Simplified Certification Process" style={{ width: "120px" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
