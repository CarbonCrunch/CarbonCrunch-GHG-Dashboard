import React, { useState, useEffect, useRef } from "react";
import CountUp from "react-countup";

const Info = () => {
  const stats = [
    {
      value: 98,
      suffix: "%",
      description: "of CEOs agree sustainability is their responsibility",
    },
    {
      value: 2.6,
      suffix: "x",
      description:
        "ESG high performers deliver a higher total shareholder return",
    },
    {
      value: 37,
      suffix: "%",
      description:
        "of the world's largest companies have a public net zero target. Nearly all are off track",
    },
    {
      value: 18,
      suffix: "%",
      description:
        "of companies are cutting emissions fast enough to reach net zero by 2050",
    },
  ];

  const [startCount, setStartCount] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const sectionTop = sectionRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      // Check if the section is in view
      if (sectionTop < windowHeight * 0.75 && sectionTop > 0) {
        setIsVisible(true);
        setStartCount(true); // Start counting when visible
      } else {
        setIsVisible(false); // Hide when it's out of view
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="bg-gradient-to-b from-[#002952] via-[#1F568C] to-[#3476B8] text-white p-10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`text-left transition-opacity duration-1000 ease-in-out transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`} // Apply fade-in and slide-up effect based on visibility
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              {startCount && (
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={2}
                  suffix={stat.suffix}
                />
              )}
            </h2>
            <div className="bg-green-500 h-1 w-16 my-4"></div>
            <p className="text-sm md:text-base">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Info;