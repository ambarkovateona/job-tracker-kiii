import axios from 'axios';

const apiClient = axios.create();

export function setAuthCredentials(email: string, password: string) {
    const encoded = btoa(`${email}:${password}`);
    apiClient.defaults.headers.common['Authorization'] = `Basic ${encoded}`;
}

export function clearAuthCredentials() {
    delete apiClient.defaults.headers.common['Authorization'];
}

export default apiClient;