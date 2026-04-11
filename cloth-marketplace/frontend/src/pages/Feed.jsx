import React, { useState, useEffect, useCallback } from 'react';
import { postAPI } from '../services/api';
import PostCard from '../components/PostCard';
import Header from '../components/Header';
import './Feed.css';

const Feed = () => {
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
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        loadPosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadPosts]);

  return (
    <div className="feed-page">
      <Header />
      
      <div className="feed-container">
        <div className="feed-content">
          {posts.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h2>No posts yet</h2>
              <p>Be the first to share your cloth products!</p>
            </div>
          )}

          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading posts...</p>
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="end-message">
              <p>You've seen all posts! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
