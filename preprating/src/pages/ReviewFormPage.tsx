import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { reviewsApi } from '../api/reviewsApi';
import { professorsApi } from '../api/professorsApi';
import { subjectsApi } from '../api/subjectsApi';
import { EntityType, Professor, Subject } from '../models/types';
import '../styles/reviewForm.css';

// Интерфейсы для формы отзыва
interface ReviewFormValues {
    rating_overall: number;
    rating_difficulty: number;
    rating_usefulness: number;
    text_review: string;
    isAnonymous: boolean;
    agreeToTerms: boolean;
    semester?: string;
    academicYear?: string;
    tags: string[];
}

interface SearchResultItem {
    id: number;
    name: string;
    department?: string;
    faculty?: string;
}

const ReviewFormPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    // Данные из query параметров
    const entityTypeParam = queryParams.get('entityType') as EntityType | null;
    const entityIdParam = queryParams.get('entityId');
    const courseProfessorIdParam = queryParams.get('courseProfessorId');

    const [entityType, setEntityType] = useState<'professor' | 'subject'>(entityTypeParam === 'professor' ? 'professor' : 'subject');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<SearchResultItem | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [availableTags, setAvailableTags] = useState<string[]>([
        'понятные объяснения', 'сложный', 'полезный', 'интересный',
        'много практики', 'много теории', 'справедливые оценки',
        'строгий', 'лояльный', 'отзывчивый', 'актуальный материал',
        'устаревший материал', 'командная работа', 'качественные материалы',
        'много заданий', 'мало заданий'
    ]);

    // Загрузка данных о сущности по ID, если она передана в URL
    useEffect(() => {
        const fetchEntityData = async () => {
            if (entityTypeParam && entityIdParam) {
                try {
                    const id = parseInt(entityIdParam);
                    if (entityTypeParam === 'professor') {
                        const professor = await professorsApi.getProfessorById(id);
                        setSelectedEntity({
                            id: professor.id,
                            name: professor.full_name,
                            department: professor.academic_title || 'Преподаватель'
                        });
                        setEntityType('professor');
                    } else if (entityTypeParam === 'subject') {
                        const subject = await subjectsApi.getSubjectById(id);
                        setSelectedEntity({
                            id: subject.id,
                            name: subject.name,
                            department: 'Предмет'
                        });
                        setEntityType('subject');
                    }
                } catch (error) {
                    console.error('Ошибка при загрузке данных:', error);
                    setError('Не удалось загрузить информацию о выбранной сущности');
                }
            }
        };

        fetchEntityData();
    }, [entityTypeParam, entityIdParam]);

    // Схема валидации
    const validationSchema = Yup.object({
        rating_overall: Yup.number()
            .required('Необходимо указать общую оценку')
            .min(1, 'Минимальная оценка - 1')
            .max(5, 'Максимальная оценка - 5'),
        rating_difficulty: Yup.number()
            .required('Необходимо указать сложность')
            .min(1, 'Минимальная оценка - 1')
            .max(5, 'Максимальная оценка - 5'),
        rating_usefulness: Yup.number()
            .required('Необходимо указать полезность')
            .min(1, 'Минимальная оценка - 1')
            .max(5, 'Максимальная оценка - 5'),
        text_review: Yup.string()
            .required('Пожалуйста, добавьте текст отзыва')
            .min(10, 'Отзыв должен содержать минимум 10 символов'),
        agreeToTerms: Yup.boolean()
            .oneOf([true], 'Необходимо согласиться с правилами')
    });

    // Поиск преподавателей или предметов
    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        try {
            if (entityType === 'professor') {
                // Поиск преподавателей
                const professors = await professorsApi.getAllProfessors();
                const filteredProfessors = professors
                    .filter(p => p.full_name.toLowerCase().includes(query.toLowerCase()))
                    .map(p => ({
                        id: p.id,
                        name: p.full_name,
                        department: p.academic_title || 'Преподаватель'
                    }));
                setSearchResults(filteredProfessors);
            } else {
                // Поиск предметов
                const subjects = await subjectsApi.getAllSubjects();
                const filteredSubjects = subjects
                    .filter(s => s.name.toLowerCase().includes(query.toLowerCase()))
                    .map(s => ({
                        id: s.id,
                        name: s.name,
                        department: 'Предмет'
                    }));
                setSearchResults(filteredSubjects);
            }
        } catch (error) {
            console.error('Ошибка при поиске:', error);
            setError('Произошла ошибка при выполнении поиска');
        } finally {
            setIsSearching(false);
        }
    };

    // Выбор сущности из результатов поиска
    const handleEntitySelect = (entity: SearchResultItem) => {
        setSelectedEntity(entity);
        setSearchResults([]);
        setSearchQuery('');
    };

    // Отправка формы
    const handleSubmit = async (values: ReviewFormValues) => {
        if (!selectedEntity) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const reviewData = {
                entity_type: entityType,
                entity_id: selectedEntity.id,
                course_professor_id: courseProfessorIdParam ? parseInt(courseProfessorIdParam) : undefined,
                rating_overall: values.rating_overall,
                rating_difficulty: values.rating_difficulty,
                rating_usefulness: values.rating_usefulness,
                text_review: values.text_review
            };

            if (isAuthenticated && !values.isAnonymous) {
                await reviewsApi.createReview(reviewData);
            } else {
                await reviewsApi.createAnonymousReview(reviewData);
            }

            // После успешного создания отзыва перенаправляем на страницу сущности
            navigate(`/${entityType}s/${selectedEntity.id}`);
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
            setError('Не удалось отправить отзыв. Пожалуйста, попробуйте снова.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="review-form-page">
            <h1 className="page-title">Новый отзыв</h1>

            {error && <div className="form-error-message">{error}</div>}

            {!selectedEntity ? (
                <div className="entity-search-section">
                    <div className="entity-type-selector">
                        <button
                            className={`entity-type-button ${entityType === 'subject' ? 'active' : ''}`}
                            onClick={() => setEntityType('subject')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                            Предмет
                        </button>
                        <button
                            className={`entity-type-button ${entityType === 'professor' ? 'active' : ''}`}
                            onClick={() => setEntityType('professor')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Преподаватель
                        </button>
                    </div>

                    <div className="search-container">
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                placeholder={`Поиск ${entityType === 'subject' ? 'предмета' : 'преподавателя'}...`}
                                className="search-input"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {isSearching && <div className="search-spinner"></div>}
                        </div>

                        {searchResults.length > 0 && (
                            <div className="search-results">
                                {searchResults.map(result => (
                                    <div
                                        key={result.id}
                                        className="search-result-item"
                                        onClick={() => handleEntitySelect(result)}
                                    >
                                        <div className="result-name">{result.name}</div>
                                        <div className="result-department">{result.department}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
                            <div className="no-results">
                                Ничего не найдено. Попробуйте изменить запрос.
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Formik
                    initialValues={{
                        rating_overall: 0,
                        rating_difficulty: 0,
                        rating_usefulness: 0,
                        text_review: '',
                        title: '',
                        isAnonymous: false,
                        agreeToTerms: false,
                        semester: '',
                        academicYear: '',
                        tags: [] as string[]
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, isValid }) => (
                        <Form className="review-form">
                            <div className="form-header">
                                <div className="selected-entity">
                                    <div className="entity-icon">
                                        {entityType === 'professor' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="entity-info">
                                        <h2>
                                            {selectedEntity.name}
                                        </h2>
                                        <p>{selectedEntity.department}</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="change-entity-button"
                                    onClick={() => setSelectedEntity(null)}
                                >
                                    Изменить
                                </button>
                            </div>

                            <div className="rating-section">
                                <div className="rating-field">
                                    <label>Общая оценка</label>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`star-button ${values.rating_overall >= star ? 'active' : ''}`}
                                                onClick={() => setFieldValue('rating_overall', star)}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <ErrorMessage name="rating_overall" component="div" className="error-message" />
                                </div>

                                <div className="rating-field">
                                    <label>Сложность</label>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`star-button ${values.rating_difficulty >= star ? 'active' : ''}`}
                                                onClick={() => setFieldValue('rating_difficulty', star)}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <ErrorMessage name="rating_difficulty" component="div" className="error-message" />
                                </div>

                                <div className="rating-field">
                                    <label>Полезность</label>
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`star-button ${values.rating_usefulness >= star ? 'active' : ''}`}
                                                onClick={() => setFieldValue('rating_usefulness', star)}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <ErrorMessage name="rating_usefulness" component="div" className="error-message" />
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="text_review">Ваш отзыв</label>
                                <Field
                                    as="textarea"
                                    id="text_review"
                                    name="text_review"
                                    placeholder="Поделитесь своим опытом. Что было полезно? Что можно улучшить? Какие особенности вам понравились или не понравились?"
                                    className="form-textarea"
                                    rows={6}
                                />
                                <ErrorMessage name="text_review" component="div" className="error-message" />
                            </div>

                            <div className="form-field">
                                <label htmlFor="semester">Семестр</label>
                                <Field
                                    as="select"
                                    id="semester"
                                    name="semester"
                                    className="form-select"
                                >
                                    <option value="">Выберите семестр</option>
                                    <option value="1">Семестр 1</option>
                                    <option value="2">Семестр 2</option>
                                    <option value="3">Семестр 3</option>
                                    <option value="4">Семестр 4</option>
                                    <option value="5">Семестр 5</option>
                                    <option value="6">Семестр 6</option>
                                    <option value="7">Семестр 7</option>
                                    <option value="8">Семестр 8</option>
                                </Field>
                            </div>

                            <div className="form-field">
                                <label htmlFor="academicYear">Учебный год</label>
                                <Field
                                    as="select"
                                    id="academicYear"
                                    name="academicYear"
                                    className="form-select"
                                >
                                    <option value="">Выберите учебный год</option>
                                    <option value="2024-2025">2024-2025</option>
                                    <option value="2023-2024">2023-2024</option>
                                    <option value="2022-2023">2022-2023</option>
                                </Field>
                            </div>

                            <div className="form-field tags-field">
                                <label>Выберите теги, которые лучше всего описывают {entityType === 'professor' ? 'преподавателя' : 'предмет'} (до 5)</label>
                                <div className="tags-container">
                                    {availableTags.map(tag => (
                                        <label key={tag} className="tag-label">
                                            <input
                                                type="checkbox"
                                                name="tags"
                                                value={tag}
                                                checked={values.tags.includes(tag)}
                                                onChange={() => {
                                                    const newTags = values.tags.includes(tag)
                                                        ? values.tags.filter(t => t !== tag)
                                                        : [...values.tags, tag];

                                                    if (newTags.length <= 5) {
                                                        setFieldValue('tags', newTags);
                                                    }
                                                }}
                                                className="tag-checkbox"
                                            />
                                            <span className="tag-text">{tag}</span>
                                        </label>
                                    ))}
                                </div>
                                {values.tags.length === 5 && (
                                    <p className="tags-limit-message">Достигнут лимит тегов (5 из 5)</p>
                                )}
                            </div>

                            <div className="form-field checkbox-field">
                                <label className="checkbox-label">
                                    <Field
                                        type="checkbox"
                                        name="isAnonymous"
                                        className="checkbox-input"
                                    />
                                    <span>Опубликовать отзыв анонимно</span>
                                </label>
                                <p className="field-description">
                                    Анонимные отзывы не содержат информацию о вашей учебной программе.
                                </p>
                            </div>

                            <div className="form-field checkbox-field">
                                <label className="checkbox-label">
                                    <Field
                                        type="checkbox"
                                        name="agreeToTerms"
                                        className="checkbox-input"
                                    />
                                    <span>
                    Я подтверждаю, что этот отзыв основан на моем собственном опыте и не
                    содержит оскорблений или ложной информации. Я ознакомился с
                    <a href="/rules" target="_blank" rel="noopener noreferrer"> правилами публикации отзывов</a>.
                  </span>
                                </label>
                                <ErrorMessage name="agreeToTerms" component="div" className="error-message" />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                                    Отмена
                                </button>
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isSubmitting || !isValid || values.rating_overall === 0}
                                >
                                    {isSubmitting ? 'Отправка...' : 'Опубликовать отзыв'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default ReviewFormPage;