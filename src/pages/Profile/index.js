import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';

import styles from './Profile.module.scss';
import Image from '~/components/Img';
import Button from '~/components/Button';
import { BanIcon, EllipsisHorizontalIcon, FlagIcon, LinkIcon, ShareIcon, UserRegularIcon } from '~/components/Icons';
import ShareAction from '~/components/ShareAction';
import VideoPreview from '~/components/VideoPreview';
import Popper from '~/components/Popper';
import { ModalContext } from '~/components/ModalProvider';
import assetImages from '~/assets/images';
import { useAuth } from '~/Context/AuthContext';

const cx = classNames.bind(styles);

function Profile() {
    const { currentUser } = useAuth();
    const [videos, setVideos] = useState([]);
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const context = useContext(ModalContext);

    useEffect(() => {
        if (!currentUser?.id) {
            setLoading(false);
            return;
        }

        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `http://localhost:8080/api/videos/user/${currentUser.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                const json = await res.json();
                const videosData = json.data || [];
                setVideos(videosData);
                
                // Lấy thông tin user từ video đầu tiên
                if (videosData.length > 0 && videosData[0].user) {
                    setProfileUser(videosData[0].user);
                } else {
                    // Nếu không có video, dùng currentUser
                    setProfileUser(currentUser);
                }
            } catch (error) {
                console.error('Fetch videos error:', error);
                // Nếu lỗi, vẫn hiển thị currentUser
                setProfileUser(currentUser);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [currentUser]);

    // Loading state
    if (loading) {
        return (
            <div className={cx('profile-wrapper')}>
                <div className={cx('loading')}>Đang tải...</div>
            </div>
        );
    }

    // Không có user data
    if (!profileUser) {
        return (
            <div className={cx('profile-wrapper')}>
                <div className={cx('no-user')}>Không tìm thấy thông tin người dùng</div>
            </div>
        );
    }

    return (
        <div className={cx('profile-wrapper')}>
            <div className={cx('info-container')}>
                <div className={cx('info')}>
                    <div className={cx('basic')}>
                        <Image 
                            className={cx('avatar')} 
                            src={profileUser.avatar} 
                            alt={profileUser.nickname} 
                        />
                        <div className={cx('text')}>
                            <div className={cx('username')}>{profileUser.nickname}</div>
                            <div className={cx('name')}>
                                {profileUser.fullName || `${profileUser.firstName} ${profileUser.lastName}`}
                            </div>
                            <Button color primary style={{ minWidth: '208px' }} onClick={context.handleShowModal}>
                                Follow
                            </Button>
                        </div>
                    </div>

                    <div className={cx('counts')}>
                        <div className={cx('following')}>
                            <strong>{profileUser.followingsCount || 0}</strong> Đang Follow
                        </div>
                        <div className={cx('followers')}>
                            <strong>{profileUser.followersCount || 0}</strong> Follower
                        </div>
                        <div className={cx('likes')}>
                            <strong>{profileUser.likesCount || 0}</strong> Thích
                        </div>
                    </div>

                    <div className={cx('bio')}>{profileUser.bio || 'Chưa có tiểu sử.'}</div>
                    {profileUser.websiteUrl && (
                        <a href={profileUser.websiteUrl} target="_blank" rel="noopener noreferrer">
                            <div className={cx('website')}>
                                <LinkIcon className={cx('link-icon')} />
                                {profileUser.websiteUrl}
                            </div>
                        </a>
                    )}
                </div>
                <div className={cx('side-btns')}>
                    <div className={cx('share-btn')}>
                        <ShareAction offset={[-100, 10]}>
                            <div>
                                <ShareIcon />
                            </div>
                        </ShareAction>
                    </div>

                    <HeadlessTippy
                        interactive
                        hideOnClick={false}
                        placement="bottom-end"
                        offset={[0, 10]}
                        delay={[0, 700]}
                        zIndex={99}
                        render={(attrs) => (
                            <div tabIndex="-1" {...attrs}>
                                <Popper className={cx('more-tab')}>
                                    <div className={cx('action-report')}>
                                        <p>
                                            <FlagIcon height="16" /> Báo cáo
                                        </p>
                                    </div>
                                    <div className={cx('action-block')}>
                                        <p>
                                            <BanIcon /> Chặn
                                        </p>
                                    </div>
                                </Popper>
                            </div>
                        )}
                    >
                        <div>
                            <EllipsisHorizontalIcon />
                        </div>
                    </HeadlessTippy>
                </div>
            </div>

            <div className={cx('video-container')}>
                <div className={cx('tabs')}>
                    <p className={cx('video-tab')}>Videos</p>
                    <p className={cx('liked-tab')}>Liked</p>
                    <div className={cx('underline')}></div>
                </div>

                {videos.length > 0 && (
                    <div className={cx('videos')}>
                        {videos.map((video) => {
                            return <VideoPreview data={video} key={video.id} />;
                        })}
                    </div>
                )}

                {videos.length === 0 && (
                    <div className={cx('no-content')}>
                        <div>
                            <UserRegularIcon />
                            <p className={cx('title')}>No content</p>
                            <p className={cx('description')}>This user has not published any videos.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;