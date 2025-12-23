import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Comment.module.scss';
import Button from '~/components/Button';
import Image from '~/components/Img';
import SuggestVideoControl from '~/components/Videos/SuggestVideo/SuggestVideoControl';
import { XMarkIcon } from '~/components/Icons';
import assetImages from '~/assets/images';
import VideoContext from '~/Context/VideoContext';
import { useAuth } from '~/Context/AuthContext';
import useWebSocket from '~/hooks/useWebSocket';
import SvgIcon from '~/components/SvgIcon';
import { iconHeart } from '~/components/SvgIcon/iconsRepo';
import ShowTick from '~/components/ShowTick';

const cx = classNames.bind(styles);
const API_BASE_URL = 'http://localhost:8080/api';

function Comment() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const videoInfo = location.state?.videoInfo || null;
    const { currentUser } = useAuth();
    const { notifications } = useWebSocket();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [expandedReplies, setExpandedReplies] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const commentsEndRef = useRef(null);
    const hasFetchedRef = useRef(false);

    // VideoContext state
    const [volume, setVolume] = useState(0.5);
    const [muted, setMuted] = useState(true);
    const inViewArr = useRef([]);

    const contextValue = {
        volumeState: [volume, setVolume],
        mutedState: [muted, setMuted],
        inViewArr: inViewArr.current,
    };

    // Fetch comments từ API
    const fetchComments = async () => {
        if (!videoId) return;
        
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/videos/${videoId}/comments`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched comments:', data); // Debug log
                if (data.success && data.data) {
                    setComments(data.data);
                } else {
                    setComments([]);
                }
            } else {
                console.error('Failed to fetch comments:', response.status);
                setComments([]);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    // Load comments khi component mount
    useEffect(() => {
        if (videoId && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchComments();
        }
    }, [videoId]);

    // Lắng nghe WebSocket notifications
    useEffect(() => {
        if (notifications && videoId) {
            const videoIdNum = parseInt(videoId);
            
            if (
                (notifications.type === 'COMMENT_ADDED' && notifications.videoId === videoIdNum) ||
                (notifications.type === 'REPLY_ADDED' && notifications.videoId === videoIdNum)
            ) {
                console.log('WebSocket notification received, reloading comments...'); // Debug log
                fetchComments();
            }
        }
    }, [notifications, videoId]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser?.id) return;

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');
            const content = encodeURIComponent(newComment.trim());
            const response = await fetch(
                `${API_BASE_URL}/videos/${videoId}/comments?user_id=${currentUser.id}&content=${content}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('Comment created:', data); // Debug log
                if (data.success) {
                    setNewComment('');
                    // Reload comments ngay lập tức
                    await fetchComments();
                    // Scroll to top
                    setTimeout(() => {
                        if (commentsEndRef.current) {
                            commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }
            } else {
                console.error('Failed to create comment');
                alert('Không thể tạo bình luận');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
            alert('Có lỗi xảy ra khi tạo bình luận');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (commentId) => {
        if (!replyContent.trim() || !currentUser?.id) return;

        try {
            setSubmitting(true);
            const token = localStorage.getItem('token');
            const content = encodeURIComponent(replyContent.trim());
            const response = await fetch(
                `${API_BASE_URL}/videos/${videoId}/comments/${commentId}/replies?user_id=${currentUser.id}&content=${content}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setReplyContent('');
                    setReplyingTo(null);
                    // Reload comments
                    await fetchComments();
                    // Expand replies for this comment
                    setExpandedReplies((prev) => new Set([...prev, commentId]));
                }
            } else {
                console.error('Failed to create reply');
                alert('Không thể tạo phản hồi');
            }
        } catch (error) {
            console.error('Error creating reply:', error);
            alert('Có lỗi xảy ra khi tạo phản hồi');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLikeComment = async (commentId) => {
        if (!currentUser?.id) return;

        const comment = comments.find((c) => c.id === commentId);
        if (!comment) return;

        const wasLiked = comment.is_liked;

        // Optimistic update
        setComments((prev) =>
            prev.map((c) =>
                c.id === commentId
                    ? {
                          ...c,
                          is_liked: !c.is_liked,
                          likes_count: c.is_liked ? c.likes_count - 1 : c.likes_count + 1,
                      }
                    : c
            )
        );

        try {
            const token = localStorage.getItem('token');
            if (wasLiked) {
                // Unlike
                const response = await fetch(
                    `${API_BASE_URL}/videos/${videoId}/comments/${commentId}/like`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    // Revert on error
                    setComments((prev) =>
                        prev.map((c) =>
                            c.id === commentId
                                ? {
                                      ...c,
                                      is_liked: wasLiked,
                                      likes_count: wasLiked ? c.likes_count + 1 : c.likes_count - 1,
                                  }
                                : c
                        )
                    );
                }
            } else {
                // Like
                const response = await fetch(
                    `${API_BASE_URL}/videos/${videoId}/comments/${commentId}/like?user_id=${currentUser.id}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    // Revert on error
                    setComments((prev) =>
                        prev.map((c) =>
                            c.id === commentId
                                ? {
                                      ...c,
                                      is_liked: wasLiked,
                                      likes_count: wasLiked ? c.likes_count + 1 : c.likes_count - 1,
                                  }
                                : c
                        )
                    );
                }
            }
        } catch (error) {
            console.error('Error toggling like:', error);
            // Revert on error
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId
                        ? {
                              ...c,
                              is_liked: wasLiked,
                              likes_count: wasLiked ? c.likes_count + 1 : c.likes_count - 1,
                          }
                        : c
                )
            );
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;

        try {
            setDeletingId(commentId);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/videos/${videoId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Remove comment from list
                setComments((prev) => prev.filter((c) => c.id !== commentId));
            } else {
                console.error('Failed to delete comment');
                alert('Không thể xóa bình luận');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Có lỗi xảy ra khi xóa bình luận');
        } finally {
            setDeletingId(null);
        }
    };

    const toggleReplies = (commentId) => {
        setExpandedReplies((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
        return date.toLocaleDateString('vi-VN');
    };

    const displayVideoInfo = videoInfo || {
        id: videoId || 1,
        thumb_url: assetImages.thumb_avatar,
        file_url: '',
        description: 'Video mẫu',
        user: {
            nickname: 'user',
            avatar: assetImages.avartar,
            first_name: 'User',
            last_name: 'Name',
        },
        likes_count: 0,
        comments_count: comments.length,
        shares_count: 0,
        views_count: 0,
    };

    // Render reply input
    const renderReplyInput = (commentId, parentUsername) => (
        <div className={cx('reply-input-wrapper')}>
            <Image
                className={cx('reply-input-avatar')}
                src={currentUser?.avatar || assetImages.avartar}
                alt=""
            />
            <div className={cx('reply-input-container')}>
                <input
                    type="text"
                    className={cx('reply-input')}
                    placeholder={`Trả lời ${parentUsername}...`}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleReply(commentId);
                        }
                    }}
                />
                <div className={cx('reply-actions')}>
                    <Button
                        className={cx('cancel-reply-btn')}
                        onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        primary
                        className={cx('submit-reply-btn')}
                        onClick={() => handleReply(commentId)}
                        disabled={!replyContent.trim() || submitting}
                    >
                        {submitting ? 'Đang gửi...' : 'Đăng'}
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <VideoContext value={contextValue}>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    {/* Video Section */}
                    <div className={cx('video-section')}>
                        <div className={cx('video-header')}>
                            <Button
                                className={cx('close-btn')}
                                onClick={() => navigate(-1)}
                                leftIcon={<XMarkIcon />}
                            >
                                Đóng
                            </Button>
                        </div>
                        <div className={cx('video-player-wrapper')}>
                            <SuggestVideoControl
                                videoInfo={displayVideoInfo}
                                isInView={true}
                                videoId={0}
                            />
                        </div>
                        <div className={cx('video-info')}>
                            <div className={cx('user-info')}>
                                <Image
                                    className={cx('avatar')}
                                    src={displayVideoInfo.user?.avatar}
                                    alt=""
                                />
                                <div className={cx('user-details')}>
                                    <span className={cx('username')}>
                                        {displayVideoInfo.user?.nickname}
                                        {displayVideoInfo.user?.tick && (
                                            <ShowTick tick={displayVideoInfo.user.tick} />
                                        )}
                                    </span>
                                    <span className={cx('fullname')}>
                                        {displayVideoInfo.user?.first_name}{' '}
                                        {displayVideoInfo.user?.last_name}
                                    </span>
                                </div>
                            </div>
                            <p className={cx('description')}>
                                {displayVideoInfo.description || 'Không có mô tả'}
                            </p>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className={cx('comments-section')}>
                        <div className={cx('comments-header')}>
                            <h2 className={cx('title')}>Bình luận ({comments.length})</h2>
                        </div>

                        <div className={cx('comments-list')}>
                            <div ref={commentsEndRef} />
                            {loading ? (
                                <div className={cx('loading')}>Đang tải...</div>
                            ) : comments.length === 0 ? (
                                <div className={cx('empty-comments')}>
                                    <p>Chưa có bình luận nào</p>
                                    <p className={cx('empty-hint')}>Hãy là người đầu tiên bình luận!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className={cx('comment-item')}>
                                        <Image
                                            className={cx('comment-avatar')}
                                            src={comment.user?.avatar || assetImages.avartar}
                                            alt=""
                                        />
                                        <div className={cx('comment-content')}>
                                            <div className={cx('comment-header')}>
                                                <span className={cx('comment-username')}>
                                                    {comment.user?.nickname || 'Unknown'}
                                                </span>
                                                {comment.user?.tick && (
                                                    <ShowTick tick={comment.user.tick} />
                                                )}
                                            </div>
                                            <p className={cx('comment-text')}>{comment.content}</p>
                                            <div className={cx('comment-actions')}>
                                                <span className={cx('comment-time')}>
                                                    {formatTime(comment.created_at)}
                                                </span>
                                                <button
                                                    className={cx('like-btn', {
                                                        liked: comment.is_liked,
                                                    })}
                                                    onClick={() => handleLikeComment(comment.id)}
                                                >
                                                    <SvgIcon
                                                        icon={iconHeart}
                                                        size={16}
                                                        className={cx('heart-icon')}
                                                    />
                                                    {comment.likes_count > 0 && comment.likes_count}
                                                </button>
                                                <button
                                                    className={cx('reply-btn')}
                                                    onClick={() => {
                                                        setReplyingTo(
                                                            replyingTo === comment.id ? null : comment.id
                                                        );
                                                        setReplyContent('');
                                                    }}
                                                >
                                                    Phản hồi
                                                </button>
                                                {currentUser?.id === comment.user?.id && (
                                                    <button
                                                        className={cx('delete-btn')}
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        disabled={deletingId === comment.id}
                                                    >
                                                        {deletingId === comment.id ? 'Đang xóa...' : 'Xóa'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Replies */}
                                            {comment.replies && comment.replies.length > 0 && (
                                                <div className={cx('replies')}>
                                                    {!expandedReplies.has(comment.id) ? (
                                                        <button
                                                            className={cx('view-replies-btn')}
                                                            onClick={() => toggleReplies(comment.id)}
                                                        >
                                                            Xem {comment.replies.length} phản hồi
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <button
                                                                className={cx('hide-replies-btn')}
                                                                onClick={() => toggleReplies(comment.id)}
                                                            >
                                                                Ẩn phản hồi
                                                            </button>
                                                            {comment.replies.map((reply) => (
                                                                <div key={reply.id} className={cx('reply-item')}>
                                                                    <Image
                                                                        className={cx('reply-avatar')}
                                                                        src={
                                                                            reply.user?.avatar ||
                                                                            assetImages.avartar
                                                                        }
                                                                        alt=""
                                                                    />
                                                                    <div className={cx('reply-content')}>
                                                                        <div className={cx('reply-header')}>
                                                                            <span className={cx('reply-username')}>
                                                                                {reply.user?.nickname || 'Unknown'}
                                                                            </span>
                                                                            {reply.user?.tick && (
                                                                                <ShowTick tick={reply.user.tick} />
                                                                            )}
                                                                        </div>
                                                                        <p className={cx('reply-text')}>
                                                                            {reply.content}
                                                                        </p>
                                                                        <div className={cx('reply-actions')}>
                                                                            <span className={cx('reply-time')}>
                                                                                {formatTime(reply.created_at)}
                                                                            </span>
                                                                            <button
                                                                                className={cx('like-btn', {
                                                                                    liked: reply.is_liked,
                                                                                })}
                                                                                onClick={() =>
                                                                                    handleLikeComment(reply.id)
                                                                                }
                                                                            >
                                                                                <SvgIcon
                                                                                    icon={iconHeart}
                                                                                    size={14}
                                                                                    className={cx('heart-icon')}
                                                                                />
                                                                                {reply.likes_count > 0 &&
                                                                                    reply.likes_count}
                                                                            </button>
                                                                            {currentUser?.id === reply.user?.id && (
                                                                                <button
                                                                                    className={cx('delete-btn')}
                                                                                    onClick={() =>
                                                                                        handleDeleteComment(reply.id)
                                                                                    }
                                                                                    disabled={deletingId === reply.id}
                                                                                >
                                                                                    {deletingId === reply.id
                                                                                        ? 'Đang xóa...'
                                                                                        : 'Xóa'}
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Reply Input */}
                                            {replyingTo === comment.id && renderReplyInput(comment.id, comment.user?.nickname)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Comment Input */}
                        {currentUser && (
                            <div className={cx('comment-input-wrapper')}>
                                <form onSubmit={handleSubmitComment} className={cx('comment-form')}>
                                    <Image
                                        className={cx('input-avatar')}
                                        src={currentUser.avatar || assetImages.avartar}
                                        alt=""
                                    />
                                    <div className={cx('input-container')}>
                                        <input
                                            type="text"
                                            className={cx('comment-input')}
                                            placeholder="Thêm bình luận..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <Button
                                            type="submit"
                                            primary
                                            disabled={!newComment.trim() || submitting}
                                            className={cx('submit-btn')}
                                        >
                                            {submitting ? 'Đang gửi...' : 'Đăng'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </VideoContext>
    );
}

export default Comment;