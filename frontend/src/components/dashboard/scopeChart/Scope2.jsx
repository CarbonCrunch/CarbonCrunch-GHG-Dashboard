import React from "react";
const Scope2 = ({ reports }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">
        Scope 2: Location-based emissions from the generation of purchased
        electricity, heat, steam or cooling.
      </h3>
      <div className="grid grid-cols-4 gap-2">
        <div className="col-span-3 border border-gray-900 rounded-md h-20"></div>
        <div className="border border-gray-900 rounded-md h-20"></div>
      </div>
    </div>
  );
};

export default Scope2;
