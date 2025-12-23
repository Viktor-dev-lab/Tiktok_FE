import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';

import styles from './Messages.module.scss';
import ChatItem from '~/components/Items/ChatItem';
import MessageBubble from '~/components/MessageBubble';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';
import { chatListData, chatDetailData, currentUser } from '~/mockData/chatData';
import SvgIcon from '~/components/SvgIcon';
import { iconSearch, iconLoading, iconSend, iconEmojiSmile } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function Messages() {
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Giả lập việc fetch data từ API
        const fetchChatList = async () => {
            setLoading(true);
            // Giả lập delay network
            await new Promise((resolve) => setTimeout(resolve, 500));
            setChatList(chatListData);
            setLoading(false);
        };

        fetchChatList();
    }, []);

    // Load messages khi chọn chat
    useEffect(() => {
        if (selectedChatId) {
            const messagesData = chatDetailData[selectedChatId] || [];
            setMessages(messagesData);
        }
    }, [selectedChatId]);

    // Auto scroll to bottom khi có tin nhắn mới
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
    };

    const handleSendMessage = () => {
        if (!inputValue.trim() || !selectedChatId) return;

        const selectedChat = chatList.find((c) => c.id === selectedChatId);
        const newMessage = {
            id: messages.length + 1,
            senderId: currentUser.id,
            receiverId: selectedChat.user.id,
            content: inputValue,
            createdAt: new Date().toISOString(),
            isRead: false,
        };

        setMessages([...messages, newMessage]);
        setInputValue('');
        inputRef.current?.focus();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Lọc danh sách chat theo search
    const filteredChatList = chatList.filter((chat) =>
        chat.user.fullName.toLowerCase().includes(searchValue.toLowerCase()),
    );

    const selectedChat = chatList.find((c) => c.id === selectedChatId);

    return (
        <div className={cx('wrapper')}>
            {/* Left sidebar - Chat List */}
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
                            <SvgIcon icon={iconLoading} size={40} className={cx('loading-icon')} />
                            <p>Đang tải tin nhắn...</p>
                        </div>
                    ) : filteredChatList.length > 0 ? (
                        filteredChatList.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat.id)}
                                className={cx('chat-item-wrapper', { active: chat.id === selectedChatId })}
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

            {/* Right panel - Chat Detail */}
            <div className={cx('chat-panel')}>
                {selectedChat ? (
                    <>
                        {/* Header */}
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
                                        {selectedChat.user.isVerified && <ShowTick tick={true} />}
                                    </h3>
                                    <p className={cx('status')}>Đang hoạt động</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className={cx('messages-container')}>
                            <div className={cx('messages-list')}>
                                {messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                        isSender={message.senderId === currentUser.id}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input */}
                        <div className={cx('input-container')}>
                            <button className={cx('emoji-btn')}>
                                <SvgIcon icon={iconEmojiSmile} size={24} />
                            </button>
                            <input
                                ref={inputRef}
                                className={cx('message-input')}
                                type="text"
                                placeholder="Gửi tin nhắn..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            {inputValue.trim() && (
                                <button
                                    className={cx('send-btn', { active: inputValue.trim() })}
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
