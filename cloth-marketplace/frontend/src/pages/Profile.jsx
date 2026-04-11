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
