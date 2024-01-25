import React, { useState, useEffect } from 'react';
import {
  useGetUploadedAdToUserMutation
} from '../../../Shared/redux/adminSlices/adminApiSlices';

const AdpostByAdmin = () => {
  const [postAddedFromAdmin] = useGetUploadedAdToUserMutation();
  const [uploadedAds, setUploadedAds] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getAdfromAdmin = async () => {
    try {
      // Execute the query
      const adResponse = await postAddedFromAdmin();
      const adData = adResponse.data;
      const fetchedAds = adData.UploadedAds || [];

      // Update state with the fetched ads
      setUploadedAds(fetchedAds);
    } catch (error) {
      // Handle errors
      console.error('Error fetching ad data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAdfromAdmin();
    };
    fetchData();
  }, []);

  return (
    <div>
      {uploadedAds.map((ad) => (
        <div
          key={ad._id}
          style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '100%',
          }}
        >
          {!imageLoaded && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#ace3de',
                filter: 'blur(10px)',
                visibility: imageLoaded ? 'hidden' : 'visible',
              }}
            />
          )}

          <img
            key={ad._id}
            src={ad.adImage}
            alt=""
            loading="lazy"
            style={{
              opacity: imageLoaded ? 1 : 0,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              transition: 'opacity 0.5s ease',
            }}
            onLoad={() => {
              setImageLoaded(true);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AdpostByAdmin;
