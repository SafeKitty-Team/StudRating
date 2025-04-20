import apiClient from './apiClient';
import { Program } from '../models/types';

// Интерфейс для создания программы
interface CreateProgramDto {
    name: string;
    degree_level: 'specialist' | 'bachelor' | 'master' | 'phd';
    faculty_id: number;
}

export const programsApi = {
    // Получение всех программ
    getAllPrograms: async () => {
        try {
            const response = await apiClient.get('/programs/');
            return response.data as Program[];
        } catch (error) {
            console.error('Ошибка при получении программ:', error);
            throw error;
        }
    },

    // Получение программ по факультету
    getProgramsByFaculty: async (facultyId: number) => {
        try {
            const response = await apiClient.get(`/programs/?faculty_id=${facultyId}`);
            return response.data as Program[];
        } catch (error) {
            console.error(`Ошибка при получении программ для факультета #${facultyId}:`, error);
            throw error;
        }
    },

    // Получение конкретной программы по ID
    getProgramById: async (programId: number) => {
        try {
            const response = await apiClient.get(`/programs/${programId}`);
            return response.data as Program;
        } catch (error) {
            console.error(`Ошибка при получении программы #${programId}:`, error);
            throw error;
        }
    },

    // Создание новой программы (для администраторов)
    createProgram: async (programData: CreateProgramDto) => {
        try {
            const response = await apiClient.post('/programs/', programData);
            return response.data as Program;
        } catch (error) {
            console.error('Ошибка при создании программы:', error);
            throw error;
        }
    },

    // Обновление программы (для администраторов)
    updateProgram: async (programId: number, programData: CreateProgramDto) => {
        try {
            const response = await apiClient.put(`/programs/${programId}`, programData);
            return response.data as Program;
        } catch (error) {
            console.error(`Ошибка при обновлении программы #${programId}:`, error);
            throw error;
        }
    },

    // Удаление программы (для администраторов)
    deleteProgram: async (programId: number) => {
        try {
            await apiClient.delete(`/programs/${programId}`);
            return true;
        } catch (error) {
            console.error(`Ошибка при удалении программы #${programId}:`, error);
            throw error;
        }
    }
};