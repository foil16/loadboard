

import React, { useState, useEffect } from "react";
import Navigation from "./navbar";

const RealTimeTable = ({ onTruckSelect }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4001/");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        if (messageData.type === "Truck" || messageData.type === "End") {
          console.log("Message received:", messageData);
          if (messageData.type === "End") {
            console.log("End of day detected");
            setData([]); // Clear the data
          } else {
            setData((prevData) => [...prevData, messageData]);
          }
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Clean up the socket when the component unmounts
    return () => {
      console.log("Closing WebSocket connection");
      socket.close();
    };
  }, []);

  const handleRowClick = (truckId) => {
    onTruckSelect(truckId);
  };


  return (

    <div className="bgimage">
      <Navigation></Navigation>
    <div className="carriers">
      <body className="body-select-trucker">

        <div>
          <table>
            <thead>
              <tr>
                <th className="carrier-table-head">
                  Truck ID
                </th>
                <th className="carrier-table-head">
                  Type
                </th>
                <th className="carrier-table-head">
                  Latitude
                </th>
                <th className="carrier-table-head">
                  Longitude
                </th>
              </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr
                key={item._id || item.truckId}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => onTruckSelect(item.truckId)}
              >
                  <td className="newCarrier">
                    {item.truckId}
                  </td>
                  <td className="newCarrier">
                    {item.equipType}
                  </td>
                  <td className="newCarrier">
                    {item.positionLatitude}
                  </td>
                  <td className="newCarrier">
                    {item.positionLongitude}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </body>
    </div>
    </div>
  );
};

export default RealTimeTable;

