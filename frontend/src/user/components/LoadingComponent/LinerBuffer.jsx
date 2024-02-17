import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

export default function LinearDeterminate() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Stack 
      sx={{
        width: '30%',
        position: 'absolute',
        top: '90%',
        left: '60%',
        transform: 'translate(-55%, -55%)',
        color: 'grey.500' }}
        spacing={2}
    >
      <LinearProgress variant="determinate" value={progress} />
      <LinearProgress color="inherit" />
      <LinearProgress color="success" />
    </Stack >
  );
}