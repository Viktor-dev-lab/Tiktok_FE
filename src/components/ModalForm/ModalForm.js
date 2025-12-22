import classNames from 'classnames/bind'
import { useState, useMemo, useEffect } from 'react'

import { QRIcon, UserIcon, XMarkIcon } from '~/components/Icons'
import styles from './ModalForm.module.scss'
import images from '~/assets/images'
import Button from '~/components/Button'
import { Link } from 'react-router-dom'

const cx = classNames.bind(styles)

function ModalForm({ onHide }) {
    const [formLoginState, setFormLoginState] = useState('login')
    const [filteredForm, setFilteredForm] = useState([])
    const [showEmailForm, setShowEmailForm] = useState(false)
    
    // Login form states
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })
    
    // Register form states
    const [registerData, setRegisterData] = useState({
        firstName: '',
        lastName: '',
        nickname: '',
        email: '',
        password: ''
    })
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const loginRegisterForm = useMemo(() => [
        {
            type: 'login',
            title: 'Đăng nhập vào TikTok',
            contents: [
                {
                    icon: <QRIcon />,
                    title: 'Sử dụng mã QR',
                },
                {
                    icon: <UserIcon />,
                    title: 'Số điện thoại / Email / TikTok ID',
                    onClick: () => setShowEmailForm(true)
                },
                {
                    icon: <img src={images.facebook} alt="" />,
                    title: 'Tiếp tục với Facebook',
                },
                {
                    icon: <img src={images.google} alt="" />,
                    title: 'Tiếp tục với Google',
                },
                {
                    icon: <img src={images.twitter} alt="" />,
                    title: 'Tiếp tục với Twitter',
                },
                {
                    icon: <img src={images.line} alt="" />,
                    title: 'Tiếp tục với LINE',
                },
                {
                    icon: <img src={images.kakaotalk} alt="" />,
                    title: 'Tiếp tục với KakaoTalk',
                },
                {
                    icon: <img src={images.apple} alt="" />,
                    title: 'Tiếp tục với Apple',
                },
                {
                    icon: <img src={images.instagram} alt="" />,
                    title: 'Tiếp tục với Instagram',
                },
            ]
        },
        {
            type: 'register',
            title: 'Đăng ký TikTok',
            showMore: true,
            contents: [
                {
                    icon: <UserIcon />,
                    title: 'Sử dụng số điện thoại hoặc email',
                    onClick: () => setShowEmailForm(true)
                },
                {
                    icon: <img src={images.facebook} alt="" />,
                    title: 'Tiếp tục với Facebook',
                },
                {
                    icon: <img src={images.google} alt="" />,
                    title: 'Tiếp tục với Google',
                },
                {
                    icon: <img src={images.line} alt="" />,
                    title: 'Tiếp tục với LINE',
                },
                {
                    icon: <img src={images.kakaotalk} alt="" />,
                    title: 'Tiếp tục với KakaoTalk',
                },
            ]
        }
    ], [])

    useEffect(() => {
        const newForm = loginRegisterForm.find(form => form.type === formLoginState)
        setFilteredForm(newForm)
        setShowEmailForm(false)
        setError('')
        setSuccess('')
    }, [loginRegisterForm, formLoginState])

    const handleLoginSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess('Đăng nhập thành công!')
                // Lưu token vào localStorage nếu có
                if (data.token) {
                    localStorage.setItem('token', data.token)
                }
                // Đóng modal sau 1 giây
                setTimeout(() => {
                    onHide()
                    window.location.reload() // Reload trang để cập nhật trạng thái đăng nhập
                }, 1000)
            } else {
                setError(data.message || 'Đăng nhập thất bại!')
            }
        } catch (err) {
            setError('Lỗi kết nối đến server!')
            console.error('Login error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerData)
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess('Đăng ký thành công! Vui lòng đăng nhập.')
                // Chuyển sang form đăng nhập sau 2 giây
                setTimeout(() => {
                    setFormLoginState('login')
                    setShowEmailForm(false)
                }, 2000)
            } else {
                setError(data.message || 'Đăng ký thất bại!')
            }
        } catch (err) {
            setError('Lỗi kết nối đến server!')
            console.error('Register error:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const handleRegisterChange = (e) => {
        setRegisterData({
            ...registerData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className={cx('modal-mask')}>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('inner')}>
                        <div className={cx('title')}>
                            {showEmailForm ? 
                                (formLoginState === 'login' ? 'Đăng nhập' : 'Đăng ký') : 
                                filteredForm.title
                            }
                        </div>

                        {!showEmailForm ? (
                            <div className={cx('list')}>
                                {filteredForm.contents?.map((content, index) => {
                                    return <Button 
                                        className={cx('btn')} 
                                        style={{ height: '44px', marginBottom: '16px' }} 
                                        key={index} 
                                        onClick={content.onClick}
                                    >
                                        <span className={cx('icon')}>{content.icon}</span> 
                                        <span>{content.title}</span>
                                    </Button>
                                })}
                            </div>
                        ) : (
                            <div className={cx('form-container')}>
                                {error && <div className={cx('error-message')}>{error}</div>}
                                {success && <div className={cx('success-message')}>{success}</div>}
                                
                                {formLoginState === 'login' ? (
                                    <form onSubmit={handleLoginSubmit}>
                                        <div className={cx('form-group')}>
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={loginData.email}
                                                onChange={handleLoginChange}
                                                placeholder="Nhập email của bạn"
                                                required
                                            />
                                        </div>
                                        
                                        <div className={cx('form-group')}>
                                            <label>Mật khẩu</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={loginData.password}
                                                onChange={handleLoginChange}
                                                placeholder="Nhập mật khẩu"
                                                required
                                            />
                                        </div>

                                        <Button 
                                            className={cx('submit-btn')} 
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                                        </Button>

                                        <div className={cx('back-btn')} onClick={() => setShowEmailForm(false)}>
                                            ← Quay lại
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleRegisterSubmit}>
                                        <div className={cx('form-group')}>
                                            <label>Họ</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={registerData.firstName}
                                                onChange={handleRegisterChange}
                                                placeholder="Nhập họ"
                                                required
                                            />
                                        </div>

                                        <div className={cx('form-group')}>
                                            <label>Tên</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={registerData.lastName}
                                                onChange={handleRegisterChange}
                                                placeholder="Nhập tên"
                                                required
                                            />
                                        </div>

                                        <div className={cx('form-group')}>
                                            <label>Nickname</label>
                                            <input
                                                type="text"
                                                name="nickname"
                                                value={registerData.nickname}
                                                onChange={handleRegisterChange}
                                                placeholder="Nhập nickname"
                                                required
                                            />
                                        </div>
                                        
                                        <div className={cx('form-group')}>
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={registerData.email}
                                                onChange={handleRegisterChange}
                                                placeholder="Nhập email của bạn"
                                                required
                                            />
                                        </div>
                                        
                                        <div className={cx('form-group')}>
                                            <label>Mật khẩu</label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={registerData.password}
                                                onChange={handleRegisterChange}
                                                placeholder="Nhập mật khẩu"
                                                required
                                                minLength="6"
                                            />
                                        </div>

                                        <Button 
                                            className={cx('submit-btn')} 
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Đang xử lý...' : 'Đăng ký'}
                                        </Button>

                                        <div className={cx('back-btn')} onClick={() => setShowEmailForm(false)}>
                                            ← Quay lại
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>

                    {formLoginState.startsWith('register') && !showEmailForm &&
                        <div className={cx('agreement')}>
                            <p> Bằng việc tiếp tục, bạn đồng ý với <Link to="/">Điều khoản Sử dụng</Link>, đồng thời xác nhận rằng bạn đã đọc  <Link to="/">Chính sách Quyền riêng tư</Link> của chúng tôi.</p>
                        </div>}

                    {!showEmailForm && (
                        <div className={cx('footer')}>
                            {formLoginState === 'login' ?
                                <>Bạn không có tài khoản? <p style={{ color: 'red' }} onClick={() => setFormLoginState('register')}> Đăng ký</p> </> :
                                <>Bạn đã có tài khoản? <p style={{ color: 'red' }} onClick={() => setFormLoginState('login')}>Đăng nhập</p></>
                            }
                        </div>
                    )}
                </div>

                <div className={cx('close-btn')} onClick={onHide}> <XMarkIcon /> </div>
            </div>
        </div>
    )
}

export default ModalForm