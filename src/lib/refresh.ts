import { refreshAccessTokenCookie } from './auth';

export async function callForRefresh<T>(toRetryFunction: () => Promise<T>): Promise<T> {
    try {
        const newAccessToken = await refreshAccessTokenCookie();
        if (!newAccessToken) {
            throw new Error('Session expired. Please login again.');
        }
        return await toRetryFunction();
    } catch (refreshError: any) {
        if (refreshError.response?.data?.message) {
            throw new Error(refreshError.response.data.message);
        }
        throw new Error('Session expired. Please login again.');
    }
}