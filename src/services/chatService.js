import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
    baseURL: `${API_BASE_URL}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * CHAT LIST
 * GET /api/chats?userId=1
 */
export const getChatList = (userId) => {
    return api.get('/chats', {
        params: { userId },
    });
};

/**
 * CHAT DETAIL
 * GET /api/chats/detail?userId=1&otherUserId=2
 */
export const getChatDetail = (userId, otherUserId) => {
    return api.get('/chats/detail', {
        params: { userId, otherUserId },
    });
};

/**
 * SEND MESSAGE
 * POST /api/chats/messages?senderId=1
 */
export const sendMessage = (senderId, receiverId, content) => {
    return api.post(
        '/chats/messages',
        { receiverId, content },
        {
            params: { senderId },
        },
    );
};

/**
 * MARK READ
 * PUT /api/chats/mark-read?userId=1&otherUserId=2
 */
export const markMessagesAsRead = (userId, otherUserId) => {
    return api.put('/chats/mark-read', null, {
        params: { userId, otherUserId },
    });
};

