import * as React from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import {
  useGetArchivePostMutation,
  useArchivePostMutation,
} from "../../../Shared/redux/userSlices/userSlice";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MoreOptions from "../../Icons/MoreOptions.png";
import { toast } from "react-toastify";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 220,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

export default function ArchivedPosts() {
  const [getArchivePost] = useGetArchivePostMutation();
  const [archivepost, { LoadingArchive }] = useArchivePostMutation();
  const [archivePosts, setArchivePosts] = React.useState([]);
  const { userId } = useParams();
  const [selectedPostId, setSelectedPostId] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleOpen = (postId) => {
    setSelectedPostId(postId);
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedPostId(null);
    setOpen(false);
  };

  const isArchiveOperation = React.useRef(false);

  const handleArchivePost = async () => {
    try {
      isArchiveOperation.current = true;
      const response = await archivepost({ postId: selectedPostId });
      if (response) {
        toast.success("Post Unarchive successfully");
        handleClose();
      } else {
        toast.error("Error Unarchive post");
      }
    } catch (error) {
      console.error("Error Unarchive post:", error);
      toast.error("Error Unarchive post");
    } finally {
      isArchiveOperation.current = false;
    }
  };
console.log("userId",userId)
  // React.useEffect(() => {
  //   if (!isArchiveOperation.current) {
  //     const fetchData = async () => {
  //       try {
  //         const { data } = await getArchivePost({userId });
  //         if (Array.isArray(data)) {
  //           setArchivePosts(data);
  //         } else {
  //           setArchivePosts([]);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching archive posts:", error);
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [getArchivePost, userId, isArchiveOperation.current]);

  return (
    <Box
      sx={{
        width: "100%",
        height: 850,
        overflowY: "auto",
        padding: 0,
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "transparent",
        },
      }}
    >
      {archivePosts.length === 0 ? (
        <Typography variant="h5" textAlign="center" mt={5}>
          No archived posts available.
        </Typography>
      ) : (
        <ImageList variant="masonry" cols={5} gap={10}>
          {archivePosts.map((post) => (
            <React.Fragment key={post._id}>
              {post.image.map((imageUrl, index) => (
                <ImageListItem
                  key={`${post._id}-${index}`}
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    "&:hover .coveredLikesAndComments": {
                      visibility: "visible",
                    },
                  }}
                >
                  <img
                    src={MoreOptions}
                    onClick={() => handleOpen(post._id)}
                    style={{
                      height: 35,
                      width: 35,
                      cursor: "pointer",
                      zIndex: 1000,
                      position: "relative",
                    }}
                    alt=""
                  />
                  <img
                    srcSet={`${imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    src={`${imageUrl}?w=248&fit=crop&auto=format`}
                    alt={post.title || `Image ${index + 1}`}
                    loading="lazy"
                  />
                  <div className="coveredLikesAndComments">
                    Likes: {post.likes.length} Comments: {post.comments.length}
                  </div>
                </ImageListItem>
              ))}
            </React.Fragment>
          ))}
        </ImageList>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <ul style={{ listStyle: "none", textAlign: "center" }}>
            <li className="MoreText">
              <Typography variant="3" component="h2">
                Delete
              </Typography>
            </li>
            <hr style={{ width: "100%", textAlign: "start" }} />
            <li className="MoreText">
              <Typography
                variant="3"
                component="h2"
                onClick={handleArchivePost}
              >
                Unarchive
              </Typography>
            </li>
          </ul>
        </Box>
      </Modal>
    </Box>
  );
}
