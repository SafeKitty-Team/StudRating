import apiClient from './apiClient';
import { Review, AverageRatings, EntityType } from '../models/types';

// Тип для создания отзыва
interface CreateReviewDto {
    entity_type: EntityType;
    entity_id: number;
    course_professor_id?: number;
    rating_overall: number;
    rating_difficulty: number;
    rating_usefulness: number;
    text_review: string;
}

export const reviewsApi = {
    // Получение всех отзывов с пагинацией
    getAllReviews: async (skip = 0, limit = 100) => {
        try {
            const response = await apiClient.get(`/reviews/?skip=${skip}&limit=${limit}`);
            return response.data as Review[];
        } catch (error) {
            console.error('Ошибка при получении отзывов:', error);
            throw error;
        }
    },

    // Получение конкретного отзыва по id
    getReviewById: async (reviewId: number) => {
        try {
            const response = await apiClient.get(`/reviews/${reviewId}`);
            return response.data as Review;
        } catch (error) {
            console.error(`Ошибка при получении отзыва #${reviewId}:`, error);
            throw error;
        }
    },

    // Создание отзыва авторизованным пользователем
    createReview: async (reviewData: CreateReviewDto) => {
        try {
            const response = await apiClient.post('/reviews/', reviewData);
            return response.data as Review;
        } catch (error) {
            console.error('Ошибка при создании отзыва:', error);
            throw error;
        }
    },

    // Создание анонимного отзыва
    createAnonymousReview: async (reviewData: CreateReviewDto) => {
        try {
            const response = await apiClient.post('/reviews/anonymous/', reviewData);
            return response.data as Review;
        } catch (error) {
            console.error('Ошибка при создании анонимного отзыва:', error);
            throw error;
        }
    },

    // Получение отзывов для преподавателя-предмета
    getCourseProfessorReviews: async (courseProfessorId: number) => {
        try {
            const response = await apiClient.get(`/reviews/course-professor/${courseProfessorId}`);
            return response.data as Review[];
        } catch (error) {
            console.error(`Ошибка при получении отзывов для связи преподаватель-курс #${courseProfessorId}:`, error);
            throw error;
        }
    },

    // Получение статистики отзывов для сущности
    getEntityRatings: async (entityType: EntityType, entityId: number, includeModerated = false) => {
        try {
            const response = await apiClient.get(
                `/reviews/stats/${entityType}/${entityId}?include_moderated=${includeModerated}`
            );
            return response.data as AverageRatings;
        } catch (error) {
            console.error(`Ошибка при получении статистики для ${entityType} #${entityId}:`, error);
            throw error;
        }
    },

    // Получение отзывов для сущности
    getEntityReviews: async (entityType: EntityType, entityId: number) => {
        try {
            const response = await apiClient.get(`/reviews/entity/${entityType}/${entityId}`);
            return response.data as Review[];
        } catch (error) {
            console.error(`Ошибка при получении отзывов для ${entityType} #${entityId}:`, error);
            throw error;
        }
    },

    // Получение отзывов на модерации (только для администраторов)
    getReviewsOnModeration: async (skip = 0, limit = 100) => {
        try {
            const response = await apiClient.get(`/reviews/admin/moderation?skip=${skip}&limit=${limit}`);
            return response.data as Review[];
        } catch (error) {
            console.error('Ошибка при получении отзывов на модерации:', error);
            throw error;
        }
    },

    // Одобрение отзыва после модерации (только для администраторов)
    approveReview: async (reviewId: number) => {
        try {
            const response = await apiClient.post(`/reviews/admin/approve/${reviewId}`);
            return response.data as Review;
        } catch (error) {
            console.error(`Ошибка при одобрении отзыва #${reviewId}:`, error);
            throw error;
        }
    },

    // Удаление отзыва (только для администраторов)
    deleteReview: async (reviewId: number) => {
        try {
            await apiClient.delete(`/reviews/${reviewId}`);
            return true;
        } catch (error) {
            console.error(`Ошибка при удалении отзыва #${reviewId}:`, error);
            throw error;
        }
    }
};