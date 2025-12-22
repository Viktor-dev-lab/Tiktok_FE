// src/utils/authUtils.js

const API_BASE_URL = 'http://localhost:8080/api';

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
    const token = getAuthToken();
    
    if (!token) {
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const userData = await response.json();
            return userData;
        } else {
            // Token không hợp lệ
            removeAuthToken();
            return null;
        }
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

// Login function
export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.token) {
                setAuthToken(data.token);
            }
            return { success: true, data };
        } else {
            return { success: false, message: data.message || 'Đăng nhập thất bại!' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Lỗi kết nối đến server!' };
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