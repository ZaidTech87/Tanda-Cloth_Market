import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messageAPI, userAPI } from '../services/api';
import { FaArrowLeft, FaPaperPlane, FaMicrophone, FaStop } from 'react-icons/fa';
import './Chat.css';

const Chat = () => {
  const { receiverId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverUser, setReceiverUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const baseURL = 'http://localhost:8080';

  useEffect(() => {
    loadChat();
    const interval = setInterval(loadMessages, 3000); // Poll for new messages
    return () => clearInterval(interval);
  }, [receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChat = async () => {
    try {
      // Load receiver user details
      const userResponse = await userAPI.getUser(receiverId);
      setReceiverUser(userResponse.data);

      // Load messages
      await loadMessages();
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const response = await messageAPI.getChatMessages(user.userId, receiverId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await messageAPI.sendTextMessage(user.userId, receiverId, newMessage);
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'voice.webm', { type: 'audio/webm' });
        
        try {
          await messageAPI.sendVoiceMessage(user.userId, receiverId, audioFile);
          await loadMessages();
        } catch (error) {
          console.error('Error sending voice message:', error);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return (
      <div className="chat-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      {/* Chat Header */}
      <div className="chat-header">
        <button className="back-btn" onClick={() => navigate('/messages')}>
          <FaArrowLeft />
        </button>
        
        <div className="chat-header-user" onClick={() => navigate(`/profile/${receiverId}`)}>
          <div className="chat-header-avatar">
            {receiverUser?.profileImage ? (
              <img src={baseURL + receiverUser.profileImage} alt={receiverUser.name} />
            ) : (
              <div className="avatar-placeholder">
                {receiverUser?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="chat-header-info">
            <h2>{receiverUser?.name}</h2>
            <p>{receiverUser?.location}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.senderId === user.userId ? 'sent' : 'received'}`}
            >
              {msg.messageType === 'text' ? (
                <div className="message-bubble">
                  <p>{msg.message}</p>
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>
              ) : (
                <div className="message-bubble voice-message">
                  <audio controls src={baseURL + msg.voiceUrl} />
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        <form onSubmit={handleSendMessage} className="chat-input-form">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending || recording}
          />
          
          <div className="input-actions">
            {!recording ? (
              <>
                <button
                  type="button"
                  className="voice-btn"
                  onClick={startRecording}
                  disabled={sending}
                >
                  <FaMicrophone />
                </button>
                <button
                  type="submit"
                  className="send-btn"
                  disabled={!newMessage.trim() || sending}
                >
                  <FaPaperPlane />
                </button>
              </>
            ) : (
              <button
                type="button"
                className="stop-btn"
                onClick={stopRecording}
              >
                <FaStop /> Stop Recording
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
