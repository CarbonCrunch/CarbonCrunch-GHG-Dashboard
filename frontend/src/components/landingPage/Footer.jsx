import React from "react";
import logoCC from "./assets/logoCC.png";
import insta from "./assets/insta.png";
import link from "./assets/link.png";
import x from "./assets/x.png";

const Footer = () => {
  return (
    <footer className="bg-white pt-12">
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
              <h2 className="text-xl font-bold text-blue-900">Carbon Crunch</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              The only tool sustainability teams need to measure, track, and
              improve ESG metrics, ensuring global compliance within budget.
            </p>
            <div>
              <p className="text-sm font-semibold mb-2">Follow us on :</p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/carboncrunch/" className="text-gray-600 hover:text-gray-800">
                  <img src={insta} style={{ height: 40, width: 40 }} />
                </a>
                <a href="https://www.linkedin.com/company/carbon-crunch/" className="text-gray-600 hover:text-gray-800">
                  <img src={link} style={{ height: 40, width: 40 }} />
                </a>
                
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Company
            </h3>
            <ul className="text-sm">
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Careers
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Blog
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Request Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Product Links */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Product
            </h3>
            <ul className="text-sm">
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Measure
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  Report
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-600 hover:text-gray-800">
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
  );
};

export default Footer;
