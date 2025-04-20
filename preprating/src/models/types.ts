// Базовые модели согласно API

export type EntityType = 'professor' | 'subject' | 'program' | 'faculty' | 'course_professor';

export interface User {
    id: number;
    email?: string; // Добавляем email как опциональное поле
    roles: 'user' | 'admin' | 'superuser';
    created_at: string;
}

export interface Review {
    id: number;
    entity_type: EntityType;
    entity_id: number;
    course_professor_id?: number;
    rating_overall: number;
    rating_difficulty: number;
    rating_usefulness: number;
    text_review: string;
    is_on_moderation: boolean;
    created_at: string;
}

export interface Faculty {
    id: number;
    name: string;
    description?: string;
}

export interface Program {
    id: number;
    name: string;
    degree_level: 'specialist' | 'bachelor' | 'master' | 'phd';
    faculty_id: number;
}

export interface Subject {
    id: number;
    name: string;
    description?: string;
    program_id: number;
}

export interface Professor {
    id: number;
    full_name: string;
    academic_title?: string;
    faculty_id: number;
    bio?: string;
}

export interface AverageRatings {
    rating_overall: number;
    rating_difficulty: number;
    rating_usefulness: number;
    average_total: number;
    reviews_count: number;
}