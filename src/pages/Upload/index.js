import { useRef, useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './Upload.module.scss';
import Button from '~/components/Button';
import { HomeIcon } from '~/components/Icons';
import config from '~/configs';
import { useAuth } from '~/Context/AuthContext';

const cx = classNames.bind(styles);

function Upload() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSelectFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        // Validate đơn giản
        if (!selected.type.startsWith('video/')) {
            setError('Vui lòng chọn tệp video hợp lệ');
            setFile(null);
            setPreviewUrl('');
            return;
        }

        setError('');
        setFile(selected);
        setPreviewUrl(URL.createObjectURL(selected));
    };

    const handleSubmit = async () => {
        if (!currentUser?.id) {
            setError('Bạn cần đăng nhập trước khi tải video lên.');
            return;
        }

        if (!file) {
            setError('Vui lòng chọn một video để tải lên.');
            return;
        }

        try {
            setIsUploading(true);
            setError('');
            setSuccess('');

            const formData = new FormData();
            formData.append('user_id', currentUser.id);
            formData.append('file', file);
            if (caption) {
                formData.append('description', caption);
            }

            const res = await fetch('http://localhost:8080/api/videos', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
                },
                body: formData,
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                throw new Error(json.message || 'Tải video lên thất bại');
            }

            setSuccess('Tải video lên thành công!');

            // Sau khi upload thành công, điều hướng về trang profile hoặc home
            setTimeout(() => {
                navigate(config.routes.profile || config.routes.home);
            }, 1200);
        } catch (err) {
            setError(err.message || 'Đã có lỗi xảy ra khi tải video.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('back-button')}>
                <Button
                    leftIcon={
                        <HomeIcon
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        />
                    }
                    onClick={() => navigate(config.routes.home)}
                >
                    Quay lại trang chủ
                </Button>
            </div>

            <span className={cx('title')}>Tải video lên</span>
            <span className={cx('subtitle')}>Đăng video lên tài khoản của bạn</span>

            <div className={cx('content')}>
                <div className={cx('uploader')}>
                    <div className={cx('upload')}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <div className={cx('upload-card')} onClick={handleSelectFileClick}>
                            <img
                                src="https://lf16-tiktok-common.ttwstatic.com/obj/tiktok-web-common-sg/ies/creator_center/svgs/cloud-icon1.ecf0bf2b.svg"
                                className={cx('cloud-icon')}
                                alt=""
                            />

                            <div className={cx('text-main')}>
                                <span>Chọn video để tải lên</span>
                            </div>
                            <div className={cx('text-sub')}>
                                <span>Hoặc kéo và thả tập tin</span>
                            </div>
                            <div className={cx('text-video-info')}>
                                <span>MP4 hoặc WebM</span>
                                <span>Độ phân giải 720x1280 trở lên</span>
                                <span>Lên đến 10 phút</span>
                                <span>Dưới 2GB</span>
                            </div>

                            <Button primary onClick={handleSelectFileClick}>
                                Chọn tập tin
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={cx('form')}>
                    <div className={cx('caption-wrap')}>
                        <label>Mô tả</label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Thêm mô tả cho video của bạn"
                        />
                    </div>

                    {previewUrl && (
                        <div className={cx('preview-wrap')}>
                            <span className={cx('preview-title')}>Xem trước</span>
                            <video src={previewUrl} controls className={cx('preview-video')} />
                        </div>
                    )}

                    <div className={cx('btn-wrap')}>
                        <Button outline onClick={() => navigate(config.routes.home)}>
                            Hủy
                        </Button>
                        <Button primary disabled={isUploading} onClick={handleSubmit}>
                            {isUploading ? 'Đang tải lên...' : 'Đăng'}
                        </Button>
                    </div>

                    {error && <div className={cx('error')}>{error}</div>}
                    {success && <div className={cx('success')}>{success}</div>}
                </div>
            </div>
        </div>
    );
}

export default Upload;
