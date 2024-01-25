import * as React from 'react';
import Box from '@mui/joy/Box';
import Skeleton from '@mui/joy/Skeleton';

export default function GeometrySkeleton() {
  return (
    <div>
      <Box sx={{ m: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Skeleton variant="circular" width={48} height={48}sx={{ backgroundColor:'white'}} />
        <div>
          <Skeleton variant="rectangular" width={200} height="1em" sx={{ mb: 1,backgroundColor:'white' }} />
          <Skeleton variant="rectangular" width={140} height="1em" sx={{ backgroundColor:'white'}} />
        </div>
      </Box>
    </div>
  );
}
