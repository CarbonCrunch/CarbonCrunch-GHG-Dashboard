import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Sidebar";
import NavbarD from "../NavbarD";
import { useAuth } from "../../../context/AuthContext";
import { FiTrash2 } from "react-icons/fi"; // Import React Icon for delete button

const ManageFacilities = () => {
  const { user } = useAuth(); // Get user from context
  const [facilities, setFacilities] = useState([]); // State to store facilities

  useEffect(() => {
    const fetchCompanyFacilities = async () => {
      try {
        if (user && user.companyName) {
         const response = await axios.get(
           "/api/facilities/getCompanyFacilities",
           {
             params: { companyName: user.companyName },
             headers: {
               Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
             },
             withCredentials: true, // Ensure cookies are sent
           }
         );


          console.log("response", response.data.data); // Log the entire response to check structure

          // Directly set response.data.data to facilities state
          if (Array.isArray(response.data.data)) {
            setFacilities(response.data.data); // Set facilities state to the entire response array
          } else {
            setFacilities([]); // No data found, reset state to empty array
          }
        }
      } catch (error) {
        console.error("Error fetching company facilities:", error);
      }
    };

    fetchCompanyFacilities(); // Fetch facilities on component mount
  }, [user]);

  // Function to handle delete confirmation and delete request
  const handleDeleteClick = async (facilityId) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
       await axios.delete(
         "/api/facilities/deleteCompanyFacility",
         {
           data: { facilityId }, // Send the facility ID to delete
         },
         {
           headers: {
             Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
           },
           withCredentials: true, // Ensure cookies are sent
         }
       );

        // Refresh the facility list after deletion
        setFacilities((prevFacilities) =>
          prevFacilities.map((user) => ({
            ...user,
            facilities: user.facilities.filter(
              (facility) => facility._id !== facilityId
            ),
          }))
        );
        alert("Facility deleted successfully!");
      } catch (error) {
        console.error("Error deleting facility:", error);
        alert("Failed to delete facility.");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavbarD />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/6 flex-shrink-0 sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-grow p-8">
          <h2 className="text-2xl font-bold mb-6">Manage Facilities</h2>

          {/* Display facilities */}
          {facilities.length > 0 ? (
            facilities.map((user) =>
              user.facilities.map((facility) => (
                <div
                  key={facility._id}
                  className="mb-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-semibold">
                      {facility.facilityName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {facility.facilityLocation}
                    </p>
                  </div>
                  <FiTrash2
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteClick(facility._id)}
                  />
                </div>
              ))
            )
          ) : (
            <p>No facilities found for this company.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageFacilities;
