import React, { useState } from 'react';
import TableLoad from '../components/tableload';
import TableNotif from '../components/tablenotifs';
import Navigation from '../components/navbar';
import Searchbar from '../components/search';
import RealTimeTable from '../components/table';

function Home() {
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [activeComponent, setActiveComponent] = useState('notifications'); // 'notifications' or 'loads'

  const handleTruckSelect = (truckId) => {
    setSelectedTruckId(truckId);
    setActiveComponent('notifications'); // Show notifications first when a truck is selected
  };

  const toggleActiveComponent = () => {
    setActiveComponent(prev => (prev === 'notifications' ? 'loads' : 'notifications'));
  };

  return (
    <div className = "bgimage">
      <Navigation color="black" />
      <p className="slogan">Revolutionizing the Road, One Load at a Time</p>
      <div className="select-trucker">
        <Searchbar />
      </div>
      <div className="flex flex-row mt-4">
        <div className="w-1/2">
          <RealTimeTable onTruckSelect={handleTruckSelect} />
        </div>
        <div className="w-1/2">
          {selectedTruckId && (
            <>
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={toggleActiveComponent}
              >
                {activeComponent === 'notifications' ? 'Show Loads' : 'Show Notifications'}
              </button>
              <div style={{ display: activeComponent === 'notifications' ? 'block' : 'none' }}>
                <TableNotif truckId={selectedTruckId} />
              </div>
              <div style={{ display: activeComponent === 'loads' ? 'block' : 'none' }}>
                <TableLoad truckId={selectedTruckId} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
