import React, { useState, useEffect } from "react";
import "./RedirectedNotification.css"
import Divider from "@mui/material/Divider";
import QuiltedImageList from './notifiedImageList'
import {
  useGetProfileDataMutation,
  useGetNotifiedDataMutation,
  useGetCommentsMutation
} from "../../../Shared/redux/userSlices/userSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PostUnavailable from './PostUnavailable'

const RedirectedNotification = () => {
  const [userProfileData] = useGetProfileDataMutation();
  const [notifiedData] = useGetNotifiedDataMutation();
  const [getCommentOnPost] = useGetCommentsMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [profileMappedData, setProfileMappedData] = useState([]);
  const [mappedData, setMappedData] = useState([]);
  const [notifiedPostData, setNotifiedPostData] = useState([]);
  const [notifiedLikedData, setNotifiedLikedData] = useState([]);
  const [comments, setComments] = useState([]);
  const userId = userInfo._id;
  const {notifyId} = useParams();


  useEffect(() => { 
    const fetchData = async () => {
      try {
        const  dataResponse  = await userProfileData({ userId: userId }).unwrap();  
      setMappedData(dataResponse.user)
      setProfileMappedData(dataResponse.postByUser)
      } catch (error) {
        console.error('Error fetching Saved posts:', error);  
      }
    } 
    fetchData();
  }, [userId]); 

  useEffect(() => {
    const notifyData = async () => {
      try {
        const dataResponse  = await notifiedData({ notifyId: notifyId }).unwrap();  
        setNotifiedPostData(dataResponse?.commentData)
        setNotifiedLikedData(dataResponse?.commentData?.post.image)
        console.log("dataResponse",dataResponse)
      } catch (error) { 
        console.error('Error fetching Saved posts:', error);
      }
    }
    notifyData();
  }, [notifyId]);

  const notifiedPostId = notifiedPostData?.post;
  const matchingProfileData = profileMappedData.find(profileData => profileData?._id === notifiedPostId);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (userId !== null) {
          const response = await getCommentOnPost({
            postId: notifiedPostId,
          }).unwrap();
          setComments(response.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };
    fetchComments()
  }, [notifyId]);


console.log("notifiedPostData",notifiedLikedData)
  return (
    <div className='mainNotificationRightbar'> 
      <div className='subMainNotificationRightBar'>  
      <div className='subNotificationRightBar'>
        <div style={{ height:'65vh', width:'45%', marginTop:"2%",marginLeft:'10%', marginRight:"10%", display:"flex"}}>
        {matchingProfileData || notifiedLikedData?(<div style={{height:'65vh', width:"60%"}}>
            <img style={{height:"65vh", width:"100%"}} src={matchingProfileData?.image? matchingProfileData?.image : notifiedLikedData} alt="" />
            </div>)
            :(<PostUnavailable/>)}
          <div style={{width:"40%",border:'0.5px solid #1c2b33'}}>
            <div style={{width:"100%", height:'7.3vh'}}>
              <div style={{display:'flex', marginLeft:3}}>  
                <div style={{paddingLeft:'7px', paddingTop:'10px'}}>
                 <img style={{height:'40px', width:'40px', borderRadius:'50%'}} src={mappedData?.profilePic} alt="" />
                </div>
                <div style={{paddingLeft:'5px'}}>
                  <p style={{fontSize:18}}>{mappedData?.username}</p>
                </div>
              </div>
            </div>
            <Divider sx={{ width: "100%", borderColor: "#2d2c44" }} />

            <div style={{padding:2}}>
            <div style={{ height: '56vh', padding: 3, overflow: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'transparent transparent' }}>
                <div style={{display:'flex',padding:0, margin:0}}>
                  <div style={{paddingLeft:'6px', paddingTop:'15px'}}> 
                    <img style={{height:'30px', width:'30px', borderRadius:'50%'}} src={mappedData?.profilePic}  alt="" />
                  </div>
                  <div style={{paddingLeft:'6px',paddingTop:'4px'}}>
                  <p style={{fontSize:15}}>{mappedData?.username}</p>
                </div>
                </div>
                <div style={{ paddingLeft: '45px', maxWidth: "100%", overflowX: 'hidden'}}>
                  <p style={{overflowWrap: 'break-word', maxWidth: "80%"}}>Sometimes it takes a good fall to really know where you stand.... ---------- @__picsography_ ----------- #naturalphotography#indianphotographyhub#indian_photography#keralatravel #kerala #photographers_of_india #photography #wildlifephotography #forest #coconut #coconuts #pics #snap #snapseed #picsart #lumix #eve #evening</p>
                </div>
                
                
                {comments.map(comment => (
                  <div key={comment._id} style={{ display: 'flex', padding: 0, margin: 0 }}>
                    <div style={{ paddingLeft: '6px', paddingTop: '15px' }}>
                      <img
                        style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                        src={comment.user.profilePic}
                        alt=""
                      />
                    </div>
                    <div style={{ paddingLeft: '5px', paddingTop: '6px' }}>
                      <p style={{ fontSize: 14 }}>{comment.user.username}</p>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                ))};
                
              </div>
            </div>
          </div>
        </div>
        <div style={{marginTop:5}}>
        <p>
          <span style={{ color: '#A8A8A8' }}>More posts from </span>
          <span style={{ color: 'white' }}>{mappedData?.username}</span>
        </p>
        </div>
        <Divider sx={{ width: "65%", borderColor: "#A8A8A8" }} />
        <div className='morePostsNotificationRightBar'>
          <QuiltedImageList profileMappedData={profileMappedData}/> 
      </div> 
        </div>


      </div>
    </div>
  )
}

export default RedirectedNotification
