import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const RealTimeTable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate(); // Initialize navigate function

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
    navigate(`/truckers/${truckId}`); // Navigate to truckers route with truckId parameter
  };

  return (
    <div className="carriers">
      <body className="body-select-trucker">
        <h2>Real-Time Truck Data</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Truck ID
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Latitude
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Longitude
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item) => (
                <tr
                  key={item._id || item.truckId}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(item.truckId)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.truckId}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {item.equipType}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {item.positionLatitude}
                  </td>
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {item.positionLongitude}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </body>
    </div>
  );
};

export default RealTimeTable;
