import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import EditProfile from '../../components/EditProfile/editProfile'
import './profileEditPage.css'

const ProfileEditPage = () => {
  
  return (
    <div>
    <div>
      <div className='editPageSubContainer'>
        <div className='homeSidebar'>
          <Sidebar />
        </div>
        <div className='editPageRightbar'>
          <EditProfile/>
        </div>
      </div>
    </div>    
  </div>
  )
}

export default ProfileEditPage
