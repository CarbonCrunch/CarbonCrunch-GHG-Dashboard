import React, { useRef } from "react";
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

  const contactRef = useRef(null);

  const scrolltoContact=()=>{
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const whyRef = useRef(null);
  const scrolltowhy = () => {
    whyRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div>
      <Navbar scrolltoContact={scrolltoContact} scrolltowhy={scrolltowhy}/>
      <HeroSection/>
      <Info />
      <WorldMap />
      <OurServices/>  
      <div ref={whyRef}>    
      <WhyUs />
      </div>
      <CarbonRiskCalculator/>
      <div ref={contactRef}>
      <ContactForm />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
