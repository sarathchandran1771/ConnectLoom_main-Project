import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

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

const AdvertisementUploadButton = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("key",reader.result);
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  console.log("selectedFile",selectedFile);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (selectedFile) {
      try {
        formData.append("file", selectedFile);
        const response = await fetch(
          "http://localhost:5000/admin/uploadPhoto",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadResult = await response.json();
        handleClose();
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div>
      <Button onClick={handleOpen}>Upload</Button>
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
                  Upload
                </button>
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AdvertisementUploadButton;
