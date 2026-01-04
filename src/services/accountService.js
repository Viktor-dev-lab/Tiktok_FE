import { httpRequest } from '~/utils';

const path = 'users';

export const getSuggestedAccount = async (perPage = 20, page = 1,excludeUserId = null ) => {
    const data = await httpRequest.get(path, {
        params: { page, per_page: perPage }
    });
    
    const users = data?.data || [];
    
    if (excludeUserId) {
        return users.filter(user => user.id !== excludeUserId);
    }
    
    return users;
};

// Nếu muốn lấy random page
export const getRandomSuggestedAccount = async (perPage = 20) => {
    const randomPage = Math.floor(Math.random() * 10) + 1;
    return getSuggestedAccount(perPage, randomPage);
};