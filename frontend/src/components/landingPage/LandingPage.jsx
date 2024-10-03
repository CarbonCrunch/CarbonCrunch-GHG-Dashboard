import React, { useRef, useEffect } from "react";
import Navbar from "./NavBar.jsx";
import WhyUs from "./Whyus.jsx";
import ContactForm from "./ContactForm.jsx";
import Footer from "./Footer.jsx";
import WorldMap from "./WorldMap.jsx";
import Info from "./Info.jsx";
import CarbonRiskCalculator from "./CarbonRiskCalculator.jsx";
import OurServices from "./OurServices.jsx";
import HeroSection from "./HeroSection.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {

  const contactRef = useRef(null);

  const scrolltoContact=()=>{
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const whyRef = useRef(null);
  const scrolltowhy = () => {
    whyRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration (in milliseconds)
      once: false, // Whether animation should happen only once
    });
  }, []);

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
