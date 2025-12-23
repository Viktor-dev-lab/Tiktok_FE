// Mockup data for Chat feature
// This data structure is for Frontend development
// Backend team can use this as reference for API response format

export const currentUser = {
    id: 1,
    username: 'sunminh',
    fullName: 'Sun Minh',
    avatar: 'https://i.pravatar.cc/150?img=1',
};

// Danh sách cuộc hội thoại (Chat List)
export const chatListData = [
    {
        id: 1,
        user: {
            id: 2,
            username: 'nguyenvana',
            fullName: 'Nguyễn Văn A',
            avatar: 'https://i.pravatar.cc/150?img=2',
            isVerified: true,
        },
        lastMessage: {
            id: 101,
            content: 'Video mới của bạn hay quá! 🔥',
            senderId: 2,
            createdAt: '2025-12-22T10:30:00Z',
            isRead: false,
        },
        unreadCount: 3,
        updatedAt: '2025-12-22T10:30:00Z',
    },
    {
        id: 2,
        user: {
            id: 3,
            username: 'tranthib',
            fullName: 'Trần Thị B',
            avatar: 'https://i.pravatar.cc/150?img=3',
            isVerified: false,
        },
        lastMessage: {
            id: 102,
            content: 'Cảm ơn bạn nhé!',
            senderId: 1,
            createdAt: '2025-12-22T09:15:00Z',
            isRead: true,
        },
        unreadCount: 0,
        updatedAt: '2025-12-22T09:15:00Z',
    },
    {
        id: 3,
        user: {
            id: 4,
            username: 'levanc',
            fullName: 'Lê Văn C',
            avatar: 'https://i.pravatar.cc/150?img=4',
            isVerified: true,
        },
        lastMessage: {
            id: 103,
            content: 'Bạn ơi, cho mình xin link bài hát được không?',
            senderId: 4,
            createdAt: '2025-12-21T20:45:00Z',
            isRead: false,
        },
        unreadCount: 1,
        updatedAt: '2025-12-21T20:45:00Z',
    },
    {
        id: 4,
        user: {
            id: 5,
            username: 'phamthid',
            fullName: 'Phạm Thị D',
            avatar: 'https://i.pravatar.cc/150?img=5',
            isVerified: false,
        },
        lastMessage: {
            id: 104,
            content: 'Hẹn gặp lại bạn nhé!',
            senderId: 5,
            createdAt: '2025-12-21T18:20:00Z',
            isRead: true,
        },
        unreadCount: 0,
        updatedAt: '2025-12-21T18:20:00Z',
    },
    {
        id: 5,
        user: {
            id: 6,
            username: 'hoangvane',
            fullName: 'Hoàng Văn E',
            avatar: 'https://i.pravatar.cc/150?img=6',
            isVerified: true,
        },
        lastMessage: {
            id: 105,
            content: 'Mình đã follow bạn rồi đó!',
            senderId: 6,
            createdAt: '2025-12-21T15:10:00Z',
            isRead: true,
        },
        unreadCount: 0,
        updatedAt: '2025-12-21T15:10:00Z',
    },
    {
        id: 6,
        user: {
            id: 7,
            username: 'vuthif',
            fullName: 'Vũ Thị F',
            avatar: 'https://i.pravatar.cc/150?img=7',
            isVerified: false,
        },
        lastMessage: {
            id: 106,
            content: 'Xin chào! Bạn có thể hợp tác không?',
            senderId: 7,
            createdAt: '2025-12-21T12:30:00Z',
            isRead: false,
        },
        unreadCount: 2,
        updatedAt: '2025-12-21T12:30:00Z',
    },
    {
        id: 7,
        user: {
            id: 8,
            username: 'dangvang',
            fullName: 'Đặng Văn G',
            avatar: 'https://i.pravatar.cc/150?img=8',
            isVerified: true,
        },
        lastMessage: {
            id: 107,
            content: '👍👍👍',
            senderId: 8,
            createdAt: '2025-12-21T10:00:00Z',
            isRead: true,
        },
        unreadCount: 0,
        updatedAt: '2025-12-21T10:00:00Z',
    },
    {
        id: 8,
        user: {
            id: 9,
            username: 'buithih',
            fullName: 'Bùi Thị H',
            avatar: 'https://i.pravatar.cc/150?img=9',
            isVerified: false,
        },
        lastMessage: {
            id: 108,
            content: 'Video của bạn đã viral rồi đấy!',
            senderId: 9,
            createdAt: '2025-12-20T22:15:00Z',
            isRead: true,
        },
        unreadCount: 0,
        updatedAt: '2025-12-20T22:15:00Z',
    },
];

// Chi tiết tin nhắn của một cuộc hội thoại (Chat Detail)
export const chatDetailData = {
    1: [
        {
            id: 1,
            senderId: 2,
            receiverId: 1,
            content: 'Chào bạn!',
            createdAt: '2025-12-22T08:00:00Z',
            isRead: true,
        },
        {
            id: 2,
            senderId: 1,
            receiverId: 2,
            content: 'Chào! Bạn khỏe không?',
            createdAt: '2025-12-22T08:02:00Z',
            isRead: true,
        },
        {
            id: 3,
            senderId: 2,
            receiverId: 1,
            content: 'Mình khỏe! Video mới của bạn hay lắm đó!',
            createdAt: '2025-12-22T08:05:00Z',
            isRead: true,
        },
        {
            id: 4,
            senderId: 1,
            receiverId: 2,
            content: 'Cảm ơn bạn nhé! 😊',
            createdAt: '2025-12-22T08:10:00Z',
            isRead: true,
        },
        {
            id: 5,
            senderId: 2,
            receiverId: 1,
            content: 'Bạn quay ở đâu vậy? Góc quay đẹp quá!',
            createdAt: '2025-12-22T08:15:00Z',
            isRead: true,
        },
        {
            id: 6,
            senderId: 1,
            receiverId: 2,
            content: 'Mình quay ở công viên gần nhà đó!',
            createdAt: '2025-12-22T08:20:00Z',
            isRead: true,
        },
        {
            id: 7,
            senderId: 2,
            receiverId: 1,
            content: 'Ồ, vậy hả! Mình cũng muốn thử quay ở đó!',
            createdAt: '2025-12-22T08:25:00Z',
            isRead: true,
        },
        {
            id: 8,
            senderId: 1,
            receiverId: 2,
            content: 'Bạn nên thử đi! Ánh sáng buổi sáng rất đẹp đấy',
            createdAt: '2025-12-22T08:30:00Z',
            isRead: true,
        },
        {
            id: 9,
            senderId: 2,
            receiverId: 1,
            content: 'Được rồi! Mình sẽ thử vào cuối tuần này',
            createdAt: '2025-12-22T10:00:00Z',
            isRead: false,
        },
        {
            id: 10,
            senderId: 2,
            receiverId: 1,
            content: 'À mà, bạn dùng nhạc nền gì vậy?',
            createdAt: '2025-12-22T10:15:00Z',
            isRead: false,
        },
        {
            id: 11,
            senderId: 2,
            receiverId: 1,
            content: 'Video mới của bạn hay quá! 🔥',
            createdAt: '2025-12-22T10:30:00Z',
            isRead: false,
        },
    ],
    2: [
        {
            id: 12,
            senderId: 3,
            receiverId: 1,
            content: 'Xin chào! Mình rất thích video của bạn',
            createdAt: '2025-12-22T08:00:00Z',
            isRead: true,
        },
        {
            id: 13,
            senderId: 1,
            receiverId: 3,
            content: 'Cảm ơn bạn rất nhiều!',
            createdAt: '2025-12-22T08:30:00Z',
            isRead: true,
        },
        {
            id: 14,
            senderId: 3,
            receiverId: 1,
            content: 'Bạn có thể chia sẻ tips quay video không?',
            createdAt: '2025-12-22T09:00:00Z',
            isRead: true,
        },
        {
            id: 15,
            senderId: 1,
            receiverId: 3,
            content: 'Được chứ! Mình sẽ làm video hướng dẫn nhé',
            createdAt: '2025-12-22T09:10:00Z',
            isRead: true,
        },
        {
            id: 16,
            senderId: 3,
            receiverId: 1,
            content: 'Cảm ơn bạn nhé!',
            createdAt: '2025-12-22T09:15:00Z',
            isRead: true,
        },
    ],
    3: [
        {
            id: 17,
            senderId: 4,
            receiverId: 1,
            content: 'Chào bạn! Bài hát trong video bạn hay quá!',
            createdAt: '2025-12-21T20:00:00Z',
            isRead: true,
        },
        {
            id: 18,
            senderId: 1,
            receiverId: 4,
            content: 'Cảm ơn! Bạn thích nhạc loại gì?',
            createdAt: '2025-12-21T20:30:00Z',
            isRead: true,
        },
        {
            id: 19,
            senderId: 4,
            receiverId: 1,
            content: 'Mình thích nhạc pop và EDM',
            createdAt: '2025-12-21T20:40:00Z',
            isRead: true,
        },
        {
            id: 20,
            senderId: 4,
            receiverId: 1,
            content: 'Bạn ơi, cho mình xin link bài hát được không?',
            createdAt: '2025-12-21T20:45:00Z',
            isRead: false,
        },
    ],
};

// API Response Format cho Backend team

/**
 * GET /api/chats - Lấy danh sách cuộc hội thoại
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20)
 *
 * Response:
 * {
 *   data: [
 *     {
 *       id: number,
 *       user: {
 *         id: number,
 *         username: string,
 *         fullName: string,
 *         avatar: string,
 *         isVerified: boolean
 *       },
 *       lastMessage: {
 *         id: number,
 *         content: string,
 *         senderId: number,
 *         createdAt: string (ISO 8601),
 *         isRead: boolean
 *       },
 *       unreadCount: number,
 *       updatedAt: string (ISO 8601)
 *     }
 *   ],
 *   pagination: {
 *     page: number,
 *     limit: number,
 *     totalPages: number,
 *     totalItems: number
 *   }
 * }
 */

/**
 * GET /api/chats/:chatId/messages - Lấy tin nhắn của một cuộc hội thoại
 *
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 50)
 *
 * Response:
 * {
 *   data: [
 *     {
 *       id: number,
 *       senderId: number,
 *       receiverId: number,
 *       content: string,
 *       createdAt: string (ISO 8601),
 *       isRead: boolean
 *     }
 *   ],
 *   pagination: {
 *     page: number,
 *     limit: number,
 *     totalPages: number,
 *     totalItems: number
 *   }
 * }
 */

/**
 * POST /api/chats/:chatId/messages - Gửi tin nhắn mới
 *
 * Request Body:
 * {
 *   content: string,
 *   receiverId: number
 * }
 *
 * Response:
 * {
 *   data: {
 *     id: number,
 *     senderId: number,
 *     receiverId: number,
 *     content: string,
 *     createdAt: string (ISO 8601),
 *     isRead: boolean
 *   }
 * }
 */

/**
 * PUT /api/chats/:chatId/read - Đánh dấu tin nhắn đã đọc
 *
 * Response:
 * {
 *   success: boolean,
 *   message: string
 * }
 */

/**
 * GET /api/chats/unread-count - Lấy tổng số tin nhắn chưa đọc
 *
 * Response:
 * {
 *   data: {
 *     unreadCount: number
 *   }
 * }
 */
