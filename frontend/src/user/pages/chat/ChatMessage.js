import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar.js'
import ChatMessage from '../../components/chat/chat.jsx'
import './chatMessage.css'

export default function Home() {
  return (
    <div>
      <div className='homeSubContainer'>
        <div className='homeSidebar'>
          <Sidebar />
        </div>
        <div className='MessageRightbar'>
            <ChatMessage/>
        </div>
      </div>
    </div>
  );
}
