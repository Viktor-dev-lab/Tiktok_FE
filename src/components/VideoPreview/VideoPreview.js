import { useRef } from 'react';
import classNames from 'classnames/bind';

import styles from './VideoPreview.module.scss';
import { PlayIcon } from '~/components/Icons';
import assetImages from '~/assets/images';

const cx = classNames.bind(styles);

// Convert Cloudinary video URL (mp4) to image thumbnail URL (jpg)
const getThumbnailUrl = (thumbUrl, fileUrl) => {
    const rawUrl = thumbUrl || fileUrl;

    if (!rawUrl) return '';

    // Only try to transform Cloudinary URLs
    if (!rawUrl.includes('res.cloudinary.com')) {
        return rawUrl;
    }

    // Tách query string (nếu có)
    const [base, query] = rawUrl.split('?');

    // Lấy frame đầu (so_0) và đổi đuôi sang .jpg
    const withFrame = base.replace('/video/upload/', '/video/upload/so_0/');
    const asJpg = withFrame.replace(/\.(mp4|mov|m4v)$/i, '.jpg');

    return query ? `${asJpg}?${query}` : asJpg;
};

function VideoPreview({ data }) {
    const videoRef = useRef();
    const thumbnailUrl = getThumbnailUrl(data.thumbUrl, data.fileUrl);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div style={{ paddingTop: '178%' }}>
                    <div
                        className={cx('video-container')}
                        onMouseEnter={() =>
                            videoRef.current
                                .play()
                                .catch((error) => {
                                    // Handle the play() error
                                    console.log('Autoplay play() error: ', error.message);
                                })
                        }
                    >
                        <div className={cx('video-inner')}>
                            <div className={cx('image')}>
                                <img src={thumbnailUrl || assetImages.noImage} alt={data.description || ''} />
                            </div>
                            <div className={cx('video')}>
                                <video muted ref={videoRef} src={data.fileUrl} />
                            </div>
                            <div className={cx('views')}>
                                <PlayIcon />
                                <strong className={cx('count')}>{data.viewsCount}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className={cx('tag')}>{data.description}</div> */}
        </div>
    );
}

export default VideoPreview;
