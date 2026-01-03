import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Update for production
});

// Add token to requests
API.interceptors.request.use((req) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
    }
    return req;
});

export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);
export const getPreferences = () => API.get('/preferences');
export const updateTopics = (topics) => API.put('/preferences/topics', { topics });
export const toggleSubscription = (isSubscribed) => API.put('/preferences/subscribe', { isSubscribed });
export const triggerManualDigest = () => API.post('/preferences/manual-digest');
export const getNews = (page = 1) => API.get(`/preferences/news?page=${page}`);

export default API;
