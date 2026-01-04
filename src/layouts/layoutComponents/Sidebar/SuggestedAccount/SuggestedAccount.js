import { useState, useEffect, memo } from 'react';
import ShowAccount from '~/components/ShowAccount';
import configs from '~/configs';
import { accountService, chatService } from '~/services';

function FollowedAccount() {
    const [accountList, setAccountList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [seeMore, setSeeMore] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const { defaultShowFollowed: numOfAccount } = configs.accounts;

    const currentList = seeMore ? accountList : accountList.slice(0, numOfAccount);
    const btnTitle = seeMore ? 'Ẩn bớt' : 'Xem thêm';
    const showButton = accountList.length > numOfAccount; 

    useEffect(() => {
        // Lấy current user từ localStorage (lưu dạng JSON object)
        const userStr = localStorage.getItem('user');
        let parsedUserId = null;
        
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                parsedUserId = user?.id || null;
                console.log(parsedUserId)
            } catch (e) {
                console.error('Error parsing user from localStorage:', e);
            }
        }
        
        setCurrentUserId(parsedUserId);

        const fetchAPI = async () => {
            setLoading(true);
            try {
                // Truyền excludeUserId để service tự lọc
                const result = await accountService.getSuggestedAccount(20, 1, parsedUserId);
                setAccountList(Array.isArray(result) ? result : []);
            } catch (e) {
                setAccountList([]);
            }
            setLoading(false);
        };
    
        fetchAPI();
    }, []);

    const handleShowHide = () => {
        setSeeMore(!seeMore);
    };

    // Xử lý Follow/Unfollow
    const handleFollowClick = async (accountInfo) => {
        if (!currentUserId) {
            alert('Vui lòng đăng nhập để follow');
            return;
        }

        try {
            const isFollowing = accountInfo.isFollowed;
            
            // Optimistic Update - Cập nhật UI ngay lập tức
            setAccountList(prevList => 
                prevList.map(account => 
                    account.id === accountInfo.id
                        ? { 
                            ...account, 
                            isFollowed: !isFollowing,
                            followersCount: isFollowing 
                                ? account.followersCount - 1 
                                : account.followersCount + 1
                          }
                        : account
                )
            );

            if (isFollowing) {
                // Unfollow - Chỉ unfollow, không xóa tin nhắn
                // await accountService.unfollowUser(currentUserId, accountInfo.id);
                console.log('Unfollowed user:', accountInfo.id);
                
            } else {
                // Follow - Gửi tin nhắn kết bạn tự động
                console.log('Following user:', accountInfo.id);
                
                // Gọi API gửi tin nhắn
                await chatService.sendMessage(
                    currentUserId,
                    accountInfo.id,
                    'Hi! Mình kết bạn nhé 👋'
                );
                
                console.log('Message sent: "Hi! Mình kết bạn nhé 👋"');
                
                // TODO: Gọi API follow nếu có
                // await accountService.followUser(currentUserId, accountInfo.id);
            }

        } catch (error) {
            console.error('Follow error:', error);
            
            // Rollback nếu có lỗi
            setAccountList(prevList => 
                prevList.map(account => 
                    account.id === accountInfo.id
                        ? { 
                            ...account, 
                            isFollowed: accountInfo.isFollowed,
                            followersCount: accountInfo.followersCount
                          }
                        : account
                )
            );
            
            alert('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const options = {
        btnTitle,
        loading,
        showButton,
        showFollowButton: true,
        onFollowClick: handleFollowClick,
    };

    return (
        accountList.length > 0 && (
            <ShowAccount 
                title="Các tài khoản được đề xuất" 
                accountItems={currentList} 
                onClick={handleShowHide} 
                {...options} 
            />
        )
    );
}

export default memo(FollowedAccount);