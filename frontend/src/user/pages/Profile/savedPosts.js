import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { useGetSavedPostMutation, useSavePostMutation } from '../../../Shared/redux/userSlices/userSlice';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MoreOptions from "../../Icons/MoreOptions.png";
import { toast } from 'react-toastify';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 220,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 1,
};

export default function SavedPost() {

  const [getSavedPost, {isLoading }] = useGetSavedPostMutation();
  const [savedPostsmanage, {Loading }] = useSavePostMutation();
  const [selectedPostId, setSelectedPostId] = React.useState(null);
  const [savedPosts, setSavedPosts] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const { userId } = useParams();
  const isArchiveOperation = React.useRef(false)

  const handleSavePost = async () => {
    try {
      isArchiveOperation.current = true;
      const response = await savedPostsmanage({ postId: selectedPostId, userId: userId });
  
      if (response) {
        toast.success('Post UnSave successfully');
        handleClose();
      } else {
        toast.error('Error UnSave post');
      }
    } catch (error) {
      console.error("Error UnSave post:", error);
  
      // Log the error details
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
  
      toast.error('Error UnSave post');
    } finally {
      isArchiveOperation.current = false;
    }
  };
  

  useEffect(() => {
    if (!isArchiveOperation.current) {

    const fetchData = async () => {
      try {
        const { data } = await getSavedPost({ userId: userId });
        setSavedPosts(data);
      } catch (error) {
        console.error('Error fetching Saved posts:', error);
      }
    }
    fetchData();
  }
  }, [getSavedPost, userId,isArchiveOperation.current]);




  const handleOpen = (postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPostId(null);
    setOpen(false);
  };


  return (
    <div
      style={{
        width: '100%',
        height: 850,
        overflowY: 'auto',
        padding: 0,
        scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <div style={{ columnCount: 5, columnGap: 10 }}>
        {savedPosts.map((savedPost, index) => (
          <div
            key={index}
            style={{
              position: 'relative',
              overflow: 'hidden',
              '&:hover .coveredLikesAndComments': {
                visibility: 'visible',
              },
              width: '100%',
              marginBottom: '10px', 
              boxSizing: 'border-box', 
            }}
          >
            <img
              src={MoreOptions}
              onClick={() => handleOpen(savedPost?.post._id)}
              style={{
                height: 35,
                width: 35,
                cursor: 'pointer',
                zIndex: 1000,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              alt=""
            />
            {savedPost.post.image.map((image, imageIndex) => (
              <img
              src={`${image}?w=248&h=250&fit=crop&auto=format&dpr=2`}
              alt=""
              loading="lazy"
              style={{
                width: '100%',
                height: '250px',
                objectFit: 'cover',
              }}
            />
            ))}
            <div className="coveredLikesAndComments">
              Likes: {savedPost.post.likes.length} Comments: {savedPost.post.comments.length}
            </div>
          </div>
        ))}
      </div>
  
      <div
        style={{
          display: open ? 'block' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={handleClose}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '5px',
          }}
        >
          <ul style={{ listStyle: 'none', textAlign: 'center', width:250 }}>
            <li className="MoreText" onClick={handleSavePost}>
              UnSave
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
  
}