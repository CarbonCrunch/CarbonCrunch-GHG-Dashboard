import React, { useState, useEffect } from "react";

const Tagline = () => {
  const [activeStep, setActiveStep] = useState(1);
  const steps = ["Measure", "Analyze", "Report"];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prevStep) => (prevStep % steps.length) + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, [steps.length]);

  const handleStepClick = (index) => {
    setActiveStep(index + 1);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 mt-8 mb-8">
      <div className="flex items-center justify-between mb-10">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div
              onClick={() => handleStepClick(index)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
                ${
                  activeStep > index
                    ? "bg-green-500 text-white border-2 border-green-500"
                    : "bg-white text-gray-700 border-2 border-gray-300"
                }
                font-bold text-sm
              `}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`
                flex-grow h-0.5 mx-2
                ${activeStep > index + 1 ? "bg-green-500" : "bg-gray-300"}
              `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div
        style={{ backgroundColor: "#A6D3A0" }}
        className="p-6 rounded-lg min-h-[150px]"
      >
        <h2 className="text-xl font-bold mb-4">{steps[activeStep - 1]}</h2>
        <p>Content for {steps[activeStep - 1]}</p>
      </div>
    </div>
  );
};

export default Tagline;
