import React from 'react'
import "./Home.css"
import Sidebar from '../../components/Sidebar/Sidebar'
import Rightbar from '../../components/Rightbar/Rightbar'
export default function Home() {
  return (
    <div>
      <div className='homeSubContainer'>
        <div className='homeSidebar'>
          <Sidebar />
        </div>
        <div className='homeRightbar'>
          <Rightbar />
        </div>
      </div>
    </div>
  );
}
