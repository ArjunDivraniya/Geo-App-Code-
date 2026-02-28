import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Replace with your local machine's IP address (e.g., 'http://192.168.1.5:5000/api')
const BASE_URL = "http://10.173.178.155:5000/api";
export const BASE_IMAGE_URL = "http://10.173.178.155:5000";

const API = axios.create({
    baseURL: BASE_URL,
});

API.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;