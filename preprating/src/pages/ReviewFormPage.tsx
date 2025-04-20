import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import '../styles/reviewForm.css';

// API для добавления отзывов
const addReview = async (reviewData: any, isAuthenticated: boolean) => {
    // Реализовать логику отправки отзыва через API
    // Для аутентифицированных пользователей использовать /reviews/
    // Для анонимных - /reviews/anonymous/
    return { success: true };
};

const ReviewFormPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [entityType, setEntityType] = useState<'professor' | 'subject'>('subject');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<any>(null);

    // Схема валидации для формы отзыва
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
        isAnonymous: Yup.boolean(),
        agreeToTerms: Yup.boolean()
            .oneOf([true], 'Необходимо согласиться с правилами')
    });

    const handleSearch = async (query: string) => {
        // Реализовать поиск по курсам/преподавателям
        // и обновление searchResults
    };

    const handleEntitySelect = (entity: any) => {
        setSelectedEntity(entity);
        setSearchResults([]);
    };

    // @ts-ignore
    return (
        <div className="review-form-page">
            <h1 className="page-title">Новый отзыв</h1>

            {!selectedEntity ? (
                <div className="entity-search-section">
                    <div className="entity-type-selector">
                        <button
                            className={`entity-type-button ${entityType === 'subject' ? 'active' : ''}`}
                            onClick={() => setEntityType('subject')}
                        >
                            Курс
                        </button>
                        <button
                            className={`entity-type-button ${entityType === 'professor' ? 'active' : ''}`}
                            onClick={() => setEntityType('professor')}
                        >
                            Преподаватель
                        </button>
                    </div>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder={`Поиск ${entityType === 'subject' ? 'курса' : 'преподавателя'}...`}
                            className="search-input"
                            onChange={(e) => handleSearch(e.target.value)}
                        />

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
                        tags: [] as string[] // Явно указываем тип как string[]
                    }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const reviewData = {
                                entity_type: entityType,
                                entity_id: selectedEntity.id,
                                rating_overall: values.rating_overall,
                                rating_difficulty: values.rating_difficulty,
                                rating_usefulness: values.rating_usefulness,
                                text_review: values.text_review
                            };

                            await addReview(reviewData, isAuthenticated);
                            navigate(`/${entityType}s/${selectedEntity.id}`);
                        } catch (error) {
                            console.error('Error submitting review:', error);
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ values, handleChange, setFieldValue, isSubmitting }) => (
                        <Form className="review-form">
                            <div className="form-header">
                                <h2>
                                    {entityType === 'subject' ? 'Курс' : 'Преподаватель'}: {selectedEntity.name}
                                </h2>
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
                                <label htmlFor="title">Заголовок отзыва</label>
                                <Field
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Кратко опишите ваше впечатление от курса"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="text_review">Ваш отзыв</label>
                                <Field
                                    as="textarea"
                                    id="text_review"
                                    name="text_review"
                                    placeholder="Поделитесь своим опытом изучения этого курса. Что было полезно? Что можно улучшить? Какие особенности преподавания вам понравились или не понравились?"
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
                                <label>Выберите теги, которые лучше всего описывают курс (до 5)</label>
                                <div className="tags-container">
                                    {[
                                        'понятные объяснения', 'сложный', 'полезный', 'интересный',
                                        'много практики', 'много теории', 'справедливые оценки',
                                        'строгий', 'лояльный', 'отзывчивый', 'актуальный материал',
                                        'устаревший материал', 'командная работа', 'качественные материалы',
                                        'много заданий', 'мало заданий'
                                    ].map(tag => (
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
                                    Анонимные отзывы не будут содержать информацию о вашей учебной программе.
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
                    <a href="/rules" target="_blank" rel="noopener noreferrer">
                      правилами публикации отзывов
                    </a>.
                  </span>
                                </label>
                                <ErrorMessage name="agreeToTerms" component="div" className="error-message" />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
                                    Отмена
                                </button>
                                <button type="submit" className="submit-button" disabled={isSubmitting}>
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