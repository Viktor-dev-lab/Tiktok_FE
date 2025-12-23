import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './ChatDetail.module.scss';
import MessageBubble from '~/components/MessageBubble';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';
import SvgIcon from '~/components/SvgIcon';
import { iconArrowLeft, iconSend, iconEmojiSmile } from '~/components/SvgIcon/iconsRepo';
import { chatListData, chatDetailData, currentUser } from '~/mockData/chatData';

const cx = classNames.bind(styles);

function ChatDetail() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const [messages, setMessages] = useState([]);
    const [chatInfo, setChatInfo] = useState(null);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        // Tìm thông tin chat từ chatId
        const chat = chatListData.find((c) => c.id === parseInt(chatId));
        if (chat) {
            setChatInfo(chat);
        }

        // Load messages từ mockup data
        const messagesData = chatDetailData[chatId] || [];
        setMessages(messagesData);
    }, [chatId]);

    // Auto scroll to bottom khi có tin nhắn mới
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            senderId: currentUser.id,
            receiverId: chatInfo.user.id,
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

    if (!chatInfo) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('empty')}>Không tìm thấy cuộc hội thoại</div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {/* Header */}
            <div className={cx('header')}>
                <button className={cx('back-btn')} onClick={() => navigate('/messages')}>
                    <SvgIcon icon={iconArrowLeft} size={24} />
                </button>
                <div className={cx('user-info')}>
                    <Img className={cx('avatar')} src={chatInfo.user.avatar} alt={chatInfo.user.fullName} />
                    <div className={cx('user-details')}>
                        <h3 className={cx('username')}>
                            {chatInfo.user.fullName}
                            {chatInfo.user.isVerified && <ShowTick tick={true} />}
                        </h3>
                        <p className={cx('status')}>Đang hoạt động</p>
                    </div>
                </div>
                <div className={cx('header-actions')}>
                    {/* Có thể thêm các action buttons ở đây */}
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
        </div>
    );
}

export default ChatDetail;
