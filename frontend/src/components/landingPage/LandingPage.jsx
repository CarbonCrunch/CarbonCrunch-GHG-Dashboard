import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";
import ContactForm from "./ContactForm";
import Prefooter from "./Prefooter";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <ContactForm />
      <Prefooter />
      <Footer />
    </div>
  );
};

export default LandingPage;
