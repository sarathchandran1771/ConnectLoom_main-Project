import React from "react";
import "./Home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Rightbar from "../../components/Rightbar/Rightbar";

const Home = () => {
  return (
    <div>
      <div className="homeSubContainer">
        <div className="homeSidebar">
          <Sidebar />
        </div>
        <div className="homeRightbar">
          <Rightbar />
        </div>
      </div>
    </div>
  );
};

export default Home;
