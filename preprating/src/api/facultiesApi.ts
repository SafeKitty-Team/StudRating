import apiClient from './apiClient';
import { Faculty } from '../models/types';

export const facultiesApi = {
    getAllFaculties: async (): Promise<Faculty[]> => {
        try {
            const response = await apiClient.get<Faculty[]>('/faculties/');
            return response.data;
        } catch (error) {
            console.error('Error fetching faculties:', error);
            throw error;
        }
    },

    getFacultyById: async (facultyId: number): Promise<Faculty> => {
        try {
            const response = await apiClient.get<Faculty>(`/faculties/${facultyId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching faculty #${facultyId}:`, error);
            throw error;
        }
    },
};