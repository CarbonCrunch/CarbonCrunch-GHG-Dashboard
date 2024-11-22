import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../../NavBar';
import ghgservices from '../../assets/ghgservice.png';
import Footer from '../../Footer';
import ghgvid from '../../assets/ghgvid.mp4';
import emissions from '../../assets/GHG-Emissions.jpg'
import { Parallax } from 'react-parallax';
import ghgpix from '../../assets/ghgpix.jpg';
import logoCC from "../../assets/logoccTrans.png";
import insta from "../../assets/insta.png";
import link from "../../assets/link.png";

const GHG = () => {
  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState(0);
  const [imageVisible, setImageVisible] = useState(false);
  const [fadeInSections, setFadeInSections] = useState([false, false, false]);
  const imgRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.5, // Trigger when at least 50% of the section is in view
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        const index = sectionRefs.current.indexOf(entry.target);
        if (entry.isIntersecting) {
          setActiveSection(index);
          setFadeInSections((prev) => {
            const updatedSections = [...prev];
            updatedSections[index] = true;
            return updatedSections;
          });

          // Trigger image animation if the image is in the current section
          if (entry.target.querySelector('img')) {
            entry.target.querySelector('img').classList.add('animate-fadeIn');
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Carbon Crunch?",
      answer: "Carbon Crunch is a platform designed to help businesses monitor and optimize their carbon emissions.",
    },
    {
      question: "How does GHG Reporting work?",
      answer: "GHG Reporting involves tracking emissions across Scope 1, Scope 2, and Scope 3 categories to ensure regulatory compliance.",
    },
    {
      question: "What is BRSR Reporting?",
      answer: "BRSR Reporting is a framework for businesses to disclose their sustainability and ESG practices in a structured format.",
    },
    {
      question: "Can Carbon Crunch integrate with existing systems?",
      answer: "Yes, Carbon Crunch is designed to integrate seamlessly with your current systems for streamlined sustainability reporting.",
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <Navbar />
      </div>

      {/* Add padding to avoid overlap with fixed navbar */}
      <div className="pt-4">

        {/* GHG Reporting Section */}
        <section
          ref={(el) => (sectionRefs.current[0] = el)}
          className={`h-screen w-full bg-white text-center flex flex-col items-center justify-center 
            relative z-10 transition-opacity duration-700 ease-in-out`}
        >
          <div className={`font-paralucent-light text-8xl mt-24 transition-opacity duration-1000 ease-in-out ${fadeInSections[0] ? 'opacity-100' : 'opacity-0'}`}>
            GHG Reporting
          </div>

          {/* Image with fade-in effect */}
          <img
            src={ghgservices}
            alt="ghgservices"
            className={`w-96 h-auto mt-10 transition-opacity duration-1000 ease-in-out ${imageVisible ? 'opacity-100' : 'opacity-0'
              }`}
          />

          <div className={`font-paralucent-extralight text-3xl mt-10 transition-opacity duration-1000 ease-in-out ${fadeInSections[0] ? 'opacity-100' : 'opacity-0'}`}>
            Greenhouse Gas (GHG) Emissions Inventory
          </div>
        </section>

        {/* Our Mission Section */}
        <section
          ref={(el) => (sectionRefs.current[1] = el)}
          className={`h-screen w-full bg-gradient-to-b from-[#1F568C] to-[#002952] text-white flex flex-col items-center justify-center 
            relative z-10 transition-opacity duration-700 ease-in-out p-8 md:p-20`}
        >
          <video
            src={ghgvid}
            autoPlay
            loop
            muted
            playsInline
            className="w-1/2 h-auto mb-8 rounded-2xl transition-opacity duration-1000 ease-in-out"
          ></video>
          <h3 className={`font-paralucent-light text-lg md:text-4xl font-light text-gray-300 mb-8 transition-opacity duration-1000 ease-in-out ${fadeInSections[1] ? 'opacity-100' : 'opacity-0'}`}>
            Our Mission
          </h3>
          <p className={`text-3xl md:text-4xl font-paralucent-extralight leading-relaxed md:leading-relaxed text-center transition-opacity duration-1000 ease-in-out ${fadeInSections[1] ? 'opacity-100' : 'opacity-0'}`}>
            Carbon Crunch’s GHG Accounting empowers businesses to measure and manage emissions with precision, covering Scopes 1, 2, and 3. Through automated data collection and real-time insights, we provide accurate tracking that meets regulatory demands and drives meaningful, sustainable change.
          </p>
        </section>

        {/* Gain a Competitive Edge Section */}
        <section
          ref={(el) => (sectionRefs.current[2] = el)}
          className={`w-full bg-gray-50 text-center flex flex-col items-center justify-center 
        relative z-10 transition-opacity duration-700 ease-in-out py-10 px-4`}
        >
          <h2 className={`text-5xl font-bold text-gray-800 mb-8 transition-opacity duration-1000 ease-in-out ${fadeInSections[2] ? 'opacity-100' : 'opacity-0'}`}>
            What Makes us Special?
          </h2>
          <div className="relative max-w-7xl mx-auto font-paralucent-extralight">
            <div className="grid grid-cols-3 grid-rows-3 gap-8 items-center justify-center">
              <div className="col-start-1 row-start-1 border-t-2 border-gray-300 pt-4 px-4 max-w-md">
                <h3 className="text-3xl text-gray-800">Advanced Data Collection</h3>
                <p className="text-lg text-gray-600 mt-2">
                  Utilize AI-driven OCR for seamless data capture and integrate directly with your pre-existing databases, ensuring accurate and comprehensive emissions tracking.
                </p>
              </div>
              <div className="col-start-3 row-start-1 border-t-2 border-gray-300 pt-4 px-4 max-w-md">
                <h3 className="text-3xl text-gray-800">AI-Powered Insights</h3>
                <p className="text-lg text-gray-600 mt-2">
                  Use advanced AI models to analyze your sustainability performance, identify gaps, and provide actionable recommendations to improve your ESG performance and Investor relations.
                </p>
              </div>
              <div className="col-start-1 row-start-3 border-t-2 border-gray-300 pt-4 px-4 max-w-md">
                <h3 className="text-3xl text-gray-800">End-to-End Support</h3>
                <p className="text-lg text-gray-600 mt-2">
                  From data collection to final report generation, we provide end-to-end support, helping you navigate the complexities of BRSR reporting with ease.
                </p>
              </div>
              <div className="col-start-3 row-start-3 border-t-2 border-gray-300 pt-4 px-4 max-w-md mx-auto">
                <h3 className="text-3xl text-gray-800">Versatile Applications</h3>
                <p className="text-lg text-gray-600 mt-2">
                  Describe the service and how customers or clients can benefit from it.
                </p>
              </div>
            </div>
            <div className="absolute inset-0 flex justify-center items-center">
              <img
                ref={imgRef}
                src={ghgpix}
                alt="Drone"
                className="w-[20rem] h-[20rem] object-contain rounded-full shadow-lg transition-opacity duration-1000 ease-in-out opacity-0"
              />
            </div>
          </div>
        </section>
        <section className="max-w-3xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg mt-24 mb-24">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="w-full text-left text-lg font-medium text-gray-700 focus:outline-none flex justify-between items-center transition-all duration-300"
                >
                  {faq.question}
                  <span
                    className={`text-gray-500 transform transition-transform duration-300 ${openDropdown === index ? "rotate-180" : ""
                      }`}
                  >
                    ▼
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ${openDropdown === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <p className="mt-4 text-gray-600 text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-gradient-to-b from-[#002952] to-[#457bb2]">
          <div className="relative w-full">
            {/* Full-width Image */}
            <img
              src={emissions} // Replace with your image source
              alt="Background"
              className="w-full h-[500px] object-cover opacity-60"
            />

            {/* Minimalistic Overlay Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-black max-w-3xl mx-auto p-4">
                <h2 className="text-3xl md:text-4xl font-semibold mb-2">Empower Your Vision</h2>
                <p className="text-base md:text-lg mb-6">
                  Our solutions bring clarity and insight to help you achieve your sustainability goals.
                </p>
                <button className="bg-green-600 border3 border-green-600 text-white py-2 px-6 rounded-md text-lg hover:bg-white hover:text-gray-800 transition duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer className="bg-gradient-to-b from-[#457bb2] to-[#002952] text-white pt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            {/* Logo and Description */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <img
                  src={logoCC}
                  alt="Carbon Crunch Logo"
                  className="w-14 h-14 mr-3"
                />
                <h2 className="text-xl font-bold text-white">Carbon Crunch</h2>
              </div>
              <p className="text-sm text-gray-200 mb-4">
                The only tool sustainability teams need to measure, track, and
                improve ESG metrics, ensuring global compliance within budget.
              </p>
              <div>
                <p className="text-sm font-semibold mb-2">Follow us on:</p>
                <div className="flex space-x-4">
                  <a
                    href="https://www.instagram.com/carboncrunch/"
                    className="hover:text-blue-200"
                  >
                    <img src={insta} style={{ height: 40, width: 40 }} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/carbon-crunch/"
                    className="hover:text-blue-200"
                  >
                    <img src={link} style={{ height: 40, width: 40 }} />
                  </a>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="text-sm">
                <li className="mb-2">
                  <a href="#" className="text-gray-200 hover:text-blue-300">
                    About Us
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-gray-200 hover:text-blue-300">
                    Careers
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-gray-200 hover:text-blue-300">
                    Blog
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-gray-200 hover:text-blue-300">
                    Contact Us
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-gray-200 hover:text-blue-300">
                    Request Demo
                  </a>
                </li>
              </ul>
            </div>

            {/* Product Links */}
            <div className="w-full md:w-1/4">
              <h3 className="text-lg font-semibold text-white mb-4">Product</h3>
              <ul className="text-sm">
                <li className="mb-2">
                  <a href="#" className="text-gray-200 hover:text-blue-300">
                    Measure
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-gray-200 hover:text-blue-300">
                    Report
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-gray-200 hover:text-blue-300">
                    Calculate
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className=" mt-32 py-4 " style={{ backgroundColor: "#DDDCBD" }}>
          <div className="container mx-auto px-4 text-sm text-center text-gray-700">
            <p>Copyright © 2024 Carbon Crunch. All Rights Reserved.</p>
            <p>
              <a href="#" className="hover:text-gray-800">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-gray-800">
                Cookie Policy
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GHG;