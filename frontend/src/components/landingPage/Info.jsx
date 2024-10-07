import React, { useState, useEffect } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

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

  // Intersection observer hook to detect when the section is in view
  const { ref, inView } = useInView({
    triggerOnce: true, // Animation will only trigger once
    threshold: 0.5, // Animation starts when 50% of the section is visible
  });

  const [startCount, setStartCount] = useState(false);

  useEffect(() => {
    if (inView) {
      setStartCount(true);
    }
  }, [inView]);

  return (
    <div
      ref={ref}
      className="bg-gradient-to-b from-[#002952] via-[#1F568C] to-[#3476B8] text-white p-10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-left">
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
