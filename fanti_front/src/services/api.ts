
import axios from 'axios';
import https from 'https';

const isDev = process.env.NODE_ENV === 'development';

const api = axios.create({
    baseURL: process.env.BACKEND_URL || 'https://back-fanti.internal.blackmoss-1b35adda.brazilsouth.azurecontainerapps.io/api/',
    headers: {
        'Content-Type': 'application/json',
    },
    httpsAgent: isDev
        ? new https.Agent({ rejectUnauthorized: false })
        : undefined,
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export default api;
