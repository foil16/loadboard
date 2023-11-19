import React, { useState } from "react";
import TableLoad from "../components/tableload";
import TableNotif from "../components/tablenotifs";
import Navigation from "../components/navbar";
import Searchbar from "../components/search";
import RealTimeTable from "../components/table";

function Home() {
  const [selectedTruckId, setSelectedTruckId] = useState(null);

  const handleTruckSelect = (truckId) => {
    setSelectedTruckId(truckId);
  };

  const handleBackButtonClick = () => {
    setSelectedTruckId(null);
  };

  return (
    <div>
      <Navigation color="black" />
      <p className="slogan">Revolutionizing the Road, One Load at a Time</p>
      <div className="select-trucker">
        <Searchbar />
      </div>
      <div className="mt-4 flex justify-around items-start">
        {selectedTruckId ? (
          <>
            <div className="flex-1 max-w-md">
              <TableLoad truckId={selectedTruckId} />
            </div>
            <div className="flex-1 max-w-md">
              <TableNotif truckId={selectedTruckId} />
            </div>
            <button 
              className="fixed top-4 left-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleBackButtonClick}
            >
              Back to Truck Selection
            </button>
          </>
        ) : (
          <RealTimeTable onTruckSelect={handleTruckSelect} />
        )}
      </div>
    </div>
  );
}

export default Home;
