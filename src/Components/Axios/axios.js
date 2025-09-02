import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const axiosInstance = axios.create({
    baseURL: "http://endereco:porta/"
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status == 403) {
            alert("Tempo de login expirado, refaça o seu acesso")
            secureLocalStorage.clear()
            window.location.href = "https://endereco:porta/login"
            window.location.reload()
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;