import apiClient from './apiClient';
import { Subject, Professor } from '../models/types';

// Интерфейс CourseProfessor (создан на основе документации API)
export interface CourseProfessor {
    id: number;
    subject_id: number;
    professor_id: number;
    subject?: Subject;
    professor?: Professor;
}

// Интерфейс для создания связи предмет-преподаватель
interface CreateCourseProfessorDto {
    subject_id: number;
    professor_id: number;
}

export const courseProfessorApi = {
    // Получение всех связей предмет-преподаватель
    getAllCourseProfessors: async () => {
        try {
            // Предполагаем, что такой эндпоинт существует в API
            const response = await apiClient.get('/course-professors/');
            return response.data as CourseProfessor[];
        } catch (error) {
            console.error('Ошибка при получении связей предмет-преподаватель:', error);
            throw error;
        }
    },

    // Получение связей предмет-преподаватель для конкретного преподавателя
    getCourseProfessorsByProfessorId: async (professorId: number) => {
        try {
            // Предполагаем, что такой эндпоинт существует в API
            const response = await apiClient.get(`/course-professors/professor/${professorId}`);
            return response.data as CourseProfessor[];
        } catch (error) {
            console.error(`Ошибка при получении предметов для преподавателя #${professorId}:`, error);
            throw error;
        }
    },

    // Получение связей предмет-преподаватель для конкретного предмета
    getCourseProfessorsBySubjectId: async (subjectId: number) => {
        try {
            // Предполагаем, что такой эндпоинт существует в API
            const response = await apiClient.get(`/course-professors/subject/${subjectId}`);
            return response.data as CourseProfessor[];
        } catch (error) {
            console.error(`Ошибка при получении преподавателей для предмета #${subjectId}:`, error);
            throw error;
        }
    },

    // Получение конкретной связи предмет-преподаватель по ID
    getCourseProfessorById: async (courseProfessorId: number) => {
        try {
            // Предполагаем, что такой эндпоинт существует в API
            const response = await apiClient.get(`/course-professors/${courseProfessorId}`);
            return response.data as CourseProfessor;
        } catch (error) {
            console.error(`Ошибка при получении связи предмет-преподаватель #${courseProfessorId}:`, error);
            throw error;
        }
    },

    // Создание новой связи предмет-преподаватель (для администраторов)
    createCourseProfessor: async (data: CreateCourseProfessorDto) => {
        try {
            // Предполагаем, что такой эндпоинт существует в API
            const response = await apiClient.post('/course-professors/', data);
            return response.data as CourseProfessor;
        } catch (error) {
            console.error('Ошибка при создании связи предмет-преподаватель:', error);
            throw error;
        }
    },

    // Удаление связи предмет-преподаватель (для администраторов)
    deleteCourseProfessor: async (courseProfessorId: number) => {
        try {
            // Предполагаем, что такой эндпоинт существует в API
            await apiClient.delete(`/course-professors/${courseProfessorId}`);
            return true;
        } catch (error) {
            console.error(`Ошибка при удалении связи предмет-преподаватель #${courseProfessorId}:`, error);
            throw error;
        }
    }
};