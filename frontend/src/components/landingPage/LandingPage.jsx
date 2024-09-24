import React from "react";
import Navbar from "./NavBar.jsx";
import WhyUs from "./Whyus.jsx";
import ContactForm from "./ContactForm.jsx";
import Footer from "./Footer.jsx";
import WorldMap from "./WorldMap.jsx";
import Info from "./Info.jsx";
import CarbonRiskCalculator from "./CarbonRiskCalculator.jsx";
import OurServices from "./OurServices.jsx";
import HeroSection from "./HeroSection.jsx";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <HeroSection/>
      <Info />
      <WorldMap />
      <OurServices/>      
      <WhyUs />
      <CarbonRiskCalculator/>
      <ContactForm />
      <Footer />
    </div>
  );
};

export default LandingPage;
