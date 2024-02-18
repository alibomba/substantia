import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosClient.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        return config;
    },
    err => Promise.reject(err)
);

axiosClient.interceptors.response.use(
    response => response,
    error => {
        const originalRequest = error.config;

        if (error?.response?.status === 401 && error?.response?.data?.message === 'jwt expired') {
            return axiosClient({
                method: 'post',
                url: '/refresh',
                data: {
                    refreshToken: localStorage.getItem('refreshToken')
                }
            })
                .then(res => {
                    const { accessToken } = res.data;
                    localStorage.setItem('accessToken', accessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return axiosClient(originalRequest);
                })
                .catch(err => Promise.reject(err));
        } else {
            return Promise.reject(error);
        }
    }
);

export default axiosClient;