// src/utils/authUtils.js

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Lưu token vào localStorage
export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
};

// Lấy token từ localStorage
export const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Xóa token khỏi localStorage
export const removeAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Kiểm tra xem user đã đăng nhập chưa
export const isAuthenticated = () => {
    return !!getAuthToken();
};

// Lấy thông tin user hiện tại từ API
export const getCurrentUser = async () => {
    const user = localStorage.getItem('user');

    if (!user || user === 'undefined') return null;

    try {
        return JSON.parse(user);
    } catch (e) {
        console.error('Invalid user JSON:', user);
        return null;
    }
};


// Login function
export const login = async (email, password) => {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
            return {
                success: false,
                message: result.message || 'Đăng nhập thất bại'
            };
        }

        const { accessToken, refreshToken, user } = result.data;

        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        return {
            success: true,
            user
        };
    } catch (err) {
        console.error('Login error:', err);
        return {
            success: false,
            message: 'Lỗi kết nối server'
        };
    }
};



// Register function
export const register = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.message || 'Đăng ký thất bại!' };
        }
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, message: 'Lỗi kết nối đến server!' };
    }
};

// Logout function
export const logout = () => {
    removeAuthToken();
};

// API call với authentication
export const authenticatedFetch = async (url, options = {}) => {
    const token = getAuthToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            ...options,
            headers
        });

        // Nếu response là 401 (Unauthorized), xóa token
        if (response.status === 401) {
            removeAuthToken();
            window.location.href = '/';
        }

        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};