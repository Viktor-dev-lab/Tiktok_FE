// ============================================
// FILE: ShowAccount.js - Component hiển thị danh sách account với nút Follow
// ============================================
import PropTypes from 'prop-types';
import { useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './ShowAccount.module.scss';
import Account from '~/components/Items/Account';
import BorderTopContainer from '~/components/BorderTopContainer';
import AccountLoading from '~/components/Loading/AccountLoading';

const cx = classNames.bind(styles);

function ShowAccount({ 
    title, 
    accountItems, 
    hoverActivate, 
    btnTitle, 
    loading = false, 
    onClick,
    showFollowButton = true, // Hiển thị nút Follow
    onFollowClick // Callback khi click Follow
}) {
    const isLoad = loading || accountItems.length === 0;
    const customTippy = useRef({ placement: 'bottom', offset: [0, 0] });

    const handleFollowClick = (accountInfo, e) => {
        e.preventDefault(); // Ngăn navigation khi click Follow
        e.stopPropagation();
        
        if (onFollowClick) {
            onFollowClick(accountInfo);
        }
    };

    return (
        <BorderTopContainer className={cx('wrapper')}>
            <h3 className={cx('title')}>{title}</h3>
            <div className={cx('content')}>
                {accountItems.map((item, index) => (
                    <div key={item.id || index} className={cx('account-item-wrapper')}>
                        <Account
                            accountInfo={item}
                            hoverActivate={hoverActivate}
                            customTippy={customTippy.current}
                            state={item}
                        />
                        {showFollowButton && (
                            <button
                                className={cx('follow-btn', { 
                                    'following': item.isFollowed 
                                })}
                                onClick={(e) => handleFollowClick(item, e)}
                            >
                                {item.isFollowed ? 'Đang Follow' : 'Follow'}
                            </button>
                        )}
                    </div>
                ))}

                {(isLoad && <AccountLoading />) || (
                    <b className={cx('see-more-btn')} onClick={onClick}>
                        {btnTitle}
                    </b>
                )}
            </div>
        </BorderTopContainer>
    );
}

ShowAccount.propTypes = {
    title: PropTypes.string,
    accountItems: PropTypes.array.isRequired,
    hoverActivate: PropTypes.bool,
    btnTitle: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    showFollowButton: PropTypes.bool,
    onFollowClick: PropTypes.func,
};

export default ShowAccount;