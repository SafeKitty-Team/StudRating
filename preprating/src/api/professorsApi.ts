import apiClient from './apiClient';
import { Professor, AverageRatings, Review } from '../models/types';

export const professorsApi = {
    getAllProfessors: async (skip = 0, limit = 100) => {
        const response = await apiClient.get(`/professors/?skip=${skip}&limit=${limit}`);
        return response.data as Professor[];
    },

    getProfessorsByFaculty: async (facultyId: number) => {
        const response = await apiClient.get(`/professors/faculty/${facultyId}`);
        return response.data as Professor[];
    },

    getProfessorById: async (professorId: number) => {
        const response = await apiClient.get(`/professors/${professorId}`);
        return response.data as Professor;
    },

    getProfessorRatings: async (professorId: number) => {
        const response = await apiClient.get(`/reviews/stats/professor/${professorId}`);
        return response.data as AverageRatings;
    },

    getProfessorReviews: async (professorId: number) => {
        const response = await apiClient.get(`/reviews/entity/professor/${professorId}`);
        return response.data as Review[];
    }
};