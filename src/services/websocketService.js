import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Disable STOMP debug logs
if (typeof window !== 'undefined') {
    // @ts-ignore
    Client.debug = () => {};
}

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.isConnected = false;
        this.subscriptions = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.onConnectCallback = null;
        this.onErrorCallback = null;
        this.userId = null;
        this.shouldReconnect = true;
    }

    // Kết nối WebSocket
    connect(userId, onConnect, onError) {
        if (this.isConnected) {
            console.log('WebSocket already connected');
            return;
        }

        this.userId = userId;
        this.onConnectCallback = onConnect;
        this.onErrorCallback = onError;

        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                console.warn('⚠️ No authentication token found, WebSocket connection may fail');
            } else {
                console.log('🔑 Token found, attempting WebSocket connection...');
            }

            const wsUrl = token 
                ? `http://localhost:8080/ws?token=${encodeURIComponent(token)}`
                : 'http://localhost:8080/ws';
            
            console.log('🔌 Connecting to WebSocket:', wsUrl.replace(/token=[^&]+/, 'token=***'));
            
            // Tạo STOMP client với SockJS
            this.stompClient = new Client({
                webSocketFactory: () => {
                    return new SockJS(wsUrl);
                },
                reconnectDelay: 0,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                connectHeaders: token ? {
                    Authorization: `Bearer ${token}`
                } : {},
                onConnect: (frame) => {
                    console.log('✅ WebSocket Connected successfully!');
                    console.log('📡 Connection frame:', frame);
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    this.shouldReconnect = true;
                    
                    // Subscribe vào notification channel của user
                    this.subscribeToNotifications(userId);
                    
                    if (this.onConnectCallback) {
                        this.onConnectCallback(frame);
                    }
                },
                onStompError: (frame) => {
                    console.error('❌ STOMP error:', frame);
                    console.error('Error headers:', frame.headers);
                    this.isConnected = false;
                    const errorMessage = frame.headers?.message || frame.headers?.error || '';
                    if (errorMessage.includes('403') || errorMessage.includes('Forbidden') || 
                        errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
                        console.error('🚫 WebSocket authentication failed. Please check your token.');
                        this.shouldReconnect = false;
                    }
                    
                    if (this.onErrorCallback) {
                        this.onErrorCallback(frame);
                    }
                },
                onWebSocketClose: (event) => {
                    console.log('🔌 WebSocket closed with code:', event.code);
                    console.log('Reason:', event.reason || 'No reason provided');
                    this.isConnected = false;
                    
                    // Không reconnect nếu là lỗi authentication hoặc policy violation
                    if (event.code === 1008 || event.code === 1002) {
                        console.warn('⚠️ WebSocket closed due to policy violation or authentication issue');
                        console.warn('💡 Please check backend WebSocketAuthInterceptor configuration');
                        this.shouldReconnect = false;
                    } else if (this.shouldReconnect) {
                        this.handleReconnect();
                    }
                },
                onDisconnect: () => {
                    console.log('🔌 STOMP disconnected');
                    this.isConnected = false;
                },
            });

            // Activate STOMP client
            console.log('🚀 Activating STOMP client...');
            this.stompClient.activate();
        } catch (error) {
            console.error('❌ WebSocket connection error:', error);
            if (this.onErrorCallback) {
                this.onErrorCallback(error);
            }
        }
    }

    // Xử lý reconnect
    handleReconnect() {
        if (!this.shouldReconnect) {
            console.log('Reconnection disabled');
            return;
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                if (this.shouldReconnect) {
                    this.connect(this.userId, this.onConnectCallback, this.onErrorCallback);
                }
            }, 5000);
        } else {
            console.error('Max reconnection attempts reached');
            this.shouldReconnect = false;
        }
    }

    // Subscribe vào notification channel của user (theo code backend)
    subscribeToNotifications(userId) {
        if (!this.isConnected || !this.stompClient) {
            console.warn('WebSocket not connected, cannot subscribe to notifications');
            return;
        }

        try {
            // Subscribe vào user-specific notification channel theo format của Spring WebSocket
            // Backend gửi đến: /user/{userId}/queue/notifications
            const destination = `/user/${userId}/queue/notifications`;
            const subscription = this.stompClient.subscribe(destination, (message) => {
                try {
                    const data = JSON.parse(message.body);
                    console.log('Notification received:', data);
                    
                    // Trigger custom event để các component có thể lắng nghe
                    window.dispatchEvent(new CustomEvent('websocketNotification', { detail: data }));
                } catch (error) {
                    console.error('Error parsing notification message:', error);
                }
            });

            this.subscriptions.set('notifications', subscription);
            console.log(`Subscribed to notifications: ${destination}`);
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
        }
    }

    // Unsubscribe khỏi tất cả channels
    unsubscribeAll() {
        this.subscriptions.forEach((subscription, key) => {
            subscription.unsubscribe();
            console.log(`Unsubscribed from ${key}`);
        });
        this.subscriptions.clear();
    }

    // Ngắt kết nối WebSocket
    disconnect() {
        if (this.stompClient) {
            this.unsubscribeAll();
            this.stompClient.deactivate();
            this.stompClient = null;
        }

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

        this.isConnected = false;
        console.log('WebSocket disconnected');
    }

    // Kiểm tra trạng thái kết nối
    getConnectionStatus() {
        return this.isConnected;
    }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;

