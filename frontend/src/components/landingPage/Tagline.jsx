import React, { useState, useEffect } from "react";

const Tagline = () => {
  const [activeStep, setActiveStep] = useState(1);
  const steps = ["Measure", "Analyze", "Report"];

  // Content data for each step with different layouts
  const stepContents = [
    {
      title: "",
      content: (
        <div
          style={{ backgroundColor: '#A6D3A0', borderRadius: '8px' }}
          className="flex flex-col lg:flex-row max-w-4xl mx-auto my-8 p-6"
        >
          {/* Left side content */}
          <div className="lg:w-2/3 w-full lg:pr-4 mb-4 lg:mb-0">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">Measure</h2>
            <p className="italic text-lg lg:text-lg mb-6">
              Effortlessly capture your emissions data, no matter your size.
            </p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">GHG Accounting and Carbon Footprint Analysis</h3>
              <p className="text-sm text-gray-800 mb-4">
                Precisely measure your carbon emissions across all scopes (1, 2, and 3) using advanced GHG accounting methodologies.
              </p>

              <h3 className="text-lg font-semibold mb-1">Real-Time Emissions Tracking</h3>
              <p className="text-sm text-gray-800 mb-4">
                Monitor your emissions data in real-time, enabling proactive adjustments and strategic decision-making.
              </p>

              <h3 className="text-lg font-semibold mb-1">Data Collection and Verification</h3>
              <p className="text-sm text-gray-800 mb-4">
                Ensure the accuracy of your carbon data with thorough collection and verification processes.
              </p>
            </div>

            <button className="bg-blue-900 text-white px-6 py-3 rounded mt-4">
              Start Your Journey with Us
            </button>
          </div>

          {/* Right side image */}
          <div className="lg:w-1/3 w-full">
            <img
              src="path/to/your-image.png"
              alt="Carbon Footprint Overview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      ),
    },
    {
      title: "",
      content: (
        <div
          style={{ backgroundColor: '#A6D3A0', borderRadius: '8px' }}
          className="flex flex-col lg:flex-row max-w-4xl mx-auto my-8 p-6"
        >
          {/* Left side content */}
          <div className="lg:w-2/3 w-full lg:pr-4 mb-4 lg:mb-0">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">Analyze</h2>
            <p className="italic text-lg lg:text-lg mb-6">
              Turn your data into actionable insights, tailored for your growth stage.
            </p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Emissions Reduction Pathways</h3>
              <p className="text-sm text-gray-800 mb-4">
                Identify key areas for carbon reduction and explore pathways to achieve your sustainability targets.
              </p>

              <h3 className="text-lg font-semibold mb-1">Scenario Analysis and Forecasting</h3>
              <p className="text-sm text-gray-800 mb-4">
                Analyze potential future scenarios to prepare for regulatory changes and market shifts.
              </p>

              <h3 className="text-lg font-semibold mb-1">Benchmarking and Performance Metrics</h3>
              <p className="text-sm text-gray-800 mb-4">
                Compare your emissions data against industry benchmarks and track your performance over time.
              </p>
            </div>

            <button className="bg-blue-900 text-white px-6 py-3 rounded mt-4">
              Get a Free Custom Analysis
            </button>
          </div>

          {/* Right side image */}
          <div className="lg:w-1/3 w-full">
            <img
              src="path/to/your-image.png"
              alt="Carbon Footprint Overview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      ),
    },
    {
      title: "",
      content: (
        <div
          style={{ backgroundColor: '#A6D3A0', borderRadius: '8px' }}
          className="flex flex-col lg:flex-row max-w-4xl mx-auto my-8 p-6"
        >
          {/* Left side content */}
          <div className="lg:w-2/3 w-full lg:pr-4 mb-4 lg:mb-0">
            <h2 className="text-xl lg:text-2xl font-bold mb-2">Report</h2>
            <p className="italic text-lg lg:text-lg mb-6">
              Create clear, compliant reports that speak to your investors and stakeholders.
            </p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">ESG Pattern Alignment and Integration</h3>
              <p className="text-sm text-gray-800 mb-4">
                Integrate your carbon data into comprehensive ESG frameworks, ensuring alignment with global sustainability standards.
              </p>

              <h3 className="text-lg font-semibold mb-1">BRSR Reporting and Compliance</h3>
              <p className="text-sm text-gray-800 mb-4">
                Produce compliant BRSR reports that meet the latest regulatory requirements and demonstrate your commitment to responsible business practices.
              </p>

              <h3 className="text-lg font-semibold mb-1">Stakeholder Communication and Impact Reporting</h3>
              <p className="text-sm text-gray-800 mb-4">
                Craft clear and impactful reports that communicate your sustainability efforts to stakeholders and investors.
              </p>

              <h3 className="text-lg font-semibold mb-1">Automated Reporting Tools</h3>
              <p className="text-sm text-gray-800 mb-4">
                Utilize our automated tools to generate accurate, compliant reports with minimal effort.
              </p>
            </div>

            <button className="bg-blue-900 text-white px-6 py-3 rounded mt-4">
              Generate Your First Report Today!
            </button>
          </div>

          {/* Right side image */}
          <div className="lg:w-1/3 w-full">
            <img
              src="path/to/your-image.png"
              alt="Report Overview"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      ),
    },
  ];

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
    <div className="max-w-4xl mx-auto p-4 mt-8 mb-8">
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
        <h2 className="text-xl font-bold mb-4">{stepContents[activeStep - 1].title}</h2>
        {stepContents[activeStep - 1].content}
      </div>
    </div>
  );
};

export default Tagline;
