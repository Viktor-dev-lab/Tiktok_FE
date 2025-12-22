import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './Messages.module.scss';
import ChatItem from '~/components/Items/ChatItem';
import { chatListData } from '~/mockData/chatData';
import SvgIcon from '~/components/SvgIcon';
import { iconSearch, iconLoading } from '~/components/SvgIcon/iconsRepo';

const cx = classNames.bind(styles);

function Messages() {
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');

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

    // Lọc danh sách chat theo search
    const filteredChatList = chatList.filter((chat) =>
        chat.user.fullName.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return (
        <div className={cx('wrapper')}>
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
                    filteredChatList.map((chat) => <ChatItem key={chat.id} chatInfo={chat} />)
                ) : (
                    <div className={cx('empty')}>
                        <p>Không tìm thấy cuộc hội thoại nào</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Messages;
