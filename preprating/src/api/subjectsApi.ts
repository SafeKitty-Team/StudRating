import apiClient from './apiClient';
import { Subject, AverageRatings, Review } from '../models/types';

export const subjectsApi = {
    getAllSubjects: async (skip = 0, limit = 100) => {
        const response = await apiClient.get(`/subjects/?skip=${skip}&limit=${limit}`);
        return response.data as Subject[];
    },

    getSubjectsByProgram: async (programId: number) => {
        const response = await apiClient.get(`/subjects/program/${programId}`);
        return response.data as Subject[];
    },

    getSubjectById: async (subjectId: number) => {
        const response = await apiClient.get(`/subjects/${subjectId}`);
        return response.data as Subject;
    },

    getSubjectRatings: async (subjectId: number) => {
        const response = await apiClient.get(`/reviews/stats/subject/${subjectId}`);
        return response.data as AverageRatings;
    },

    getSubjectReviews: async (subjectId: number) => {
        const response = await apiClient.get(`/reviews/entity/subject/${subjectId}`);
        return response.data as Review[];
    },

    createSubject: async (subjectData: FormData) => {
        const response = await apiClient.post('/subjects/', subjectData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    updateSubject: async (subjectId: number, subjectData: FormData) => {
        const response = await apiClient.patch(`/subjects/${subjectId}`, subjectData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteSubject: async (subjectId: number) => {
        const response = await apiClient.delete(`/subjects/${subjectId}`);
        return response.data;
    }
};