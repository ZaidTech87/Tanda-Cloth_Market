//
// import React, { useState, useEffect, useCallback } from 'react';
// import { postAPI } from '../services/api';
// import PostCard from '../components/PostCard';
// import Header from '../components/Header';
//
// import './Feed.css';
//
// const Feed = () => {
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//
//   // Static user data for testing
//
//
//   const loadPosts = useCallback(async () => {
//     if (loading || !hasMore) return;
//     setLoading(true);
//     try {
//       const response = await postAPI.getFeed(page, 10);
//       const newPosts = response.data.content;
//
//       if (!newPosts || newPosts.length === 0) {
//         setHasMore(false);
//       } else {
//         setPosts(prev => {
//           const existingIds = new Set(prev.map(p => p.id));
//           const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p.id));
//           return [...prev, ...uniqueNewPosts];
//         });
//         setPage(prev => prev + 1);
//       }
//     } catch (error) {
//       console.error('Error loading posts:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, loading, hasMore]);
//
//   useEffect(() => {
//     loadPosts();
//   }, []);
//
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
//         if (!loading && hasMore) {
//           loadPosts();
//         }
//       }
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [loadPosts, loading, hasMore]);
//
//   return (
//     <div className="feed-page">
//       {/* 1. Navbar Header */}
//       <Header />
//
//
//
//       <div className="feed-container">
//         <div className="feed-content">
//           {posts.length === 0 && !loading && (
//             <div className="empty-state">
//               <div className="empty-icon">📭</div>
//               <h2>No posts yet</h2>
//               <p>Be the first to share your cloth products!</p>
//             </div>
//           )}
//
//           {posts.map((post, index) => (
//             <PostCard key={`${post.id}-${index}`} post={post} />
//           ))}
//
//           {loading && (
//             <div className="loading-container">
//               <div className="spinner"></div>
//               <p>Loading posts...</p>
//             </div>
//           )}
//
//           {!hasMore && posts.length > 0 && (
//             <div className="end-message">
//               <p>You've seen all posts! 🎉</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Feed;

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';
import Header from '../components/Header';
import './Feed.css';

const Feed = () => {

  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = useCallback(async () => {

    if (loading || !hasMore) return;

    setLoading(true);

    try {

      const response = await postAPI.getFeed(page, 10);

      const newPosts = response.data.content;

      if (!newPosts || newPosts.length === 0) {

        setHasMore(false);

      } else {

        setPosts(prev => {

          const existingIds = new Set(prev.map(p => p.id));

          const uniquePosts = newPosts.filter(
            p => !existingIds.has(p.id)
          );

          return [...prev, ...uniquePosts];

        });

        setPage(prev => prev + 1);

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }, [page, loading, hasMore]);



  // ================= REFRESH FEED =================

  const refreshFeed = async () => {

    setLoading(true);

    try {

      const response = await postAPI.getFeed(0, 10);

      setPosts(response.data.content || []);

      setPage(1);

      setHasMore(true);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    loadPosts();

  }, []);



  // ================= REFRESH WHEN HEADER CLICK =================

  useEffect(() => {

    if (location.state?.refreshFeed) {

      refreshFeed();

      window.history.replaceState({}, document.title);

    }

  }, [location.state]);



  // ================= INFINITE SCROLL =================

  useEffect(() => {

    const handleScroll = () => {

      if (

        window.innerHeight +

        document.documentElement.scrollTop

        >=

        document.documentElement.offsetHeight - 100

      ) {

        if (!loading && hasMore) {

          loadPosts();

        }

      }

    };

    window.addEventListener("scroll", handleScroll);

    return () =>

      window.removeEventListener("scroll", handleScroll);

  }, [loading, hasMore, loadPosts]);



  return (

    <div className="feed-page">

      <Header />

      <div className="feed-container">

        <div className="feed-content">

          {posts.length === 0 && !loading && (

            <div className="empty-state">

              <div className="empty-icon">

                📭

              </div>

              <h2>No posts yet</h2>

              <p>

                Be the first to share your cloth products!

              </p>

            </div>

          )}

          {posts.map((post) => (

            <PostCard

              key={post.id}

              post={post}

            />

          ))}

          {loading && (

            <div className="loading-container">

              <div className="spinner"></div>

              <p>Loading posts...</p>

            </div>

          )}

          {!hasMore && posts.length > 0 && (

            <div className="end-message">

              <p>

                You've seen all posts! 🎉

              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

};

export default Feed;