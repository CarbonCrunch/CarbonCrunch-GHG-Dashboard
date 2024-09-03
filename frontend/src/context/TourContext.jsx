import React, { createContext, useContext, useState, useEffect } from "react";
import Joyride, { STATUS } from "react-joyride";
import { useAuth } from "./AuthContext";
import axios from "axios";

const TourContext = createContext();

export const TourProvider = ({ children }) => {
  const [runTour, setRunTour] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.hasSeenTour === false) {
      setRunTour(true);
    }
  }, [user]);

  const steps = [
    {
      target: ".tour-scope-charts",
      content: "Here you can view charts for your data.",
      disableBeacon: true,
    },
    {
      target: ".tour-generate-reports",
      content: "Generate reports for your facilities from this section.",
    },
    {
      target: ".tour-add-data",
      content: "Add new data for your facility here.",
    },
    {
      target: ".tour-data-integration",
      content: "Set up integrations for importing data.",
    },
    {
      target: ".tour-upload-bills",
      content: "Upload and view your bills in this section.",
    },
    {
      target: ".tour-insights",
      content: "Get insights to reduce your environmental footprint.",
    },
    {
      target: ".tour-manage-users",
      content: "Add users, facilities, and manage permissions here.",
    },
    {
      target: ".tour-company-info",
      content: "Your company name and current facility are displayed here.",
    },
    {
      target: ".tour-manage-company",
      content:
        "Manage users, facilities, and update your company logo from this menu.",
    },
  ];

  const handleJoyrideCallback = async (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);

      // Make API call to update user's tour status
      try {
        await axios.post("/api/users/hasSeenTour", {
          username: user.username,
          companyName: user.companyName,
        });
      } catch (error) {
        console.error("Failed to update tour status:", error);
      }
    }
  };

  return (
    <TourContext.Provider value={{ runTour, setRunTour }}>
      <Joyride
        steps={steps}
        run={runTour}
        continuous={true}
        showSkipButton={true}
        showProgress={true}
        styles={{
          options: {
            primaryColor: "#3b82f6", // Tailwind blue-500
          },
        }}
        callback={handleJoyrideCallback}
      />
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => useContext(TourContext);
