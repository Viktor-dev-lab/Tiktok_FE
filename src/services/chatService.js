import { httpRequest } from '~/utils';

const path = 'chats';

/**
 * Lấy danh sách cuộc hội thoại
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} limit - Số lượng item mỗi trang (default: 20)
 * @returns {Promise} - Response data
 *
 * Response format:
 * {
 *   data: [
 *     {
 *       id: number,
 *       user: { id, username, fullName, avatar, isVerified },
 *       lastMessage: { id, content, senderId, createdAt, isRead },
 *       unreadCount: number,
 *       updatedAt: string
 *     }
 *   ],
 *   pagination: { page, limit, totalPages, totalItems }
 * }
 */
export const getChatList = async (page = 1, limit = 20) => {
    const dataResponse = await httpRequest.get(path, {
        params: {
            page,
            limit,
        },
    });
    return dataResponse.data;
};

/**
 * Lấy danh sách tin nhắn của một cuộc hội thoại
 * @param {number} chatId - ID của cuộc hội thoại
 * @param {number} page - Trang hiện tại (default: 1)
 * @param {number} limit - Số lượng tin nhắn mỗi trang (default: 50)
 * @returns {Promise} - Response data
 *
 * Response format:
 * {
 *   data: [
 *     {
 *       id: number,
 *       senderId: number,
 *       receiverId: number,
 *       content: string,
 *       createdAt: string,
 *       isRead: boolean
 *     }
 *   ],
 *   pagination: { page, limit, totalPages, totalItems }
 * }
 */
export const getChatMessages = async (chatId, page = 1, limit = 50) => {
    const dataResponse = await httpRequest.get(`${path}/${chatId}/messages`, {
        params: {
            page,
            limit,
        },
    });
    return dataResponse.data;
};

/**
 * Gửi tin nhắn mới
 * @param {number} chatId - ID của cuộc hội thoại
 * @param {string} content - Nội dung tin nhắn
 * @param {number} receiverId - ID người nhận
 * @returns {Promise} - Response data
 *
 * Response format:
 * {
 *   data: {
 *     id: number,
 *     senderId: number,
 *     receiverId: number,
 *     content: string,
 *     createdAt: string,
 *     isRead: boolean
 *   }
 * }
 */
export const sendMessage = async (chatId, content, receiverId) => {
    const dataResponse = await httpRequest.post(`${path}/${chatId}/messages`, {
        content,
        receiverId,
    });
    return dataResponse.data;
};

/**
 * Đánh dấu tin nhắn đã đọc
 * @param {number} chatId - ID của cuộc hội thoại
 * @returns {Promise} - Response data
 *
 * Response format:
 * {
 *   success: boolean,
 *   message: string
 * }
 */
export const markAsRead = async (chatId) => {
    const dataResponse = await httpRequest.put(`${path}/${chatId}/read`);
    return dataResponse.data;
};

/**
 * Lấy tổng số tin nhắn chưa đọc
 * @returns {Promise} - Response data
 *
 * Response format:
 * {
 *   data: {
 *     unreadCount: number
 *   }
 * }
 */
export const getUnreadCount = async () => {
    const dataResponse = await httpRequest.get(`${path}/unread-count`);
    return dataResponse.data;
};
