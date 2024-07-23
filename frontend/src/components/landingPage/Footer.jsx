import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-200 py-4">
      <div className="container mx-auto px-4">
        <hr className="mb-4" />
        <div className="text-center text-sm">
          <p>Copyright © 2024 Carbon Crunch. All Rights Reserved.</p>
          <p className="mt-1">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:underline">
              Cookie Policy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
