import { useState, useEffect, memo } from 'react';
import ShowAccount from '~/components/ShowAccount';
import configs from '~/configs';
import { accountService } from '~/services';

function FollowedAccount() {
    const [accountList, setAccountList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [seeMore, setSeeMore] = useState(false);

    // Get config
    const { defaultShowFollowed: numOfAccount } = configs.accounts;

    // Hiển thị tất cả hoặc chỉ số lượng ban đầu
    const currentList = seeMore ? accountList : accountList.slice(0, numOfAccount);
    const btnTitle = seeMore ? 'Ẩn bớt' : 'Xem thêm';
    const showButton = accountList.length > numOfAccount; 

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true);
            let result = null;
            try {
                result = await accountService.getSuggestedAccount();
            } catch (e) {
                result = [];
            }
            setAccountList(Array.isArray(result) ? result : []);
            setLoading(false);
        };
    
        fetchAPI();
    }, []);

    const handleShowHide = () => {
        setSeeMore(!seeMore);
    };

    const options = {
        btnTitle,
        loading,
        showButton, 
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