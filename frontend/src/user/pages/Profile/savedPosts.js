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
  console.log("selectedPostId",selectedPostId)


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
    <Box
      sx={{
        width: '100%',
        height: 850,
        overflowY: 'auto',
        padding: 0,
        '&::-webkit-scrollbar': {
          width: '0.4em',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <ImageList variant="masonry" cols={5} gap={10}>
        {savedPosts.map((savedPost, index) => (
          <ImageListItem
            key={index}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              '&:hover .coveredLikesAndComments': {
                visibility: 'visible',
              },
            }}
          >
          <img
            src={MoreOptions}
            onClick={() => handleOpen(savedPost?.post._id)}
            style={{ height: 35, width: 35, cursor: 'pointer', zIndex: 1000, position: 'absolute', top: 0, left: 0 }}
            alt=""
          />
            {savedPost.post.image.map((image, imageIndex) => (
              
              <img
                key={imageIndex}
                srcSet={`${image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                src={`${image}?w=248&fit=crop&auto=format`}
                alt=''
                loading="lazy"
              />
            ))}

            <div className="coveredLikesAndComments">
              Likes: {savedPost.post.likes.length} Comments: {savedPost.post.comments.length}
            </div>
          </ImageListItem>
        ))}
      </ImageList>


       <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <ul style={{ listStyle: 'none', textAlign: 'center' }}>
            <li className="MoreText">
              <Typography variant="3" component="h2" onClick={handleSavePost}>
                UnSave
              </Typography>
            </li>
          </ul>
        </Box>
      </Modal>
    </Box>
  );
}