
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080/api';

export const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================= AUTH APIs =================

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  forgotPassword: (mobile) =>
    api.post('/auth/forgot-password', { mobile }),
  resetPassword: (data) =>
    api.post('/auth/reset-password', data),
};

// ================= USER APIs =================

export const userAPI = {
  getUser: (userId) => api.get(`/users/${userId}`),

  getUserByMobile: (mobile) =>
    api.get(`/users/mobile/${mobile}`),

  searchUsers: (name) =>
    api.get('/users/search', { params: { name } }),

  updateProfileImage: (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(
      `/users/${userId}/profile-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};

// ================= POST APIs =================

export const postAPI = {

  createPost: (userId, postData, file) => {

    const formData = new FormData();

    formData.append('userId', userId);

    formData.append(
      'postData',
      JSON.stringify(postData)
    );

    if (file) {
      formData.append('file', file);
    }

    return api.post(
      '/posts/create',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );
  },

  getFeed: (
    page = 0,
    size = 10
  ) =>
    api.get(
      `/posts/feed?page=${page}&size=${size}`
    ),

  getUserPosts: (userId) =>
    api.get(`/posts/user/${userId}`),

  getPost: (postId) =>
    api.get(`/posts/${postId}`),

  // ================= DELETE POST =================

  deletePost: (postId, userId) =>
    api.delete(`/posts/${postId}`, {
      params: {
        userId,
      },
    }),
};

// ================= MESSAGE APIs =================

export const messageAPI = {

  sendTextMessage: (
    senderId,
    receiverId,
    message
  ) =>
    api.post(
      '/messages/send/text',
      null,
      {
        params: {
          senderId,
          receiverId,
          message,
        },
      }
    ),

  sendVoiceMessage: (
    senderId,
    receiverId,
    voiceFile
  ) => {

    const formData = new FormData();

    formData.append(
      'senderId',
      senderId
    );

    formData.append(
      'receiverId',
      receiverId
    );

    formData.append(
      'file',
      voiceFile
    );

    return api.post(
      '/messages/send/voice',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    );
  },

  getChatMessages: (
    userId1,
    userId2
  ) =>
    api.get('/messages/chat', {
      params: {
        userId1,
        userId2,
      },
    }),

  getChatUsers: (userId) =>
    api.get(
      `/messages/chat-users/${userId}`
    ),
    getInbox: (userId) =>
        api.get(`/messages/inbox/${userId}`),

      getUnreadCount: (userId) =>
        api.get(`/messages/unread-count/${userId}`),

      markAsRead: (fromUserId, toUserId) =>
        api.post('/messages/mark-read', null, {
          params: { fromUserId, toUserId },
        }),
};

export default api;

