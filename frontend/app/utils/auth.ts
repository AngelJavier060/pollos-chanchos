export const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/auth/pollo';
        return false;
    }
    return true;
};

export const handleAuthError = (error: any) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/auth/pollo';
    }
    return Promise.reject(error);
}; 