import React, { useState } from 'react';
import { Star, Info, X, Check, AlertCircle } from 'lucide-react';

// Компонент выбора рейтинга
const RatingSelector = ({ value, onChange, label, description }) => {
    return (
        <div className="mb-4">
            <div className="flex items-center mb-1">
                <label className="block text-gray-700 font-medium">{label}</label>
                <div className="relative ml-2 group">
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded p-2 hidden group-hover:block shadow-lg z-10">
                        {description}
                        <div className="absolute left-0 top-full h-2 w-2 bg-gray-800 transform rotate-45 translate-x-1 -translate-y-1"></div>
                    </div>
                </div>
            </div>
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                        key={rating}
                        type="button"
                        onClick={() => onChange(rating)}
                        className={`h-10 w-10 rounded-full flex items-center justify-center mr-2 transition-colors ${
                            value >= rating
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                    >
                        <Star className={`h-6 w-6 ${value >= rating ? 'fill-current' : ''}`} />
                    </button>
                ))}
                <span className="text-gray-500 ml-2">
          {value === 1 && "Очень плохо"}
                    {value === 2 && "Плохо"}
                    {value === 3 && "Средне"}
                    {value === 4 && "Хорошо"}
                    {value === 5 && "Отлично"}
        </span>
            </div>
        </div>
    );
};

// Компонент выбора тегов
const TagSelector = ({ availableTags, selectedTags, onTagSelect }) => {
    return (
        <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
                Выберите теги, которые лучше всего описывают курс (до 5)
            </label>
            <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => onTagSelect(tag)}
                        className={`py-1 px-3 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${selectedTags.length >= 5 && !selectedTags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={selectedTags.length >= 5 && !selectedTags.includes(tag)}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

const ReviewForm = ({ course, professor, onSubmit, onCancel }) => {
    // Состояние формы
    const [formData, setFormData] = useState({
        overallRating: 0,
        difficultyRating: 0,
        usefulnessRating: 0,
        title: '',
        review: '',
        semester: '',
        year: new Date().getFullYear(),
        tags: [],
        anonymous: false,
        agreeToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Доступные теги для выбора
    const availableTags = [
        "понятные объяснения", "сложный", "полезный", "интересный",
        "много практики", "много теории", "справедливые оценки", "строгий",
        "лояльный", "отзывчивый", "актуальный материал", "устаревший материал",
        "командная работа", "качественные материалы", "много заданий", "мало заданий"
    ];

    // Семестры
    const semesters = ["Осень", "Весна", "Лето"];

    // Доступные годы (текущий и 2 предыдущих)
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];

    // Обработчики изменения полей
    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleTagSelect = (tag) => {
        setFormData(prev => {
            if (prev.tags.includes(tag)) {
                return { ...prev, tags: prev.tags.filter(t => t !== tag) };
            } else if (prev.tags.length < 5) {
                return { ...prev, tags: [...prev.tags, tag] };
            }
            return prev;
        });
    };

    // Валидация формы
    const validateForm = () => {
        const newErrors = {};

        if (!formData.overallRating) {
            newErrors.overallRating = "Пожалуйста, укажите общую оценку";
        }

        if (!formData.difficultyRating) {
            newErrors.difficultyRating = "Пожалуйста, оцените сложность курса";
        }

        if (!formData.usefulnessRating) {
            newErrors.usefulnessRating = "Пожалуйста, оцените полезность курса";
        }

        if (!formData.title.trim()) {
            newErrors.title = "Пожалуйста, добавьте заголовок к вашему отзыву";
        }

        if (formData.review.trim().length < 30) {
            newErrors.review = "Отзыв должен содержать не менее 30 символов";
        }

        if (!formData.semester) {
            newErrors.semester = "Пожалуйста, выберите семестр";
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "Вы должны согласиться с правилами публикации отзывов";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Здесь будет логика отправки отзыва на сервер
            await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки API

            onSubmit(formData);
        } catch (error) {
            console.error("Error submitting review:", error);
            setErrors(prev => ({ ...prev, general: "Не удалось отправить отзыв. Пожалуйста, попробуйте позже." }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Новый отзыв</h2>
                    <p className="text-gray-600">
                        {course.name} – {professor.name}
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {errors.general && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <RatingSelector
                        label="Общая оценка"
                        value={formData.overallRating}
                        onChange={(value) => handleChange('overallRating', value)}
                        description="Ваша общая оценка курса и преподавателя. Насколько вы остались довольны?"
                    />
                    {errors.overallRating && (
                        <p className="text-red-600 text-sm mt-1">{errors.overallRating}</p>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-1">
                        <RatingSelector
                            label="Сложность"
                            value={formData.difficultyRating}
                            onChange={(value) => handleChange('difficultyRating', value)}
                            description="Насколько курс был сложным? 1 - очень легкий, 5 - очень сложный."
                        />
                        {errors.difficultyRating && (
                            <p className="text-red-600 text-sm mt-1">{errors.difficultyRating}</p>
                        )}
                    </div>

                    <div className="flex-1">
                        <RatingSelector
                            label="Полезность"
                            value={formData.usefulnessRating}
                            onChange={(value) => handleChange('usefulnessRating', value)}
                            description="Насколько курс был полезным? 1 - бесполезный, 5 - очень полезный для будущей карьеры/учебы."
                        />
                        {errors.usefulnessRating && (
                            <p className="text-red-600 text-sm mt-1">{errors.usefulnessRating}</p>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Заголовок отзыва
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Кратко опишите ваше впечатление от курса"
                    />
                    {errors.title && (
                        <p className="text-red-600 text-sm mt-1">{errors.title}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Ваш отзыв
                    </label>
                    <textarea
                        value={formData.review}
                        onChange={(e) => handleChange('review', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Поделитесь своим опытом изучения этого курса. Что было полезно? Что можно улучшить? Какие особенности преподавания вам понравились или не понравились?"
                        rows={6}
                    />
                    {errors.review && (
                        <p className="text-red-600 text-sm mt-1">{errors.review}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                        Минимум 30 символов. Сейчас: {formData.review.length}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-2">
                            Семестр
                        </label>
                        <select
                            value={formData.semester}
                            onChange={(e) => handleChange('semester', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Выберите семестр</option>
                            {semesters.map(sem => (
                                <option key={sem} value={sem}>{sem}</option>
                            ))}
                        </select>
                        {errors.semester && (
                            <p className="text-red-600 text-sm mt-1">{errors.semester}</p>
                        )}
                    </div>

                    <div className="flex-1">
                        <label className="block text-gray-700 font-medium mb-2">
                            Учебный год
                        </label>
                        <select
                            value={formData.year}
                            onChange={(e) => handleChange('year', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            {years.map(year => (
                                <option key={year} value={year}>{year}-{year+1}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <TagSelector
                    availableTags={availableTags}
                    selectedTags={formData.tags}
                    onTagSelect={handleTagSelect}
                />

                <div className="mb-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.anonymous}
                            onChange={(e) => handleChange('anonymous', e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="ml-2 text-gray-700">Опубликовать отзыв анонимно</span>
                    </label>
                    <p className="text-gray-500 text-sm mt-1">
                        Анонимные отзывы не будут содержать информацию о вашей учебной программе.
                    </p>
                </div>

                <div className="mb-6">
                    <label className="flex items-start">
                        <input
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={(e) => handleChange('agreeToTerms', e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 mt-1"
                        />
                        <span className="ml-2 text-gray-700">
              Я подтверждаю, что этот отзыв основан на моем собственном опыте и не содержит оскорблений или ложной информации. Я ознакомился с <a href="#" className="text-indigo-600 hover:text-indigo-800">правилами публикации отзывов</a>.
            </span>
                    </label>
                    {errors.agreeToTerms && (
                        <p className="text-red-600 text-sm mt-1">{errors.agreeToTerms}</p>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                    >
                        Отмена
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Отправка...
                            </>
                        ) : (
                            <>
                                <Check className="h-5 w-5 mr-1" />
                                Опубликовать отзыв
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;