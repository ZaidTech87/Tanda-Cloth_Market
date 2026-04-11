import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';
import Header from '../components/Header';
import './Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chatUsers, setChatUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = 'http://localhost:8080';

  useEffect(() => {
    loadChatUsers();
  }, []);

  const loadChatUsers = async () => {
    try {
      const response = await messageAPI.getChatUsers(user.userId);
      setChatUsers(response.data);
    } catch (error) {
      console.error('Error loading chat users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (chatUserId) => {
    navigate(`/chat/${chatUserId}`);
  };

  if (loading) {
    return (
      <div className="messages-page">
        <Header />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <Header />
      
      <div className="messages-container">
        <div className="messages-header">
          <h1>Messages</h1>
        </div>

        {chatUsers.length === 0 ? (
          <div className="empty-chats">
            <div className="empty-icon">💬</div>
            <h2>No conversations yet</h2>
            <p>Start chatting by clicking "Connect" on any post!</p>
          </div>
        ) : (
          <div className="chat-list">
            {chatUsers.map((chatUser) => (
              <div
                key={chatUser.id}
                className="chat-item"
                onClick={() => handleChatClick(chatUser.id)}
              >
                <div className="chat-avatar">
                  {chatUser.profileImage ? (
                    <img src={baseURL + chatUser.profileImage} alt={chatUser.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {chatUser.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="chat-info">
                  <h3 className="chat-name">{chatUser.name}</h3>
                  <p className="chat-location">{chatUser.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
