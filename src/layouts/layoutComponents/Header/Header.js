import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
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

const cx = classNames.bind(styles);

function Header() {
    const navigate = useNavigate(); 

    const my_user = {
        id: 1,
        first_name: 'Hoàng',
        last_name: 'Minh',
        nickname: 'SunMinh🤖',
        avatar: assetImages.avartar,
        bio: 'Trang này chứa thông tin chi tiết của một nhân tài 🤫🤫',
        tick: true,
        is_followed: true,
        followings_count: 1,
        followers_count: 384,
        likes_count: 7070,
        website_url: 'https://www.facebook.com/nhm.fb.me/',
        facebook_url: '',
        youtube_url: '',
        twitter_url: '',
        instagram_url: '',
    };

    // State
    const [currentUser, setCurrentUser] = useState(true);

    const menuInfo = currentUser ? configs.menus.PRIVATE_MENU : configs.menus.PUBLIC_MENU;

    const handleDefaultClickMenu = (itemInfo) => {
        // Handle user action
        if (itemInfo.title === 'Xem hồ sơ') {
            navigate(`/@SunMinh🤖`, { state: my_user });
        }
        if (itemInfo.title === 'Đăng xuất') {
            setCurrentUser(false);
        }
    };

    return (
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
                            <Tippy className={cx('user-action')} content="Hộp thư">
                                <button className={cx('user-action-icon')}>
                                    <SvgIcon icon={iconMessage} size={32} />
                                    <span className={cx('notify')}>9</span>
                                </button>
                            </Tippy>
                        </>
                    ) : (
                        <>
                            <Button color onClick={() => setCurrentUser(true)}>
                                Đăng nhập
                            </Button>
                        </>
                    )}

                    <MenuPopper items={menuInfo} handleClickMenu={handleDefaultClickMenu}>
                        {currentUser ? (
                            <Img src={assetImages.avartar} alt="" className={cx('user-avatar')} />
                        ) : (
                            <button className={cx('see-more-btn', 'lh0')}>
                                <SvgIcon icon={iconSeeMore} />
                            </button>
                        )}
                    </MenuPopper>
                </div>
            </div>
        </header>
    );
}

export default memo(Header);
