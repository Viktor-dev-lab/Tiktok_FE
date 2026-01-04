import axios from 'axios';

const request = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const get = async (path, options = {}) => {
    try {
        const response = await request.get(path, options);
        // Axios response đã có sẵn data, không cần .json()
        return response.data;
    } catch (err) {
        console.log('Failed to get: ', err);
        return null;
    }
};

export const post = async (path, data = {}, options = {}) => {
    try {
        const response = await request.post(path, data, options);
        return response.data;
    } catch (err) {
        console.log('Failed to post: ', err);
        return null;
    }
};

export const put = async (path, data = {}, options = {}) => {
    try {
        const response = await request.put(path, data, options);
        return response.data;
    } catch (err) {
        console.log('Failed to put: ', err);
        return null;
    }
};

export const del = async (path, options = {}) => {
    try {
        const response = await request.delete(path, options);
        return response.data;
    } catch (err) {
        console.log('Failed to delete: ', err);
        return null;
    }
};

export default request;