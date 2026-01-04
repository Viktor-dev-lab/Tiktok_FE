import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';

import styles from './Messages.module.scss';
import ChatItem from '~/components/Items/ChatItem';
import MessageBubble from '~/components/MessageBubble';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';
import SvgIcon from '~/components/SvgIcon';
import {
    iconSearch,
    iconLoading,
    iconSend,
    iconEmojiSmile,
} from '~/components/SvgIcon/iconsRepo';

import {
    getChatList,
    getChatDetail,
    sendMessage,
    markMessagesAsRead,
} from '~/services/chatService';

import { useAuth } from '~/Context/AuthContext';
import websocketService from '~/services/websocketService';

const cx = classNames.bind(styles);

function Messages() {
    const { currentUser, loading: authLoading } = useAuth();

    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    /* ================= WEBSOCKET SETUP ================= */
    useEffect(() => {
        if (!currentUser?.id) return;

        websocketService.connect(
            currentUser.id,
            () => console.log('WebSocket connected'),
            (error) => console.error('WebSocket error:', error)
        );

        const handleNewMessage = (event) => {
            const message = event.detail;
            
            setMessages(prev => {
                const selectedChat = chatList.find(c => c.id === selectedChatId);
                if (!selectedChat) return prev;
                
                if (message.senderId === selectedChat.user.id || 
                    message.receiverId === selectedChat.user.id) {
                    return [...prev, message];
                }
                return prev;
            });

            if (message.senderId !== currentUser.id) {
                const selectedChat = chatList.find(c => c.id === selectedChatId);
                if (selectedChat && message.senderId === selectedChat.user.id) {
                    markMessagesAsRead(currentUser.id, selectedChat.user.id);
                }
            }
        };

        const handleChatListUpdate = (event) => {
            const chatItem = event.detail;
            
            setChatList(prev => {
                const index = prev.findIndex(item => item.user.id === chatItem.user.id);
                if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = chatItem;
                    updated.sort((a, b) => 
                        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
                    );
                    return updated;
                }
                return [chatItem, ...prev];
            });
        };

        window.addEventListener('websocketMessage', handleNewMessage);
        window.addEventListener('websocketChatList', handleChatListUpdate);

        return () => {
            window.removeEventListener('websocketMessage', handleNewMessage);
            window.removeEventListener('websocketChatList', handleChatListUpdate);
            websocketService.disconnect();
        };
    }, [currentUser?.id, selectedChatId, chatList]);

    /* ================= FETCH CHAT LIST ================= */
    useEffect(() => {
        if (!currentUser?.id) return;

        const fetchChatList = async () => {
            try {
                setLoading(true);
                const res = await getChatList(currentUser.id);

                setChatList(
                    Array.isArray(res?.data?.data)
                        ? res.data.data
                        : []
                );
            } catch (error) {
                console.error('Fetch chat list error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChatList();
    }, [currentUser?.id]);

    /* ================= FETCH CHAT DETAIL ================= */
    useEffect(() => {
        if (!selectedChatId || !currentUser?.id) return;

        const selectedChat = chatList.find(
            c => c.id === selectedChatId
        );
        if (!selectedChat) return;

        const fetchChatDetail = async () => {
            try {
                const res = await getChatDetail(
                    currentUser.id,
                    selectedChat.user.id
                );

                const data = res?.data?.data;
                setMessages(
                    Array.isArray(data?.messages)
                        ? data.messages
                        : []
                );

                await markMessagesAsRead(
                    currentUser.id,
                    selectedChat.user.id
                );
            } catch (error) {
                console.error('Fetch chat detail error:', error);
            }
        };

        fetchChatDetail();
    }, [selectedChatId, chatList, currentUser?.id]);

    /* ================= AUTO SCROLL ================= */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /* ================= HANDLERS ================= */
    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || !selectedChatId || !currentUser?.id) return;

        const selectedChat = chatList.find(
            c => c.id === selectedChatId
        );
        if (!selectedChat) return;

        const tempMessage = {
            id: Date.now(),
            content: inputValue,
            senderId: currentUser.id,
            receiverId: selectedChat.user.id,
            createdAt: new Date().toISOString(),
            status: 'SENDING'
        };

        setMessages(prev => [...prev, tempMessage]);
        setInputValue('');
        inputRef.current?.focus();

        try {
            await sendMessage(
                currentUser.id,
                selectedChat.user.id,
                inputValue
            );

            setMessages(prev => 
                prev.filter(msg => msg.id !== tempMessage.id)
            );
        } catch (error) {
            console.error('Send message error:', error);
            setMessages(prev => 
                prev.map(msg => 
                    msg.id === tempMessage.id 
                        ? { ...msg, status: 'FAILED' }
                        : msg
                )
            );
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    /* ================= FILTER ================= */
    const filteredChatList = chatList.filter(chat =>
        chat.user.fullName
            .toLowerCase()
            .includes(searchValue.toLowerCase())
    );

    const selectedChat = chatList.find(
        c => c.id === selectedChatId
    );

    /* ================= AUTH LOADING ================= */
    if (authLoading) {
        return (
            <div className={cx('loading')}>
                <SvgIcon icon={iconLoading} size={40} />
            </div>
        );
    }

    if (!currentUser) {
        return null;
    }

    /* ================= UI ================= */
    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <div className={cx('header')}>
                    <h2 className={cx('title')}>Tin nhắn</h2>
                    <div className={cx('search-wrapper')}>
                        <SvgIcon icon={iconSearch} size={20} />
                        <input
                            className={cx('search-input')}
                            type="text"
                            placeholder="Tìm kiếm"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                </div>

                <div className={cx('chat-list')}>
                    {loading ? (
                        <div className={cx('loading')}>
                            <SvgIcon
                                icon={iconLoading}
                                size={40}
                                className={cx('loading-icon')}
                            />
                            <p>Đang tải tin nhắn...</p>
                        </div>
                    ) : filteredChatList.length > 0 ? (
                        filteredChatList.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat.id)}
                                className={cx('chat-item-wrapper', {
                                    active: chat.id === selectedChatId,
                                })}
                            >
                                <ChatItem chatInfo={chat} />
                            </div>
                        ))
                    ) : (
                        <div className={cx('empty')}>
                            <p>Không tìm thấy cuộc hội thoại nào</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={cx('chat-panel')}>
                {selectedChat ? (
                    <>
                        <div className={cx('chat-header')}>
                            <div className={cx('user-info')}>
                                <Img
                                    className={cx('avatar')}
                                    src={selectedChat.user.avatar}
                                    alt={selectedChat.user.fullName}
                                />
                                <div className={cx('user-details')}>
                                    <h3 className={cx('username')}>
                                        {selectedChat.user.fullName}
                                        {selectedChat.user.isVerified && (
                                            <ShowTick tick />
                                        )}
                                    </h3>
                                    <p className={cx('status')}>
                                        Đang hoạt động
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={cx('messages-container')}>
                            <div className={cx('messages-list')}>
                                {messages.map(message => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                        isSender={
                                            message.senderId === currentUser.id
                                        }
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        <div className={cx('input-container')}>
                            <button className={cx('emoji-btn')}>
                                <SvgIcon
                                    icon={iconEmojiSmile}
                                    size={24}
                                />
                            </button>
                            <input
                                ref={inputRef}
                                className={cx('message-input')}
                                type="text"
                                placeholder="Gửi tin nhắn..."
                                value={inputValue}
                                onChange={(e) =>
                                    setInputValue(e.target.value)
                                }
                                onKeyPress={handleKeyPress}
                            />
                            {inputValue.trim() && (
                                <button
                                    className={cx('send-btn', {
                                        active: true,
                                    })}
                                    onClick={handleSendMessage}
                                >
                                    <SvgIcon icon={iconSend} size={20} />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={cx('empty-chat')}>
                        <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messages;