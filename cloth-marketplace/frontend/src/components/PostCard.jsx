import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import './PostCard.css';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const baseURL = 'http://localhost:8080';

  const handleConnect = () => {
    navigate(`/chat/${post.userId}`);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.userId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user-info" onClick={handleProfileClick}>
          <div className="post-avatar">
            {post.userProfileImage ? (
              <img src={baseURL + post.userProfileImage} alt={post.userName} />
            ) : (
              <div className="avatar-placeholder">
                {post.userName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="post-user-details">
            <h3 className="post-user-name">{post.userName}</h3>
            <div className="post-meta">
              <FaMapMarkerAlt className="location-icon" />
              <span className="post-location">{post.userLocation}</span>
              <span className="post-time">• {formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      {post.description && (
        <div className="post-description">
          <p>{post.description}</p>
        </div>
      )}

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="post-media">
          {post.mediaType === 'image' ? (
            <img src={baseURL + post.mediaUrl} alt="Post media" />
          ) : post.mediaType === 'video' ? (
            <video controls>
              <source src={baseURL + post.mediaUrl} />
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
      )}

      {/* Post Details */}
      <div className="post-details">
        {post.clothType && (
          <div className="detail-item">
            <span className="detail-label">Type:</span>
            <span className="detail-value">{post.clothType}</span>
          </div>
        )}
        {post.price && (
          <div className="detail-item">
            <span className="detail-label">Price:</span>
            <span className="detail-value">
              <FaRupeeSign className="rupee-icon" />
              {post.price.toLocaleString()}
            </span>
          </div>
        )}
        {post.quantity && (
          <div className="detail-item">
            <span className="detail-label">Quantity:</span>
            <span className="detail-value">{post.quantity} units</span>
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button className="btn-connect" onClick={handleConnect}>
          Connect
        </button>
      </div>
    </div>
  );
};

export default PostCard;
