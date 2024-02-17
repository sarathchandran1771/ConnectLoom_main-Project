import React from 'react'
import MoodBadOutlinedIcon from '@mui/icons-material/MoodBadOutlined';

const PostUnavailable = () => {
  return (
<div style={{ height: '65vh', width: '60%', border: '1px solid #1c2b33', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{ textAlign: 'center' }}>
    <MoodBadOutlinedIcon style={{ color: 'white', fontSize: '4rem' }} />
  </div>
  <div>
    <p style={{fontSize:20}}>Post unavailable</p>
  </div>
</div>

  )
}

export default PostUnavailable
