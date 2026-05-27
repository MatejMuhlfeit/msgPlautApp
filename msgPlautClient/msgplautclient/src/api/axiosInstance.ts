// axiosConfig.ts
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://localhost:7016/api'
});

// const api = axios.create({
//     baseURL: "http://100.67.99.51:5000"
// });
//Zakomentovaný kód pro rychlé přepnutí pro vzdálený přístup. Používá se ve chvíli, kdy backend běží na jiném stroji v jiné síti než Frontend. Pro tento účel byl využit Tailscale.

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log("Interceptor zachytil chybu:", error.response); // Tady uvidíš, co přišlo
        
        if (error.response && error.response.status === 401) {
            console.log("Detekována 401, přesměrovávám...");
            sessionStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;