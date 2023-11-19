import React, { useState } from "react";
import TableLoad from "../components/tableload";
import TableNotif from "../components/tablenotifs";
import Navigation from "../components/navbar";
import RealTimeTable from "../components/table";

function Home() {
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [showDetails, setShowDetails] = useState(false); // This state will toggle the display of the tables
  const [allNotifications, setAllNotifications] = useState([]);

  const handleTruckSelect = (truckId) => {
    if (truckId !== selectedTruckId) {
      // If a different truck is selected, clear the previous notifications
      setAllNotifications([]); // Clear notifications from previous selection
    }
    setSelectedTruckId(truckId);
    setShowDetails(true);
  };

  const filteredNotifications = allNotifications.filter(
    (notification) => notification.truckId === selectedTruckId
  );

  const handleBack = () => {
    setShowDetails(false); // Hide the TableLoad and TableNotif and show only RealTimeTable
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation color="black" />
      <p className="slogan text-center">
        Revolutionizing the Road,<br></br>
        One <span class="highlight">Load</span> at a Time
      </p>
      <div className="flex justify-center items-start mt-4">
        <div
          className="w-full"
          style={{ display: showDetails ? "none" : "block" }}
        >
          <RealTimeTable onTruckSelect={handleTruckSelect} />
        </div>
        <div
          className="w-1/2"
          style={{ display: showDetails ? "block" : "none" }}
        >
          <TableLoad truckId={selectedTruckId} />
        </div>
        <div
          className="w-1/2"
          style={{ display: showDetails ? "block" : "none" }}
        >
          <TableNotif truckId={selectedTruckId} data={filteredNotifications} />
        </div>
        {showDetails && (
          <button className="back-button" onClick={handleBack}>
            Back
          </button>
        )}
      </div>
    </div>
  );
}

export default Home;
