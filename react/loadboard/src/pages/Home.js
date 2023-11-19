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
    <div>
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
              {activeComponent === 'notifications' && <TableNotif truckId={selectedTruckId} />}
              {activeComponent === 'loads' && <TableLoad truckId={selectedTruckId} />}
              <button 
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={toggleActiveComponent}
              >
                {activeComponent === 'notifications' ? 'Show Loads' : 'Show Notifications'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
