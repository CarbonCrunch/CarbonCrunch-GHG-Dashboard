import React from "react";
import Navbar from "./NavBar.jsx";
import Hero from "./Hero.jsx";
import WhyUs from "./Whyus.jsx";
import ContactForm from "./ContactForm.jsx";
import Tagline from "./Tagline.jsx";
import Footer from "./Footer.jsx";
// import WorldMap from "./WorldMap.jsx";

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      {/* <WorldMap /> */}
      <WhyUs />
      <Tagline />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default LandingPage;
