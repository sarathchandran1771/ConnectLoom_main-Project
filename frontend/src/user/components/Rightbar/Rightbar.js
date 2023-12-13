import React,{useState,useEffect} from "react";
import "./Rightbar.css";
import Post from "../post/post";
import sampleProfile from "../../Icons/sample_profile.JPG";
import { useGetAllPostsMutation, useGetDataPostedMutation } from "../../../Shared/redux/userSlices/userSlice";
import { toast } from 'react-toastify';
import {useSelector,useDispatch } from "react-redux";
import { setPostData } from "../../../Shared/redux/userSlices/postSlice";


export default function Rightbar() {

const dispatch=useDispatch()

useEffect(()=>{
  gettingPost()
  },[])
  
  
  const {userInfo} = useSelector((state) => state.auth);

  const [profileData, setProfileData] = useState([]);
  
  const [ data ] =   useGetDataPostedMutation()

  const [fetchPostApi, {isLoading}] = useGetAllPostsMutation() 
  
  const gettingPost = async(req,res) => {
    try {
      const res = await fetchPostApi().unwrap(); 
      setProfileData(res);
      console.log("res",res)
      dispatch(setPostData(res))
    } catch (err) {
      console.log("errorororor")
      toast.error(err?.data?.message || err.error);
    }
  };
  
  return (
    <div className="mainRightbar">
      <div className="subMainRightBar">
        <div style={{ flex: 1.7, padding: 20 }}>
          <Post item={profileData} />
        </div>
        <div style={{ flex: 2 }}>
          <div style={{ marginRight: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: 20,
                marginTop: 30,
                cursor: "pointer",
              }}
            >
              <img
                src={sampleProfile}
                alt=""
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <div style={{ marginLeft: 10 }}>
                <p style={{ textAlign: "start" }}>Username</p>
                <p
                  style={{
                    marginTop: -15,
                    textAlign: "start",
                    color: "#A8A8A8",
                  }}
                >
                  Profilename
                </p>
              </div>
              <div style={{ marginLeft: "100px", cursor: "pointer" }}>
                <p
                  style={{ color: "#0095F6", fontSize: 15, fontWeight: "500" }}
                >
                  Switch
                </p>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div>
                <p style={{ color: "#A8A8A8", textAlign: "start" }}>
                  Suggested for you
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 20,
                    marginTop: -20,
                  }}
                >
                  <img
                    src="https://img.freepik.com/free-photo/front-view-smiling-stretching-girl_7502-8899.jpg"
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{ marginLeft: 10, textAlign: "start" }}>saya </p>
                    <p
                      style={{
                        textAlign: "start",
                        marginLeft: 10,
                        marginTop: -14,
                        color: "#A8A8A8",
                      }}
                    >
                      Follow you
                    </p>
                  </div>
                  <div style={{ marginLeft: "90px", cursor: "pointer" }}>
                    <p style={{ color: "#0095F6" }}>Follow</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 20,
                    marginTop: -20,
                  }}
                >
                  <img
                    src="https://img.freepik.com/premium-photo/fish-with-smoke-cloud-his-mouth_899894-16569.jpg"
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{ marginLeft: 10, textAlign: "start" }}>
                      discovery
                    </p>
                    <p
                      style={{
                        textAlign: "start",
                        marginLeft: 10,
                        marginTop: -14,
                        color: "#A8A8A8",
                      }}
                    >
                      Follow you
                    </p>
                  </div>
                  <div style={{ marginLeft: "90px", cursor: "pointer" }}>
                    <p style={{ color: "#0095F6" }}>Follow</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 20,
                    marginTop: -20,
                  }}
                >
                  <img
                    src="https://replicate.delivery/mgxm/8b4d747d-feca-477d-8069-ee4d5f89ad8e/a_high_detail_shot_of_a_cat_wearing_a_suit_realism_8k_-n_9_.png"
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{ marginLeft: 10, textAlign: "start" }}>
                      natgeoyourshot
                    </p>
                    <p
                      style={{
                        textAlign: "start",
                        marginLeft: 10,
                        marginTop: -14,
                        color: "#A8A8A8",
                      }}
                    >
                      Follow you
                    </p>
                  </div>
                  <div style={{ marginLeft: "90px", cursor: "pointer" }}>
                    <p style={{ color: "#0095F6" }}>Follow</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 20,
                    marginTop: -20,
                  }}
                >
                  <img
                    src="https://pixlr.com/images/index/remove-bg.webp"
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{ marginLeft: 10, textAlign: "start" }}>
                      animalplanetindia
                    </p>
                    <p
                      style={{
                        textAlign: "start",
                        marginLeft: 10,
                        marginTop: -14,
                        color: "#A8A8A8",
                      }}
                    >
                      Follow you
                    </p>
                  </div>
                  <div style={{ marginLeft: "90px", cursor: "pointer" }}>
                    <p style={{ color: "#0095F6" }}>Follow</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 20,
                    marginTop: -20,
                  }}
                >
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9VvfIIj406xJFFC2bOZbcugj2VHKZwjFJAH2EGZ7C_9gIvMadUUcewHFtdNhlFopzOkw&usqp=CAU"
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{ marginLeft: 10, textAlign: "start" }}>
                      natgeoadventure
                    </p>
                    <p
                      style={{
                        textAlign: "start",
                        marginLeft: 10,
                        marginTop: -14,
                        color: "#A8A8A8",
                      }}
                    >
                      Follow you
                    </p>
                  </div>
                  <div style={{ marginLeft: "90px", cursor: "pointer" }}>
                    <p style={{ color: "#0095F6" }}>Follow</p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 20,
                    marginTop: -20,
                  }}
                >
                  <img
                    src="https://www.slazzer.com/static/images/upload/sample-1.jpg"
                    alt=""
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p style={{ marginLeft: 10, textAlign: "start" }}>
                      natgeotravel
                    </p>
                    <p
                      style={{
                        textAlign: "start",
                        marginLeft: 10,
                        marginTop: -14,
                        color: "#A8A8A8",
                      }}
                    >
                      Follow you
                    </p>
                  </div>
                  <div style={{ marginLeft: "90px", cursor: "pointer" }}>
                    <p style={{ color: "#0095F6" }}>Follow</p>
                  </div>
                </div>
              </div>
            </div>
            <p
              style={{
                textAlign: "start",
                marginLeft: 30,
                fontSize: 13,
                color: "#A8A8A8",
              }}
            >
              © 2023 CONNECTLOOM FROM BETA
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
