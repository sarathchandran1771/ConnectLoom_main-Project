import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function StandardImageList(props) {
    const {profileMappedData} = props
  return (
    <ImageList sx={{ width: '65%', height: 450,overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }} cols={3} rowHeight={354}>
      {profileMappedData.map((item) => (
        <ImageListItem key={item._id}>
          <img
            srcSet={`${item.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.image}?w=164&h=164&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}