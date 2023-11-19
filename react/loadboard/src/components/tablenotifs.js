import React, { useState, useEffect } from "react";

const TableNotif = ({ truckId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4001/");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        if (messageData.type === "Notification") {
          // Check if the notification's truckId matches the passed truckId
          if (messageData.truckerId === truckId) {
            setNotifications((prevNotifications) => [...prevNotifications, messageData]);
          }
        } else if (messageData.type === "End") {
          setNotifications([]); // Clear the data if it's the end of the day
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Clean up the WebSocket connection when the component unmounts or truckId changes
    return () => {
      console.log("Closing WebSocket connection");
      socket.close();
    };
  }, [truckId]); // Depend on truckId so that the effect runs again if truckId changes

  return (
    <div className="notifications">
      <h2>Notifications</h2>
      <table className="notif-table">
        <thead>
          <tr>
            <th>Truck ID</th>
            <th>Load ID</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notif, index) => (
            <tr key={index} className="notif-rows"> {/* Use notif._id if available for uniqueness */}
              <td>{notif.truckerId}</td>
              <td>{notif.loadId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableNotif;
