import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const TableLoad = () => {
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
        if (messageData.type === "Load" || messageData.type === "End") {
          //console.log("Message received:", messageData);
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
    <div className="available-loads">
      <h2 className="caption-for-available-table">
        Available Loads
      </h2>
      <div className="temp-available">
        <table className="available-loads-table">
          <thead>
            <tr className="help1">
              <th>
                Load ID
              </th>
              <th>
                Equipment Type
              </th>
              <th>
                Mileage
              </th>
              <th>
                Price
              </th>
              <th>
                Latitude
              </th>
              <th>
                Longitude
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item._id || item.truckId}
                className="help2"
                
              >
                <td>
                  {item.loadId}
                </td>
                <td>
                  {item.equipmentType}
                </td>
                <td>
                  {item.mileage}
                </td>
                <td>
                  {item.price}
                </td>
                <td>
                  {item.originLatitude}
                </td>
                <td>
                  {item.originLongitude}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableLoad;
