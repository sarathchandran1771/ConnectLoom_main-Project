import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useGetUploadedAdMutation } from "../../../Shared/redux/adminSlices/adminApiSlices";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: 600,
};

const AdvertisementEditOption = ({ postId: propPostId }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [adPostResponse, setAdPostResponse] = useState([]);
  const [getUploadedAdPost] = useGetUploadedAdMutation();
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [formData, setFormData] = useState({
    adName: "",
    sponsored: "",
    description: "",
    fromDate: "",
    toDate: "",
  });

  const getUploadedAd = async () => {
    try {
      const response = await getUploadedAdPost({});
      const data = response.data.UploadedAds;
      setAdPostResponse(data);
    } catch (error) {
      // Handle any errors that occurred during the mutation
      console.error("Error sending follow request:", error);
    }
  };

  useEffect(() => {
    getUploadedAd();
  }, []);

  useEffect(() => {
    // Find the selected post based on the ID
    const selectedPost = adPostResponse.find(
      (post) => post._id === selectedPostId
    );
    // If a post is found, update the form data
    if (selectedPost) {
      setFormData({
        adName: selectedPost.adName || "",
        sponsored: selectedPost.sponsored || "",
        description: selectedPost.description || "",
        fromDate: selectedPost.fromDate || "",
        toDate: selectedPost.toDate || "",
      });
    }
  }, [selectedPostId, adPostResponse]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (selectedFile) {
      try {
        formData.append("postId", selectedPostId);
        formData.append("file", selectedFile);

        for (const [key, value] of formData.entries()) {
        }
        const response = await fetch(
          "http://localhost:5000/admin/edit-AdPost",
          {
            method: "PATCH",
            body: formData,
          }
        );
        const uploadResult = await response.json();
        getUploadedAd();
        handleClose();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleEditModalOpen = () => {
    handleOpen();
    setSelectedPostId(propPostId);
  };

  return (
    <div>
      <button onClick={handleEditModalOpen}>Edit</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleFormSubmit}>
            <div>
              <div
                style={{
                  display: "flex",
                  marginTop: 30,
                  marginBottom: 30,
                  width: "100%",
                  height: 45,
                }}
              >
                <label htmlFor="adName">Ad Name:</label>
                <input
                  style={{
                    marginLeft: 25,
                    alignItems: "center",
                    width: "100%",
                  }}
                  value={formData.adName}
                  onChange={(e) =>
                    setFormData({ ...formData, adName: e.target.value })
                  }
                  type="text"
                  id="adName"
                  name="adName"
                  required
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 30,
                  marginBottom: 30,
                  width: "100%",
                  height: 45,
                }}
              >
                <label htmlFor="sponsored">Sponsored:</label>
                <input
                  style={{
                    marginLeft: 25,
                    alignItems: "center",
                    width: "100%",
                  }}
                  value={formData.sponsored}
                  onChange={(e) =>
                    setFormData({ ...formData, sponsored: e.target.value })
                  }
                  type="text"
                  id="sponsored"
                  name="sponsored"
                  required
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 30,
                  marginBottom: 30,
                  width: "100%",
                  height: 45,
                }}
              >
                <label htmlFor="description">Description:</label>
                <textarea
                  style={{
                    marginLeft: 25,
                    alignItems: "center",
                    width: "100%",
                  }}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  id="description"
                  name="description"
                ></textarea>
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 30,
                  marginBottom: 30,
                  width: "100%",
                  height: 70,
                }}
              >
                <div style={{ display: "flex", width: "100%", height: 45 }}>
                  <label htmlFor="file">Choose file:</label>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    ref={fileInputRef}
                    onChange={(event) => handleFileChange(event)}
                    required
                  />
                </div>
                {selectedFile && (
                  <div style={{ display: "flex", width: "100%", height: 120 }}>
                    <img
                      src={selectedFile}
                      alt="Selected"
                      style={{ maxWidth: "100%", height: "40px" }}
                    />
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 30,
                  marginBottom: 30,
                  width: "100%",
                  height: 45,
                }}
              >
                <label htmlFor="fromDate">From Date:</label>
                <input
                  style={{
                    marginLeft: 25,
                    alignItems: "center",
                    width: "100%",
                  }}
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  required
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 30,
                  marginBottom: 30,
                  width: "100%",
                  height: 45,
                }}
              >
                <label htmlFor="toDate">To Date:</label>
                <input
                  style={{
                    marginLeft: 25,
                    alignItems: "center",
                    width: "100%",
                  }}
                  type="date"
                  id="toDate"
                  name="toDate"
                  required
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 30,
                  marginBottom: 30,
                  width: "100%",
                  height: 45,
                }}
              >
                <button
                  style={{ alignItems: "center", width: "100%" }}
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AdvertisementEditOption;
