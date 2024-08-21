import React from "react";

const ContactForm = () => {
  return (
    <main
      className="flex-grow"
      style={{ backgroundColor: "#002952", paddingBottom: 18 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div
          className="text-center text-4xl mb-12 mt-7 "
          style={{ color: "white", fontWeight: 600 }}
        >
          Want to learn more?
        </div>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Let's Connect!
            </h2>
            <p className="mb-6 text-white">
              Please fill in your contact details and we'll be in touch
            </p>
            <div className="space-y-2 text-white">
              <p>
                <strong>Country:</strong> India
              </p>
              <p>
                <strong>Office:</strong> DTU
              </p>
              <p>
                <strong>Phone:</strong> [Your phone number]
              </p>
              <p>
                <strong>Email:</strong> [Your email address]
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-4 ">
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 text-white">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 text-white">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 text-white">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full px-3 py-2 border rounded resize-y"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactForm;
