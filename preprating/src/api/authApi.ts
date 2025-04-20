import apiClient from './apiClient';

interface LoginCredentials {
    username: string;
    password: string;
}

interface RegisterCredentials {
    email: string;
    password: string;
}

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        // Для login API ожидает форму с form-data
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await apiClient.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    register: async (credentials: RegisterCredentials) => {
        const response = await apiClient.post('/auth/register', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    }
};