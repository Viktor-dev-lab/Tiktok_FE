import { memo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';

import styles from './header.module.scss';
import assetImages from '~/assets/images';
import SvgIcon from '~/components/SvgIcon';
import { iconMessage, iconSeeMore } from '~/components/SvgIcon/iconsRepo';
import Button from '~/components/Button';
import { MenuPopper } from '~/components/Popper';
import Img from '~/components/Img';
import Search from './Search';
import configs from '~/configs';
import { PlusIcon } from '~/components/Icons';
import ModalForm from '~/components/ModalForm';
import { useAuth } from '~/Context/AuthContext';
import useWebSocket from '~/hooks/useWebSocket';
import PopperWrapper from '~/components/Popper';

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const { notifications, isConnected } = useWebSocket();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [notificationsList, setNotificationsList] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotificationPopper, setShowNotificationPopper] = useState(false);

    const menuInfo = currentUser ? configs.menus.PRIVATE_MENU : configs.menus.PUBLIC_MENU;

    // Lắng nghe notifications từ WebSocket
    useEffect(() => {
        if (notifications) {
            const newNotification = {
                id: Date.now(),
                ...notifications,
                read: false,
            };
            console.log(newNotification)
            setNotificationsList((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);
            
            console.log('📬 New notification added to list:', newNotification);
        }
    }, [notifications]);

    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 7) return `${days} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    // Đánh dấu notification là đã đọc
    const markAsRead = (notificationId) => {
        setNotificationsList((prev) =>
            prev.map((notif) =>
                notif.id === notificationId ? { ...notif, read: true } : notif
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    // Đánh dấu tất cả là đã đọc
    const markAllAsRead = () => {
        setNotificationsList((prev) => prev.map((notif) => ({ ...notif, read: true })));
        setUnreadCount(0);
    };

    // Xử lý click vào notification
    const handleNotificationClick = (notification) => {
        markAsRead(notification.id);
        if (notification.videoId) {
            navigate(`/video/${notification.videoId}/comments`);
        }
        setShowNotificationPopper(false);
    };

    const handleDefaultClickMenu = (itemInfo) => {
        if (itemInfo.title === 'Xem hồ sơ') {
            if (currentUser) {
                navigate(`/@${currentUser.nickname}`, { state: currentUser });
            }
        }
        if (itemInfo.title === 'Đăng xuất') {
            handleLogout();
        }
    };

    const handleLogout = () => {
        logout();
        navigate(configs.routes.home);
    };

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleCloseModal = () => {
        setShowLoginModal(false);
    };

    // Render notification popper
    const renderNotificationPopper = (attrs) => (
        <div className={cx('notification-popper')} tabIndex="-1" {...attrs}>
            <div className={cx('arrow-popper')} data-popper-arrow />
            <PopperWrapper className={cx('notification-wrapper')}>
                <div className={cx('notification-header')}>
                    <h3 className={cx('notification-title')}>Thông báo</h3>
                    {unreadCount > 0 && (
                        <button className={cx('mark-all-read')} onClick={markAllAsRead}>
                            Đánh dấu tất cả đã đọc
                        </button>
                    )}
                </div>
                <div className={cx('notification-list')}>
                    {notificationsList.length === 0 ? (
                        <div className={cx('notification-empty')}>
                            <p>Chưa có thông báo nào</p>
                        </div>
                    ) : (
                        notificationsList.map((notification) => (
                            <div
                                key={notification.id}
                                className={cx('notification-item', {
                                    unread: !notification.read,
                                })}
                                onClick={() => handleNotificationClick(notification)}
                            >
                                <div className={cx('notification-avatar')}>
                                    {notification.videoThumbUrl ? (
                                        <Img
                                            src={notification.videoThumbUrl}
                                            alt="Video thumbnail"
                                            className={cx('thumbnail')}
                                        />
                                    ) : (
                                        <div className={cx('avatar-placeholder')}>
                                            <SvgIcon icon={iconMessage} size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className={cx('notification-content')}>
                                    <p className={cx('notification-message')}>
                                        <strong>{notification.userName}</strong> {notification.message}
                                    </p>
                                    <span className={cx('notification-time')}>
                                        {formatTime(notification.timestamp)}
                                    </span>
                                </div>
                                {!notification.read && <div className={cx('unread-dot')} />}
                            </div>
                        ))
                    )}
                </div>
            </PopperWrapper>
        </div>
    );

    return (
        <>
            <header className={cx('wrapper')}>
                <div className={cx('inner-header')}>
                    {/* Logo container */}
                    <div className={cx('logo')}>
                        <Link to={configs.routes.home}>
                            <img src={assetImages.logo} alt="Tiktok" />
                        </Link>
                    </div>

                    {/* Search Container */}
                    <Search />

                    {/* Action Container */}
                    <div className={cx('action-container')}>
                        {currentUser ? (
                            <>
                                <Button to={configs.routes.upload} className={cx('upload-btn')}>
                                    <PlusIcon className={cx('upload-icon')} /> Tải lên
                                </Button>
                                
                                {/* Notification Icon với Popper */}
                                <TippyHeadless
                                    render={renderNotificationPopper}
                                    interactive
                                    placement="bottom-end"
                                    offset={[20, 12]}
                                    delay={[0, 700]}
                                    hideOnClick={false}
                                    visible={showNotificationPopper}
                                    onClickOutside={() => setShowNotificationPopper(false)}
                                >
                                    <button
                                        className={cx('user-action-icon')}
                                        onClick={() => setShowNotificationPopper(!showNotificationPopper)}
                                    >
                                        <SvgIcon icon={iconMessage} size={32} />
                                        {unreadCount > 0 && (
                                            <span className={cx('notify')}>
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </TippyHeadless>
                            </>
                        ) : (
                            <>
                                <Button color onClick={handleLoginClick}>
                                    Đăng nhập
                                </Button>
                            </>
                        )}

                        <MenuPopper items={menuInfo} handleClickMenu={handleDefaultClickMenu}>
                            {currentUser ? (
                                <Img 
                                    src={currentUser.avatar || assetImages.avartar} 
                                    alt={currentUser.nickname} 
                                    className={cx('user-avatar')} 
                                />
                            ) : (
                                <button className={cx('see-more-btn', 'lh0')}>
                                    <SvgIcon icon={iconSeeMore} />
                                </button>
                            )}
                        </MenuPopper>
                    </div>
                </div>
            </header>

            {/* Login/Register Modal */}
            {showLoginModal && <ModalForm onHide={handleCloseModal} />}
        </>
    );
}

export default memo(Header);