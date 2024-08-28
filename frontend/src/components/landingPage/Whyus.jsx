import React from "react";
import auto from "./assets/auto.png";
import ai from "./assets/ai.png";
import cert from "./assets/cert.png";
import work from "./assets/work.png";
import insight from "./assets/insight.png";

const WhyUs = () => {
  return (
    <div
      className="p-6"
      style={{ backgroundColor: "#FEAB4D", paddingBottom: 70 }}
    >
      <h2
        className="text-center text-4xl font-bold mb-10 mt-7"
        style={{ color: "#002952" }}
      >
        Why Us?
      </h2>
      <div className="flex flex-col items-center space-y-8">
        {/* Responsive container for the first row */}
        <div className="flex flex-col md:flex-row justify-center md:space-x-10 space-y-8 md:space-y-0 w-full">
          <div className="bg-white flex flex-col justify-center items-center rounded-lg aspect-square w-full md:w-1/4">
            <img src={auto} style={{ height: 200, width: 200 }} />
            <div style={{ fontSize: 20, fontWeight: 400, color: "#002952" }}>
              Automated Data Collection
            </div>
          </div>
          <div className="bg-white flex flex-col justify-center items-center rounded-lg aspect-square w-full md:w-1/4">
            <img src={ai} style={{ height: 200, width: 200 }} />
            <div style={{ fontSize: 20, fontWeight: 400, color: "#002952" }}>
              AI-Driven Insights
            </div>
          </div>
          <div className="bg-white flex flex-col justify-center items-center rounded-lg aspect-square w-full md:w-1/4">
            <img src={work} style={{ height: 200, width: 200 }} />
            <div style={{ fontSize: 20, fontWeight: 400, color: "#002952" }}>
              Streamlined Workflow
            </div>
          </div>
        </div>
        
        {/* Responsive container for the second row */}
        <div className="flex flex-col md:flex-row justify-center md:space-x-10 space-y-8 md:space-y-0 w-full">
          <div className="bg-white flex flex-col justify-center items-center rounded-lg aspect-square w-full md:w-1/4">
            <img src={insight} style={{ height: 200, width: 200 }} />
            <div style={{ fontSize: 20, fontWeight: 400, color: "#002952" }}>
              Monitoring & Reporting
            </div>
          </div>
          <div className="bg-white flex flex-col justify-center items-center rounded-lg aspect-square w-full md:w-1/4">
            <img src={cert} style={{ height: 200, width: 200 }} />
            <div style={{ fontSize: 20, fontWeight: 400, color: "#002952" }}>
              Simplified Certification Process
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
