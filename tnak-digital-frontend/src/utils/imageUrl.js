import Cookies from 'js-cookie';

/**
 * Appends the authorization JWT token as a query parameter to backend upload URLs.
 * This is required to load static files protected by static file authentication.
 * 
 * @param {string} url - The original image URL
 * @returns {string} The authenticated image URL
 */
export function getAuthImageUrl(url) {
    if (!url) return '';
    if (typeof url === 'string' && url.includes('/uploads/')) {
        const token = Cookies.get('accessToken');
        if (token) {
            const separator = url.includes('?') ? '&' : '?';
            if (!url.includes('token=')) {
                return `${url}${separator}token=${token}`;
            }
        }
    }
    return url;
}
