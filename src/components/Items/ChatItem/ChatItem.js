import PropTypes from 'prop-types';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './ChatItem.module.scss';
import Img from '~/components/Img';
import ShowTick from '~/components/ShowTick';

const cx = classNames.bind(styles);

function ChatItem({ chatInfo }) {
    const { id, user, lastMessage, unreadCount } = chatInfo;

    // Format thời gian
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return 'Vừa xong';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày`;
        } else {
            return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        }
    };

    return (
        <Link to={`/messages/${id}`} className={cx('wrapper', { unread: unreadCount > 0 })}>
            <div className={cx('avatar-wrapper')}>
                <Img className={cx('avatar')} src={user.avatar} alt={user.fullName} />
                {unreadCount > 0 && <div className={cx('online-dot')}></div>}
            </div>
            <div className={cx('body')}>
                <div className={cx('header')}>
                    <div className={cx('username-wrapper')}>
                        <h4 className={cx('username')}>
                            {user.fullName}
                            {user.isVerified && <ShowTick tick={true} />}
                        </h4>
                    </div>
                    <span className={cx('time')}>{formatTime(lastMessage.createdAt)}</span>
                </div>
                <div className={cx('message-wrapper')}>
                    <p className={cx('last-message', { unread: unreadCount > 0 })}>
                        {lastMessage.content}
                    </p>
                    {unreadCount > 0 && <span className={cx('unread-badge')}>{unreadCount}</span>}
                </div>
            </div>
        </Link>
    );
}

ChatItem.propTypes = {
    chatInfo: PropTypes.shape({
        id: PropTypes.number.isRequired,
        user: PropTypes.shape({
            id: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            fullName: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
            isVerified: PropTypes.bool,
        }).isRequired,
        lastMessage: PropTypes.shape({
            id: PropTypes.number.isRequired,
            content: PropTypes.string.isRequired,
            senderId: PropTypes.number.isRequired,
            createdAt: PropTypes.string.isRequired,
            isRead: PropTypes.bool.isRequired,
        }).isRequired,
        unreadCount: PropTypes.number.isRequired,
    }).isRequired,
};

export default memo(ChatItem);
