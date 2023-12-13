import React from 'react'
import "./Explore.css"
import ExplorePost from '../../components/ExplorePost/ExplorePost'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useSelector } from 'react-redux';

function Explore() {

  const {profileData} = useSelector((state) => state.postData);


  return (
    <div>
    <div>
      <div className='homeSubContainer'>
        <div className='homeSidebar'>
          <Sidebar />
        </div>
        <div className='exploreRightbar'>
          {profileData.map((item)=>(
          <ExplorePost item={item}/>
          ))}
        </div>
      </div>
    </div>    
  </div>
  )
}

export default Explore
