import PropTypes from 'prop-types';
import { memo } from 'react';
import classNames from 'classnames/bind';

import styles from './MessageBubble.module.scss';

const cx = classNames.bind(styles);

function MessageBubble({ message, isSender }) {
    // Format thời gian
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={cx('wrapper', { sender: isSender, receiver: !isSender })}>
            <div className={cx('message-bubble')}>
                <p className={cx('message-content')}>{message.content}</p>
            </div>
            <span className={cx('message-time')}>{formatTime(message.createdAt)}</span>
        </div>
    );
}

MessageBubble.propTypes = {
    message: PropTypes.shape({
        id: PropTypes.number.isRequired,
        senderId: PropTypes.number.isRequired,
        receiverId: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        isRead: PropTypes.bool.isRequired,
    }).isRequired,
    isSender: PropTypes.bool.isRequired,
};

export default memo(MessageBubble);
