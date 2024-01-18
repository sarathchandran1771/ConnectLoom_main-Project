import React, { useState, useEffect } from "react";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import SendIcon from "@mui/icons-material/Send";
import {
  useGetChatUsersMutation,
  useAddMessageMutation,
  useGetAllMessageMutation,
  useCreateChatRoomMutation,
} from "../../../Shared/redux/userSlices/userSlice";
import { useSelector } from "react-redux";
import Default_profileIcon from "../../Icons/Default_ProfilePic.jpg";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";
import io from "socket.io-client";
import { ChatState } from "./chatContext/chatContext";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const ChatMessage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [chatUsers] = useGetChatUsersMutation();
  const [chatContent] = useAddMessageMutation();
  const [getChatContent] = useGetAllMessageMutation();
  const [createRoom] = useCreateChatRoomMutation();



  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [chatUsersData, setChatUsersData] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const userId = userInfo?._id;
  const [typedMessage, setTypedMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();

  const {user,selectedChat,setSelectedChat} = ChatState();


  const generateChatRoomId = async (toUser) => {
    try {
      const response = await createRoom({
        fromUserId: userId,
        toUserId: toUser,
      });
      if (response.data && response.data.chatRoom) {
        setSelectedChat(response.data.chatRoom);
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChatData = async () => {
    try {
      if (userId) {
        // Fetch chat users
        const usersResponse = await chatUsers({ userId });
        setChatUsersData(usersResponse.data.users);
      }
    } catch (error) {
      console.error("Error fetching chat data:", error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      // Fetch chat content
      const getChatResponse = await getChatContent({
        fromUserId: userId,
        toUserId: selectedUserId,
      });
      setMessages(getChatResponse.data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) { 
      console.error("Error fetching chat data:", error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userInfo);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  //workspace
const typingHandler = (e) =>{
  setNewMessage(e.target.value)
}


const handleSendMessage = async () => {
  if (newMessage.trim() !== "") {
    try {
      const data = {
        fromUserId: userId,
        toUserId: selectedUserId,
        message: newMessage || selectedEmoji,
      };
      setNewMessage("");

      const response = await chatContent(data).unwrap();
      if (response) {
        // Emit the message to the socket
        socket.emit("new message", response);
      } else {
        console.error("Failed to get sender information from the response");
      }
      // const standardizedMessage = {
      //   createdAt: response.messageData.createdAt,
      //   fromSelf: response.messageData.sender,
      //   message: response.messageData.content.text,
      //   chatRoom: response.messageData.chatRoom,
      //   profilepic: response.messageData.users.profilePic
      // };

      setMessages([...messages,response.messageData])
      setSelectedEmoji(null);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle other errors if needed
    }
  }
};

useEffect(() => {
  fetchChatData();
}, []);

useEffect(() => {
  fetchMessages();
  selectedChatCompare = selectedChat;
}, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chatRoom._id) {
         // give notification
        // console.log("after give notification:",newMessageReceived);
      } else {
        const standardizedMessage = {
          createdAt: newMessageReceived.messageData.createdAt,
          fromSelf: newMessageReceived.messageData.sender,
          message: newMessageReceived.messageData.content.text,
          chatRoom: newMessageReceived.messageData.chatRoom,
          profilepic: newMessageReceived.messageData.users.profilePic
        };
        // Update state with all messagesl
        setMessages([...messages,standardizedMessage]);
      }
    });
  }, [selectedUserId, selectedChat]);
  // Click handler to set the selected user ID
  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    generateChatRoomId(userId);
  };


  const markedId = messages.map((user) => user?.fromSelf === userId);
  const handleEmojiIconClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };


  return (
    <div className="mainChatRightbar">
      <div className="subMainChatRightBar">
        <div
          style={{
            display: "flex",
            width: "100%",
            border: "1px solid #8a8a8a",
            height: "99.9vh",
          }}
        >
          <div
            style={{
              border: "1px solid #8a8a8a",
              height: "99.8vh",
              width: "20%",
            }}
          >
            <div className="profileContainer">
              <div className="usernameContainer">
                <p className="username">{userInfo.username}</p>
              </div>
              <div className="iconContainer">
                <RateReviewOutlinedIcon color="primary" />
              </div>
            </div>

            <div style={{ borderTop: "1px solid #8a8a8a", height: "88vh" }}>
              {chatUsersData.map((user) => (
                <div
                  key={user?._id}
                  className="userContainer"
                  onClick={() => handleUserClick(user?._id)}
                >
                  <div className="profileImageContainer">
                    <img
                      className="profileImage"
                      src={user?.profilePic || Default_profileIcon}
                      alt=""
                    />
                  </div>
                  <div className="userInfoContainer">
                    <p className="username">{user?.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedChat ? (
            <>
              <div
                className="messageContainer"
                style={{
                  position: "relative",
                  height: "99.5vh",
                  display: "flex",
                  flexDirection: "column",
                  width: "56.7%",
                }}
              >
                <div
                  className="chatHeader"
                  style={{
                    width: "56.6%",
                    height: 93,
                    position: "fixed",
                    top: 0,
                    border: "1px solid white",
                    backgroundColor: "black",
                    display: "flex",
                    zIndex: 1000,
                  }}
                >
                  <div style={{ paddingLeft: "10px", marginTop: 10 }}>
                    <img
                      style={{
                        height: "80px",
                        width: "80px",
                        borderRadius: "50%",
                      }}
                      src={markedId?.profilePic || Default_profileIcon}
                      alt=""
                    />
                  </div>
                  <div
                    style={{
                      paddingLeft: "10px",
                      marginTop: 15,
                      justifyContent: "center",
                    }}
                  >
                    <p>{markedId.username}</p>
                  </div>
                </div>

                <div
                  className="messageHistory"
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    position: "fixed",
                    overflow: "auto",
                    padding: "10px 10px 60px",
                    display: "flex",
                    top: 93,
                    bottom: 55,
                    width: "55.5%",
                    flexDirection: "column-reverse",
                  }}
                >
                  {showEmojiPicker && (
                    <EmojiPicker
                      onEmojiClick={(event, emojiObject) => {
                        // Handle emoji selection
                        setSelectedEmoji(event);
                      }}
                    />
                  )}

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {messages &&
                      messages.map((message, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent:
                              message?.fromSelf === userId
                                ? "flex-end"
                                : "flex-start",
                            marginBottom: 10,
                          }}
                        >
                          {message?.fromSelf !== userId && (
                            <img
                              style={{
                                height: "20px",
                                width: "20px",
                                borderRadius: "50%",
                                marginTop: 25,
                                marginLeft: 5,
                              }}
                              src={
                                (message?.chatRoom?.userIds &&
                                  message?.chatRoom?.userIds[1] &&
                                  message?.chatRoom?.userIds[1]?.profilePic) ||
                                Default_profileIcon
                              }
                              alt=""
                            />
                          )}
                          {message?.fromSelf === userId && (
                            <img
                              style={{
                                height: "20px",
                                width: "20px",
                                borderRadius: "50%",
                                marginTop: 25,
                                marginLeft: 5,
                              }}
                              src={
                                (message?.chatRoom?.userIds &&
                                  message?.chatRoom?.userIds[0] &&
                                  message?.chatRoom?.userIds[0]?.profilePic) ||
                                Default_profileIcon
                              }
                              alt=""
                            />
                          )}
                          <p
                            style={{
                              flex: 1,
                              textAlign:
                                message?.fromSelf === userId ? "right" : "left",
                              maxWidth: "30%",
                              border: "none",
                              borderRadius: 25,
                              backgroundColor:
                                message?.fromSelf === userId
                                  ? "#3797F0"
                                  : "#262626",
                              paddingRight: 6,
                              paddingLeft: 8,
                              paddingTop: 8,
                              paddingBottom: 8,
                              fontSize: 16,
                              wordWrap: "break-word",
                            }}
                          >
                            {message?.message}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>


                <div
                  className="messageInput"
                  style={{
                    position: "fixed",
                    bottom: 0,
                    width: "55%",
                    padding: 10,
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      borderRadius: 8,
                      justifyContent: "end",
                      border: "1px solid white",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          left: "5px",
                          top: "70%",
                          marginRight: 5,
                          transform: "translateY(-50%)",
                        }}
                      >
                        <InsertEmoticonIcon
                          color="warning"
                          onClick={handleEmojiIconClick}
                        />
                      </div>

                      <input
                        type="text"
                        placeholder=" message..."
                        style={{
                          boxSizing: "border-box",
                          width: "100%",
                          height: "5vh",
                          padding: 5,
                          borderRadius: 8,
                          marginLeft: 15,
                          outline: "none",
                        }}
                        value={
                          selectedEmoji
                            ? `${newMessage} ${selectedEmoji.emoji}`
                            : newMessage
                        }
                        onChange={typingHandler}
                      />

                      <div
                        style={{
                          position: "absolute",
                          right: "5px",
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <SendIcon color="primary" onClick={handleSendMessage} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p
              style={{
                textAlign: "center",
                width: "60%",
                marginTop: 400,
                fontSize: 26,
              }}
            >
              Select a friend for your messages
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
