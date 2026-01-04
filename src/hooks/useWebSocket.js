import { useEffect, useState, useCallback } from 'react';
import websocketService from '~/services/websocketService';
import { useAuth } from '~/Context/AuthContext';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/**
 * Custom hook để quản lý WebSocket connection và notifications
 * Note: Like/Unlike video sử dụng REST API, WebSocket chỉ dùng để nhận notifications
 */
function useWebSocket() {
    const { currentUser } = useAuth();
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState(null);

    // Kết nối WebSocket khi component mount
    useEffect(() => {
        if (!currentUser?.id) {
            return;
        }

        const handleConnect = () => {
            setIsConnected(true);
            console.log('WebSocket connected successfully');
        };

        const handleError = (error) => {
            setIsConnected(false);
            console.error('WebSocket connection error:', error);
        };

        // Kết nối WebSocket
        websocketService.connect(currentUser.id, handleConnect, handleError);

        // Lắng nghe custom event cho notifications
        const handleNotification = (event) => {
            const data = event.detail;
            setNotifications(data);
            console.log('New notification received:', data);
        };

        window.addEventListener('websocketNotification', handleNotification);

        // Cleanup khi component unmount
        return () => {
            window.removeEventListener('websocketNotification', handleNotification);
            websocketService.disconnect();
            setIsConnected(false);
        };
    }, [currentUser?.id]);

    // Hàm like video - luôn dùng REST API (backend không có WebSocket endpoint)
    const likeVideo = useCallback((videoId, likerId) => {
        return fetch(`${API_BASE_URL}/videos/${videoId}/like?liker_id=${likerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Video liked via REST API:', data);
                return data;
            })
            .catch((error) => {
                console.error('Error liking video:', error);
                throw error;
            });
    }, []);

    // Hàm unlike video - luôn dùng REST API (backend không có WebSocket endpoint)
    const unlikeVideo = useCallback((videoId, likerId) => {
        return fetch(`${API_BASE_URL}/videos/${videoId}/like?liker_id=${likerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Video unliked via REST API:', data);
                return data;
            })
            .catch((error) => {
                console.error('Error unliking video:', error);
                throw error;
            });
    }, []);

    return {
        isConnected,
        likeVideo,
        unlikeVideo,
        notifications,
    };
}

export default useWebSocket;

