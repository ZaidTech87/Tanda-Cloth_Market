import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, postAPI } from '../services/api';
import Header from '../components/Header';
import PostCard from '../components/PostCard';
import { FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = 'http://localhost:8080';

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      // Load user profile
      const userResponse = await userAPI.getUser(userId);
      setProfileUser(userResponse.data);

      // Load user posts
      const postsResponse = await postAPI.getUserPosts(userId);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="profile-page">
        <Header />
        <div className="error-container">
          <h2>User not found</h2>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.userId === parseInt(userId);

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-cover"></div>

          <div className="profile-info">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {profileUser.profileImage ? (
                  <img src={baseURL + profileUser.profileImage} alt={profileUser.name} />
                ) : (
                  <div className="avatar-placeholder-large">
                    {profileUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="profile-details">
              <h1 className="profile-name">{profileUser.name}</h1>

              <div className="profile-meta">
                {profileUser.location && (
                  <div className="meta-item">
                    <FaMapMarkerAlt />
                    <span>{profileUser.location}</span>
                  </div>
                )}
                {profileUser.mobile && isOwnProfile && (
                  <div className="meta-item">
                    <FaPhone />
                    <span>{profileUser.mobile}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="profile-posts">
          <h2 className="section-title">
            {isOwnProfile ? 'My Posts' : 'Posts'} ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div className="empty-posts">
              <div className="empty-icon">📦</div>
              <h3>No posts yet</h3>
              <p>{isOwnProfile ? 'Start sharing your cloth products!' : 'This user hasn\'t posted anything yet.'}</p>
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
// import React, { useState, useEffect, useRef } from 'react'; // 1. useRef add kiya
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { userAPI, postAPI } from '../services/api';
// import Header from '../components/Header';
// import PostCard from '../components/PostCard';
// import { FaMapMarkerAlt, FaPhone, FaCamera } from 'react-icons/fa'; // 2. FaCamera icon add kiya
// import './Profile.css';
//
// const Profile = () => {
//   const { userId } = useParams();
//   const { user: currentUser } = useAuth();
//   const [profileUser, setProfileUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//
//   // 3. File input ke liye Ref
//   const fileInputRef = useRef(null);
//   const baseURL = 'http://localhost:8080';
//
//   useEffect(() => {
//     loadProfile();
//   }, [userId]);
//
//   const loadProfile = async () => {
//     setLoading(true);
//     try {
//       const userResponse = await userAPI.getUser(userId);
//       setProfileUser(userResponse.data);
//       const postsResponse = await postAPI.getUserPosts(userId);
//       setPosts(postsResponse.data);
//     } catch (error) {
//       console.error('Error loading profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // 4. Photo upload function
//   const handlePhotoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//
//     const formData = new FormData();
//     formData.append('file', file);
//
//     try {
//       const response = await fetch(`${baseURL}/api/users/${userId}/upload-photo`, {
//         method: 'POST',
//         body: formData,
//       });
//
//       if (response.ok) {
//         alert("Profile photo updated! 🎉");
//         loadProfile(); // Profile reload karein taaki nayi photo dikhe
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//     }
//   };
//
//   if (loading) {
//     return (
//       <div className="profile-page">
//         <Header />
//         <div className="loading-container"><div className="spinner"></div><p>Loading profile...</p></div>
//       </div>
//     );
//   }
//
//   if (!profileUser) {
//     return (
//       <div className="profile-page"><Header /><div className="error-container"><h2>User not found</h2></div></div>
//     );
//   }
//
//   const isOwnProfile = currentUser?.userId === parseInt(userId);
//
//   return (
//     <div className="profile-page">
//       <Header />
//
//       <div className="profile-container">
//         <div className="profile-header">
//           <div className="profile-cover"></div>
//
//           <div className="profile-info">
//             <div className="profile-avatar-wrapper">
//               {/* 5. Yahan onClick add kiya aur isOwnProfile ki condition lagayi */}
//               <div
//                 className={`profile-avatar ${isOwnProfile ? 'editable' : ''}`}
//                 onClick={() => isOwnProfile && fileInputRef.current.click()}
//                 title={isOwnProfile ? "Change Profile Photo" : ""}
//               >
//                 {profileUser.profileImage ? (
//                   // Profile.jsx mein jahan <img> tag hai, wahan ye karein
//                 // src={`${baseURL}${profileUser.profileImage}`} ki jagah ye try karein:
//                <img
//                  src={`${baseURL}${profileUser.profileImage}?t=${new Date().getTime()}`}
//                  alt={profileUser.name}
//                  onError={(e) => {
//                    console.log("Image fail URL:", e.target.src);
//                    e.target.src = 'https://via.placeholder.com/150'; // Fallback image
//                  }}
//                />
//                 ) : (
//                   <div className="avatar-placeholder-large">
//                     {profileUser.name?.charAt(0).toUpperCase()}
//                   </div>
//                 )}
//
//                 {/* 6. Facebook jaisa hover camera icon (sirf apni profile par) */}
//                 {isOwnProfile && (
//                   <div className="avatar-overlay">
//                     <FaCamera />
//                   </div>
//                 )}
//               </div>
//
//               {/* 7. Hidden Input */}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handlePhotoUpload}
//                 style={{ display: 'none' }}
//                 accept="image/*"
//               />
//             </div>
//
//             <div className="profile-details">
//               <h1 className="profile-name">{profileUser.name}</h1>
//               <div className="profile-meta">
//                 {profileUser.location && (
//                   <div className="meta-item"><FaMapMarkerAlt /><span>{profileUser.location}</span></div>
//                 )}
//                 {profileUser.mobile && isOwnProfile && (
//                   <div className="meta-item"><FaPhone /><span>{profileUser.mobile}</span></div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//
//         <div className="profile-posts">
//           <h2 className="section-title">
//             {isOwnProfile ? 'My Posts' : 'Posts'} ({posts.length})
//           </h2>
//           {posts.length === 0 ? (
//             <div className="empty-posts">
//               <div className="empty-icon">📦</div>
//               <h3>No posts yet</h3>
//               <p>{isOwnProfile ? 'Start sharing your cloth products!' : 'This user hasn\'t posted anything yet.'}</p>
//             </div>
//           ) : (
//             <div className="posts-grid">
//               {posts.map(post => <PostCard key={post.id} post={post} />)}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Profile;
//
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { userAPI, postAPI } from '../services/api';
// import Header from '../components/Header';
// import PostCard from '../components/PostCard';
// import { FaMapMarkerAlt, FaPhone, FaCamera } from 'react-icons/fa';
// import './Profile.css';
//
// const Profile = () => {
//   const { userId } = useParams();
//   const { user: currentUser } = useAuth();
//   const [profileUser, setProfileUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//
//   // तुरंत प्रीव्यू दिखाने के लिए एक लोकल स्टेट
//   const [previewImage, setPreviewImage] = useState(null);
//
//   const fileInputRef = useRef(null);
//   const baseURL = 'http://localhost:8080';
//
//   useEffect(() => {
//     loadProfile();
//     // जब भी यूजर बदले, पुराना प्रीव्यू साफ कर दें
//     setPreviewImage(null);
//   }, [userId]);
//
//   const loadProfile = async () => {
//     setLoading(true);
//     try {
//       const userResponse = await userAPI.getUser(userId);
//       setProfileUser(userResponse.data);
//       const postsResponse = await postAPI.getUserPosts(userId);
//       setPosts(postsResponse.data);
//     } catch (error) {
//       console.error('Error loading profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // Photo upload and preview function
//   const handlePhotoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//
//     // 1. स्क्रीन पर तुरंत नया फोटो दिखाने के लिए Local Preview सेट करें
//     const localImageUrl = URL.createObjectURL(file);
//     setPreviewImage(localImageUrl);
//
//     // 2. Backend को भेजने के लिए FormData तैयार करें
//     const formData = new FormData();
//     formData.append('file', file);
//
//     try {
//       const response = await fetch(`${baseURL}/api/users/${userId}/upload-photo`, {
//         method: 'POST',
//         body: formData,
//         // ध्यान रखें: Fetch में FormData भेजते समय Content-Type हेडर खुद सेट करने दें, मैन्युअली न लिखें।
//       });
//
//       if (response.ok) {
//         alert("Profile photo updated! 🎉");
//         loadProfile(); // बैकएंड से फ्रेश डेटा लाएं ताकि डेटाबेस भी सिंक हो जाए
//       } else {
//         alert("Upload failed. Please try again.");
//         setPreviewImage(null); // अगर बैकएंड फेल हुआ तो प्रीव्यू हटा दें
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Error uploading image.");
//       setPreviewImage(null);
//     }
//   };
//
//   if (loading) {
//     return (
//       <div className="profile-page">
//         <Header />
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Loading profile...</p>
//         </div>
//       </div>
//     );
//   }
//
//   if (!profileUser) {
//     return (
//       <div className="profile-page">
//         <Header />
//         <div className="error-container">
//           <h2>User not found</h2>
//         </div>
//       </div>
//     );
//   }
//
//   // String और Number के अंतर को खत्म करने के लिए == (Double Equals) का इस्तेमाल किया है
//   const isOwnProfile = currentUser?.userId == userId;
//
//   // इमेज का सोर्स तय करने का लॉजिक
//   let imageSource = 'https://via.placeholder.com/150'; // Default Fallback
//   if (previewImage) {
//     imageSource = previewImage; // सबसे पहली प्रायोरिटी: तुरंत चुना हुआ लोकल प्रीव्यू
//   } else if (profileUser.profileImage) {
//     // अगर डेटाबेस में इमेज है, तो कैशिंग इशू से बचने के लिए टाइमस्टैम्प जोड़ें
//     imageSource = `${baseURL}${profileUser.profileImage}?t=${new Date().getTime()}`;
//   }
//
//   return (
//     <div className="profile-page">
//       <Header />
//
//       <div className="profile-container">
//         <div className="profile-header">
//           <div className="profile-cover"></div>
//
//           <div className="profile-info">
//             <div className="profile-avatar-wrapper">
//
//               <div
//                 className={`profile-avatar ${isOwnProfile ? 'editable' : ''}`}
//                 onClick={() => isOwnProfile && fileInputRef.current.click()}
//                 title={isOwnProfile ? "Change Profile Photo" : ""}
//               >
//                 {/* अगर प्रीव्यू है या डेटाबेस में इमेज है, तो <img> दिखाएं, वरना पहला अक्षर */}
//                 {previewImage || profileUser.profileImage ? (
//                   <img
//                     src={imageSource}
//                     alt={profileUser.name}
//                     onError={(e) => {
//                       console.log("Image fail URL:", e.target.src);
//                       e.target.src = 'https://via.placeholder.com/150';
//                     }}
//                   />
//                 ) : (
//                   <div className="avatar-placeholder-large">
//                     {profileUser.name?.charAt(0).toUpperCase()}
//                   </div>
//                 )}
//
//                 {/* Hover Camera Icon */}
//                 {isOwnProfile && (
//                   <div className="avatar-overlay">
//                     <FaCamera />
//                   </div>
//                 )}
//               </div>
//
//               {/* Hidden File Input */}
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handlePhotoUpload}
//                 style={{ display: 'none' }}
//                 accept="image/*"
//               />
//             </div>
//
//             <div className="profile-details">
//               <h1 className="profile-name">{profileUser.name}</h1>
//               <div className="profile-meta">
//                 {profileUser.location && (
//                   <div className="meta-item">
//                     <FaMapMarkerAlt />
//                     <span>{profileUser.location}</span>
//                   </div>
//                 )}
//                 {profileUser.mobile && isOwnProfile && (
//                   <div className="meta-item">
//                     <FaPhone />
//                     <span>{profileUser.mobile}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//
//         <div className="profile-posts">
//           <h2 className="section-title">
//             {isOwnProfile ? 'My Posts' : 'Posts'} ({posts.length})
//           </h2>
//           {posts.length === 0 ? (
//             <div className="empty-posts">
//               <div className="empty-icon">📦</div>
//               <h3>No posts yet</h3>
//               <p>{isOwnProfile ? 'Start sharing your cloth products!' : "This user hasn't posted anything yet."}</p>
//             </div>
//           ) : (
//             <div className="posts-grid">
//               {posts.map(post => <PostCard key={post.id} post={post} />)}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Profile;

//
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { userAPI, postAPI } from '../services/api';
// import Header from '../components/Header';
// import PostCard from '../components/PostCard';
// import { FaMapMarkerAlt, FaPhone, FaCamera } from 'react-icons/fa';
// import './Profile.css';
//
// const Profile = () => {
//   const { userId } = useParams();
//   const { user: currentUser, updateUser } = useAuth();
//   const [profileUser, setProfileUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [uploadingImage, setUploadingImage] = useState(false);
//
//   const fileInputRef = useRef(null);
//   const baseURL = 'http://localhost:8080/api';
//
//   useEffect(() => {
//     loadProfile();
//     setPreviewImage(null);
//   }, [userId]);
//
//   const loadProfile = async () => {
//     setLoading(true);
//     try {
//       const userResponse = await userAPI.getUser(userId);
//       setProfileUser(userResponse.data);
//
//       const postsResponse = await postAPI.getUserPosts(userId);
//       setPosts(postsResponse.data);
//     } catch (error) {
//       console.error('Error loading profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // currentUser AuthContext se aata hai aur hamesha "userId" field rakhta hai
//   // (login/signup ke time set hota hai) — "id" nahi. Isi ko follow karo har jagah.
//   const isOwnProfile = currentUser?.userId === parseInt(userId);
//
//   const handleAvatarClick = () => {
//     if (isOwnProfile && !uploadingImage) {
//       fileInputRef.current.click();
//     }
//   };
//
//   const handlePhotoUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//
//     // Upload ke dauran turant local preview dikhao
//     setPreviewImage(URL.createObjectURL(file));
//     setUploadingImage(true);
//
//     try {
//       const response = await userAPI.updateProfileImage(userId, file);
//       const updatedUser = response.data;
//
//       // Yahi backend se saved (persisted) value hai — isiko set karne se
//       // refresh ke baad bhi photo bani rehti hai
//       setProfileUser(updatedUser);
//
//       // AuthContext/localStorage bhi sync rakho taaki naya photo
//       // baaki jagah (Header etc.) bhi turant reflect ho, re-login na karna pade
//       if (isOwnProfile) {
//         updateUser({ profileImage: updatedUser.profileImage });
//       }
//     } catch (error) {
//       console.error('Error uploading profile image:', error);
//       alert('Failed to upload profile picture. Please try again.');
//     } finally {
//       setPreviewImage(null);
//       setUploadingImage(false);
//       e.target.value = ''; // same file dobara select karne ke liye
//     }
//   };
//
//   if (loading) {
//     return (
//       <div className="profile-page">
//         <Header />
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Loading profile...</p>
//         </div>
//       </div>
//     );
//   }
//
//   if (!profileUser) {
//     return (
//       <div className="profile-page">
//         <Header />
//         <div className="error-container">
//           <h2>User not found</h2>
//         </div>
//       </div>
//     );
//   }
//
//   const avatarSrc = previewImage
//     ? previewImage
//     : profileUser.profileImage
//     ? baseURL + profileUser.profileImage
//     : null;
//
//   return (
//     <div className="profile-page">
//       <Header />
//
//       <div className="profile-container">
//         {/* Profile Header */}
//         <div className="profile-header">
//           <div className="profile-cover"></div>
//
//           <div className="profile-info">
//             <div className="profile-avatar-wrapper">
//               <div
//                 className={`profile-avatar ${isOwnProfile ? 'editable' : ''}`}
//                 onClick={handleAvatarClick}
//                 title={isOwnProfile ? 'Change profile photo' : ''}
//               >
//                 {avatarSrc ? (
//                   <img src={avatarSrc} alt={profileUser.name} />
//                 ) : (
//                   <div className="avatar-placeholder-large">
//                     {profileUser.name?.charAt(0).toUpperCase()}
//                   </div>
//                 )}
//
//                 {isOwnProfile && (
//                   <div className="avatar-overlay">
//                     {uploadingImage ? (
//                       <span className="avatar-spinner"></span>
//                     ) : (
//                       <FaCamera />
//                     )}
//                   </div>
//                 )}
//               </div>
//
//               {isOwnProfile && (
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handlePhotoUpload}
//                   accept="image/*"
//                   style={{ display: 'none' }}
//                 />
//               )}
//             </div>
//
//             <div className="profile-details">
//               <h1 className="profile-name">{profileUser.name}</h1>
//
//               <div className="profile-meta">
//                 {profileUser.location && (
//                   <div className="meta-item">
//                     <FaMapMarkerAlt />
//                     <span>{profileUser.location}</span>
//                   </div>
//                 )}
//                 {profileUser.mobile && isOwnProfile && (
//                   <div className="meta-item">
//                     <FaPhone />
//                     <span>{profileUser.mobile}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//
//         {/* Posts Section */}
//         <div className="profile-posts">
//           <h2 className="section-title">
//             {isOwnProfile ? 'My Posts' : 'Posts'} ({posts.length})
//           </h2>
//
//           {posts.length === 0 ? (
//             <div className="empty-posts">
//               <div className="empty-icon">📦</div>
//               <h3>No posts yet</h3>
//               <p>{isOwnProfile ? 'Start sharing your cloth products!' : 'This user hasn\'t posted anything yet.'}</p>
//             </div>
//           ) : (
//             <div className="posts-grid">
//               {posts.map(post => (
//                 <PostCard key={post.id} post={post} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Profile;