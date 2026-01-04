import { useEffect, useRef, useState } from 'react';
import { InView } from 'react-intersection-observer';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import SuggestVideo from '~/components/Videos/SuggestVideo';
// import { videoService } from '~/services';
import assetImages from '~/assets/images';
// import TiktokLoading from '~/components/TiktokLoading';
// import SvgIcon from '~/components/SvgIcon';
import VideoContext from '~/Context/VideoContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const cx = classNames.bind(styles);

function Home() {
    // State
    const [videoList, setVideoList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [page, setPage] = useState(Math.random() * 10);
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(true);

    // Ref
    const inViewArr = useRef([]);

    // Set value for context
    const contextValue = {
        volumeState: [volume, setVolume],
        mutedState: [muted, setMuted],
        inViewArr: inViewArr.current,
    };

    // Map BE data (camelCase) to component format (snake_case)
    const mapVideoData = (video) => {
        return {
            id: video.id,
            user_id: video.user?.id || video.user_id,
            type: video.type || '',
            thumb_url: video.thumbUrl || video.thumb_url || '',
            file_url: video.fileUrl || video.file_url || '',
            description: video.description || '',
            music: video.music || '',
            is_liked: video.isLiked !== undefined ? video.isLiked : video.is_liked || false,
            likes_count: video.likesCount !== undefined ? video.likesCount : video.likes_count || 0,
            comments_count: video.commentsCount !== undefined ? video.commentsCount : video.comments_count || 0,
            shares_count: video.sharesCount !== undefined ? video.sharesCount : video.shares_count || 0,
            views_count: video.viewsCount !== undefined ? video.viewsCount : video.views_count || 0,
            viewable: video.viewable || 'public',
            allows: video.allows || ['comment', 'duet', 'stitch'],
            published_at: video.publishedAt || video.published_at || new Date().toISOString(),
            created_at: video.createdAt || video.created_at || new Date().toISOString(),
            updated_at: video.updatedAt || video.updated_at || new Date().toISOString(),
                    user: {
                id: video.user?.id || 0,
                first_name: video.user?.firstName || video.user?.first_name || '',
                last_name: video.user?.lastName || video.user?.last_name || '',
                nickname: video.user?.nickname || '',
                avatar: video.user?.avatar || '',
                bio: video.user?.bio || '',
                tick: video.user?.tick !== undefined ? video.user.tick : video.user?.tick || false,
                is_followed: video.user?.isFollowed !== undefined ? video.user.isFollowed : video.user?.is_followed || false,
                followings_count: video.user?.followingsCount !== undefined ? video.user.followingsCount : video.user?.followings_count || 0,
                followers_count: video.user?.followersCount !== undefined ? video.user.followersCount : video.user?.followers_count || 0,
                likes_count: video.user?.likesCount !== undefined ? video.user.likesCount : video.user?.likes_count || 0,
                website_url: video.user?.websiteUrl || video.user?.website_url || '',
                facebook_url: video.user?.facebookUrl || video.user?.facebook_url || '',
                youtube_url: video.user?.youtubeUrl || video.user?.youtube_url || '',
                twitter_url: video.user?.twitterUrl || video.user?.twitter_url || '',
                instagram_url: video.user?.instagramUrl || video.user?.instagram_url || '',
                    },
                    meta: {
                file_format: video.meta?.fileFormat || video.meta?.file_format || 'mp4',
                mime_type: video.meta?.mimeType || video.meta?.mime_type || 'video/mp4',
                        video: {
                    resolution_x: video.meta?.video?.resolutionX !== undefined 
                        ? video.meta.video.resolutionX 
                        : video.meta?.video?.resolution_x || 720,
                    resolution_y: video.meta?.video?.resolutionY !== undefined 
                        ? video.meta.video.resolutionY 
                        : video.meta?.video?.resolution_y || 1280,
                },
            },
        };
    };

    // Call API to load video list
    useEffect(() => {
        const fetchVideoList = async () => {
            try {
                setLoading(true);
                setError(null);

                const token = localStorage.getItem('token');
                const headers = {
                    'Content-Type': 'application/json',
                };

                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const res = await fetch(`${API_BASE_URL}/videos`, {
                    method: 'GET',
                    headers,
                });

                const json = await res.json();

                if (!res.ok || !json.success) {
                    throw new Error(json.message || 'Không thể tải danh sách video');
                }

                // Map data từ BE format sang component format
                const videosData = Array.isArray(json.data) ? json.data : [];
                const mappedVideos = videosData.map(mapVideoData);

                // Shuffle videos để có trải nghiệm ngẫu nhiên
                const shuffledVideos = mappedVideos.sort(() => Math.random() - 0.5);
                setVideoList(shuffledVideos);
            } catch (err) {
                console.error('Fetch videos error:', err);
                setError(err.message || 'Đã có lỗi xảy ra khi tải video');
                setVideoList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVideoList();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('loading')}>Đang tải video...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('error')}>{error}</div>
            </div>
        );
    }

    // Empty state
    if (videoList.length === 0) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('empty')}>Chưa có video nào</div>
            </div>
        );
    }

    return (
        <VideoContext value={contextValue}>
            <div className={cx('wrapper')}>
                {videoList.map((video, index) => {
                    return (
                        <InView key={video.id || index} threshold={0.8}>
                            {({ inView, ref: observeRef }) => (
                                <SuggestVideo ref={observeRef} isInView={inView} videoInfo={video} videoId={index} />
                            )}
                        </InView>
                    );
                })}
                {/* <InView onChange={(inView) => inView && setPage(handleRandomPage(1, 10))}>
                    <SvgIcon className={cx('auto-load-more')} icon={<TiktokLoading />} />
                </InView> */}
            </div>
        </VideoContext>
    );
}

export default Home;
                
 
