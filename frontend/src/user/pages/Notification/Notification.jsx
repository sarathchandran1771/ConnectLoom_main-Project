import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import RedirectedNotification from "../../components/redirectedNotification/RedirectedNotification.jsx";
import "./Notification.css";
import Rightbar from "../../components/Rightbar/Rightbar";

const Notification = () => {
  return (
  <div>
    <div className="homeSubContainer">
      <div className="homeSidebar">
         <Sidebar />
      </div>
      <div className="notificationRightbar">
          <RedirectedNotification /> 
      </div>
    </div>
  </div>
  );
};

export default Notification;
