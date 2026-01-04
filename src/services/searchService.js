import { httpRequest } from '~/utils';

const path = 'users/search';

export const search = async (keyword, type = 'less') => {
    try {
        const dataResponse = await httpRequest.get(path, {
            params: {
                q: keyword,
                type
            },
        });
        return (dataResponse && Array.isArray(dataResponse.data)) ? dataResponse.data : [];
    } catch (err) {
        return [];
    }
};