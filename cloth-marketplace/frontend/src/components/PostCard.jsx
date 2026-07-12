// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
// import { getMediaUrl } from '../services/api';
// import './PostCard.css';
//
// const PostCard = ({
//   post,
//   isOwner = false,
//   onDelete
// }) => {
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);
//
//   const handleConnect = () => {
//     if (post.userId) {
//       navigate(`/chat/${post.userId}`);
//     }
//   };
//
//   const handleProfileClick = () => {
//     if (post.userId) {
//       navigate(`/profile/${post.userId}`);
//     }
//   };
// const handleDelete = () => {
//   if (onDelete) {
//     onDelete(post.id);
//   }
// };
//
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Recently';
//
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'Recently';
//
//     const now = new Date();
//     const diffMs = now - date;
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);
//
//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins}m ago`;
//     if (diffHours < 24) return `${diffHours}h ago`;
//     if (diffDays < 7) return `${diffDays}d ago`;
//
//     return date.toLocaleDateString();
//   };
//
//   return (
//     <div className="post-card">
//
// <div className="post-header">
//
//   <div
//     className="post-user-info"
//     onClick={handleProfileClick}
//     style={{ cursor: 'pointer' }}
//   >
//
//     <div className="post-avatar">
//       {post.userProfileImage ? (
//         <img
//           src={getMediaUrl(post.userProfileImage)}
//           alt={post.userName || 'User'}
//           onError={(e) => {
//             e.target.style.display = 'none';
//           }}
//         />
//       ) : (
//         <div className="avatar-placeholder">
//           {post.userName?.charAt(0)?.toUpperCase() || 'U'}
//         </div>
//       )}
//     </div>
//
//     <div className="post-user-details">
//       <h3 className="post-user-name">
//         {post.userName || 'Unknown User'}
//       </h3>
//
//       <div className="post-meta">
//         {post.userLocation && (
//           <>
//             <FaMapMarkerAlt className="location-icon" />
//             <span className="post-location">
//               {post.userLocation}
//             </span>
//           </>
//         )}
//
//         <span className="post-time">
//           • {formatDate(post.createdAt)}
//         </span>
//       </div>
//     </div>
//
//   </div>
//
//   {isOwner && (
//     <button
//       className="delete-icon-btn"
//       onClick={handleDelete}
//       title="Delete Post"
//     >
//      🗑⃨̅
//     </button>
//   )}
//
// </div>
//       {post.description && (
//         <div className="post-description">
//           <p className={expanded ? "expanded" : "collapsed"}>
//             {post.description}
//           </p>
//
//           {post.description.length > 180 && (
//             <span
//               className="see-more"
//               onClick={() => setExpanded(!expanded)}
//             >
//               {expanded ? "See Less" : "See More"}
//             </span>
//           )}
//         </div>
//       )}
//
//       {post.mediaUrl && (
//         <div className="post-media">
//           {post.mediaType === 'image' && (
//             <img
//               src={getMediaUrl(post.mediaUrl)}
//               alt="Post media"
//               className="post-media-image"
//               onError={(e) => {
//                 e.target.style.display = 'none';
//               }}
//             />
//           )}
//
//           {post.mediaType === 'video' && (
//             <video controls className="post-media-video">
//               <source src={getMediaUrl(post.mediaUrl)} />
//               Your browser does not support the video tag.
//             </video>
//           )}
//         </div>
//       )}
//
//       <div className="post-details">
//         {post.clothType && (
//           <div className="detail-item">
//             <span className="detail-label">Type:</span>
//             <span className="detail-value">{post.clothType}</span>
//           </div>
//         )}
//
//         {post.price && (
//           <div className="detail-item">
//             <span className="detail-label">Price:</span>
//             <span className="detail-value">
//               <FaRupeeSign className="rupee-icon" />
//               {Number(post.price).toLocaleString()}



//             </span>
//           </div>
//         )}
//
//         {post.quantity && (
//           <div className="detail-item">
//             <span className="detail-label">Quantity:</span>
//             <span className="detail-value">{post.quantity} units</span>
//           </div>
//         )}
//       </div>
//
//      {!isOwner && (
//        <div className="post-actions">
//          <button
//            className="btn-connect"
//            onClick={handleConnect}
//          >
//            Connect
//          </button>
//        </div>
//      )}
//     </div>
//   );
// };
//
// export default PostCard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './PostCard.css';

// ===== FB STYLE DATE =====
const getTimeAgo = (dateInput) => {
  if (!dateInput) return '';

  let postDate;

  // ✅ Array format handle karo: [2024, 11, 15, 10, 30, 45]
  if (Array.isArray(dateInput)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = dateInput;
    // month - 1 kyunki JS me January = 0
    postDate = new Date(year, month - 1, day, hour, minute, second);
  } else {
    // ✅ String format handle karo: "2024-11-15T10:30:45"
    postDate = new Date(dateInput);
  }

  // ✅ Agar phir bhi invalid date aaye to empty string
  if (isNaN(postDate.getTime())) return '';

  const now = new Date();
  const diffMs      = now - postDate;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours   = Math.floor(diffMinutes / 60);
  const diffDays    = Math.floor(diffHours / 24);
  const diffWeeks   = Math.floor(diffDays / 7);
  const diffMonths  = Math.floor(diffDays / 30);
  const diffYears   = Math.floor(diffDays / 365);

  const timeStr = postDate.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  });

  if (diffSeconds < 60)  return 'Just now';
  if (diffMinutes < 60)  return `${diffMinutes}m ago`;
  if (diffHours < 24)    return `${diffHours}h ago`;
  if (diffDays === 1)    return `Yesterday at ${timeStr}`;
  if (diffDays < 7) {
    const day = postDate.toLocaleDateString('en-IN', { weekday: 'long' });
    return `${day} at ${timeStr}`;
  }
  if (diffWeeks < 4)     return `${diffWeeks}w ago`;
  if (diffMonths < 12)   return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
};

// ===== KITNE CHARACTERS KE BAAD SEE MORE DIKHAO =====
const MAX_LENGTH = 120;

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const baseURL = 'http://localhost:8080/api';

  // ===== SEE MORE STATE =====
  const [expanded, setExpanded] = useState(false);

  const userName         = post.userName         || 'Unknown';
  const userLocation     = post.userLocation     || '';
  const userProfileImage = post.userProfileImage || null;
  const userId           = post.userId;

  const description     = post.description || '';
  const isLong          = description.length > MAX_LENGTH;
  const displayText     = expanded
    ? description
    : description.slice(0, MAX_LENGTH);

  return (
    <div className="post-card">

      {/* ===== HEADER ===== */}
      <div className="post-header">
        <div
          className="post-user-info"
          onClick={() => navigate(`/profile/${userId}`)}
          style={{ cursor: 'pointer' }}
        >
          {/* Avatar */}
          <div className="post-avatar">
            {userProfileImage ? (
              <img
                src={baseURL + userProfileImage}
                alt={userName}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="avatar-placeholder"
              style={{ display: userProfileImage ? 'none' : 'flex' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Name + Location + Date */}
          <div className="post-user-details">
            <span className="post-username">{userName}</span>
            <span className="post-meta">
              {userLocation && (
                <>
                  <FaMapMarkerAlt style={{ fontSize: '10px' }} />
                  <span>{userLocation}</span>
                  <span className="meta-dot"> • </span>
                </>
              )}
              <span
                className="post-date"
                title={
                  post.createdAt
                    ? new Date(post.createdAt).toLocaleString('en-IN')
                    : ''
                }
              >
                {getTimeAgo(post.createdAt)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ===== DESCRIPTION — FB STYLE SEE MORE ===== */}
      {description && (
        <div className="post-description">
          <p>
            {displayText}
            {/* Truncated hai aur expand nahi hua to '...' dikhao */}
            {isLong && !expanded && '... '}
            {/* See more / See less button */}
            {isLong && (
              <span
                className="see-more"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? 'See less' : 'See more'}
              </span>
            )}
          </p>
        </div>
      )}

      {/* ===== MEDIA ===== */}
      {post.mediaUrl && (
        <div className="post-media">
          {post.mediaType === 'video' ? (
            <video
              src={baseURL + post.mediaUrl}
              controls
              className="post-video"
            />
          ) : (
            <img
              src={baseURL + post.mediaUrl}
              alt="Post media"
              className="post-image"
            />
          )}
        </div>
      )}

      {/* ===== PRODUCT INFO ===== */}
      <div className="post-product-info">
        {post.clothType && (
          <span>Type: <strong>{post.clothType}</strong></span>
        )}
        {post.price && (
          <span>Price: <strong>₹{post.price}</strong></span>
        )}
        {post.quantity && (
          <span>Quantity: <strong>{post.quantity} units</strong></span>
        )}
      </div>

      {/* ===== CONNECT BUTTON ===== */}
      <button
        className="connect-btn"
        onClick={() => navigate(`/chat/${userId}`)}
      >
        Connect
      </button>

    </div>
  );
};

export default PostCard;