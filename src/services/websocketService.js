import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
const API_BASE_URL = process.env.REACT_APP_API_BE;


if (typeof window !== 'undefined') {
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

    connect(userId, onConnect, onError) {
        if (this.isConnected) return;

        this.userId = userId;
        this.onConnectCallback = onConnect;
        this.onErrorCallback = onError;

        try {
            const token = localStorage.getItem('token');
            const wsUrl = token 
                ? `${API_BASE_URL}/ws?token=${encodeURIComponent(token)}`
                : `${API_BASE_URL}/ws`;
            
            this.stompClient = new Client({
                webSocketFactory: () => new SockJS(wsUrl),
                reconnectDelay: 0,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
                onConnect: (frame) => {
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    this.shouldReconnect = true;
                    
                    this.subscribeToNotifications(userId);
                    this.subscribeToMessages(userId);
                    this.subscribeToChatList(userId);
                    
                    if (this.onConnectCallback) this.onConnectCallback(frame);
                },
                onStompError: (frame) => {
                    this.isConnected = false;
                    const errorMessage = frame.headers?.message || frame.headers?.error || '';
                    if (errorMessage.includes('403') || errorMessage.includes('Forbidden') || 
                        errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
                        this.shouldReconnect = false;
                    }
                    if (this.onErrorCallback) this.onErrorCallback(frame);
                },
                onWebSocketClose: (event) => {
                    this.isConnected = false;
                    if (event.code === 1008 || event.code === 1002) {
                        this.shouldReconnect = false;
                    } else if (this.shouldReconnect) {
                        this.handleReconnect();
                    }
                },
                onDisconnect: () => {
                    this.isConnected = false;
                },
            });

            this.stompClient.activate();
        } catch (error) {
            if (this.onErrorCallback) this.onErrorCallback(error);
        }
    }

    handleReconnect() {
        if (!this.shouldReconnect) return;

        if (this.reconnectAttempts < this.maxReconnectAttempts && this.userId) {
            this.reconnectAttempts++;
            setTimeout(() => {
                if (this.shouldReconnect) {
                    this.connect(this.userId, this.onConnectCallback, this.onErrorCallback);
                }
            }, 5000);
        } else {
            this.shouldReconnect = false;
        }
    }

    subscribeToNotifications(userId) {
        if (!this.isConnected || !this.stompClient) return;

        try {
            const destination = `/user/${userId}/queue/notifications`;
            const subscription = this.stompClient.subscribe(destination, (message) => {
                try {
                    const data = JSON.parse(message.body);
                    window.dispatchEvent(new CustomEvent('websocketNotification', { detail: data }));
                } catch (error) {
                    console.error('Parse notification error:', error);
                }
            });

            this.subscriptions.set('notifications', subscription);
        } catch (error) {
            console.error('Subscribe notifications error:', error);
        }
    }

    subscribeToMessages(userId) {
        if (!this.isConnected || !this.stompClient) return;

        try {
            const destination = `/user/${userId}/queue/messages`;
            const subscription = this.stompClient.subscribe(destination, (payload) => {
                try {
                    const message = JSON.parse(payload.body);
                    window.dispatchEvent(new CustomEvent('websocketMessage', { detail: message }));
                } catch (error) {
                    console.error('Parse message error:', error);
                }
            });

            this.subscriptions.set('messages', subscription);
        } catch (error) {
            console.error('Subscribe messages error:', error);
        }
    }

    subscribeToChatList(userId) {
        if (!this.isConnected || !this.stompClient) return;

        try {
            const destination = `/user/${userId}/queue/chat-list`;
            const subscription = this.stompClient.subscribe(destination, (payload) => {
                try {
                    const chatItem = JSON.parse(payload.body);
                    window.dispatchEvent(new CustomEvent('websocketChatList', { detail: chatItem }));
                } catch (error) {
                    console.error('Parse chat list error:', error);
                }
            });

            this.subscriptions.set('chatList', subscription);
        } catch (error) {
            console.error('Subscribe chat list error:', error);
        }
    }

    unsubscribeAll() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions.clear();
    }

    disconnect() {
        if (this.stompClient) {
            this.unsubscribeAll();
            this.stompClient.deactivate();
            this.stompClient = null;
        }
        this.isConnected = false;
    }

    getConnectionStatus() {
        return this.isConnected;
    }
}

const websocketService = new WebSocketService();
export default websocketService;