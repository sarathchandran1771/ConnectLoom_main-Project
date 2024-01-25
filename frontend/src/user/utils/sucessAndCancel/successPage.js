// SuccessPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import './successpage.css'

const SuccessPage = () => {
  const navigate = useNavigate()
  
  const backToProfile = ()=>{
    navigate('/profile')
  }

  return (
    <div className='baseSuccessPage'>
      <div className='SuccessBg'>
        <div className="centeredContent">
          <h1 style={{ textAlign: 'center' }}>Payment Successful!</h1>
          <p style={{ color: 'black', textAlign: 'center' }}>
            Thank you for your purchase. Your order has been successfully processed.
          </p>

        </div>
      </div>
      <Stack className='SuccessButton' direction="row" spacing={2}>
            <Button onClick={backToProfile} variant="contained" color="success">
              Back to Profile
            </Button>
          </Stack>
    </div>
  );
};

export default SuccessPage;
