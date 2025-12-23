import axios from 'axios';

const request = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const get = async (path, options = {}) => {
    try {
        const response = await  request.get(path, options);
        let result = null;
        try {
            result = await response.json();
        } catch (err) {
            result = null;
        }
        return result;
    } catch (err) {
        console.log('Failed to get: ', err);
    }
};
