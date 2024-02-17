import React, { useState,useEffect } from "react";
import "./Explore.css"
import ExplorePost from '../../components/ExplorePost/ExplorePost'
import Sidebar from '../../components/Sidebar/Sidebar'
import { useSelector } from 'react-redux';
import { 
  useGetAllPostsMutation
 } from "../../../Shared/redux/userSlices/userSlice";

function Explore() {

  const {profileData} = useSelector((state) => state.postData);
  const [exploreData] = useGetAllPostsMutation();

  const [newExploreData, setNewExploreData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const  dataResponse  = await exploreData();  
        setNewExploreData(dataResponse.data.posts)
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData();
  }, [])

  return (
    <div>
    <div>
      <div className='homeSubContainer'>
        <div className='homeSidebar'>
          <Sidebar />
        </div>
        <div className='exploreRightbar'>
          <ExplorePost newExplores={newExploreData}/>
        </div>
      </div>
    </div>    
  </div>
  )
}

export default Explore

