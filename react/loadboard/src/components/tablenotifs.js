import React, { useState, useEffect } from 'react';

const TableNotif = ({ truckId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // WebSocket connection setup
    const socket = new WebSocket("ws://localhost:4001/");

    socket.onopen = () => {
      console.log("WebSocket connection established");
      // Optionally, if your backend supports it, send a message to the server
      // to subscribe only to notifications for the selected truckId
      socket.send(JSON.stringify({ action: "subscribe", truckId: truckId }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        // Filter out messages that are not notifications or don't match the truckId
        if (message.type === "Notification" && message.truckId.toString() === truckId) {
          setNotifications((prevNotifications) => [...prevNotifications, message]);
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, [truckId]); // This effect should run when truckId changes

  return (
    <div>
      <h2>Notifications for Truck ID: {truckId}</h2>
      <table>
        <thead>
          <tr>
            <th>Truck ID</th>
            <th>Load ID</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, index) => (
            <tr key={index}>
              <td>{notification.truckId}</td>
              <td>{notification.loadId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableNotif;
