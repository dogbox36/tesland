import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ANDROID EMULATOR: 10.0.2.2
// PHYSICAL DEVICE (SAME WIFI): 192.168.1.203 (Internal IP)
// PHYSICAL DEVICE (REMOTE): PUBLIC IP (Router Port Forwarding)

// ⚠️ CSERÉLD LE EZT A CÍMET A PUBLIKUS IP CÍMEDRE! 👇
// Pl: 'http://89.123.45.67:4002'
const API_URL = 'http://192.168.1.203:4002';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const setAuthToken = async (token: string) => {
    await SecureStore.setItemAsync('token', token);
};

export const getAuthToken = async () => {
    return await SecureStore.getItemAsync('token');
};

export const removeAuthToken = async () => {
    await SecureStore.deleteItemAsync('token');
};
