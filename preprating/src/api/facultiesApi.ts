import apiClient from './apiClient';
import { Faculty, Program } from '../models/types';

export const facultiesApi = {
    getAllFaculties: async () => {
        const response = await apiClient.get('/faculties/');
        return response.data as Faculty[];
    },

    getFacultyById: async (facultyId: number) => {
        const response = await apiClient.get(`/faculties/${facultyId}`);
        return response.data as Faculty;
    },

    getFacultyPrograms: async (facultyId: number) => {
        // API не предоставляет конкретный эндпоинт для этого, но можно получить все программы и отфильтровать
        const response = await apiClient.get(`/programs/?faculty_id=${facultyId}`);
        return response.data as Program[];
    }
};