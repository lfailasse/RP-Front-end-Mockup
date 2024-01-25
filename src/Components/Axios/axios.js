import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080"
});

//Interceptor para identificar se o token utilizado é inválido
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.status = 403) {
            alert("Tempo de login expirado, refaça o seu acesso")
            secureLocalStorage.clear()
            window.location.href = "http://localhost:3000/login"
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;