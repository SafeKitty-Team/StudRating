import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Calendar, Clock, Users, BookOpen, Award, CheckCircle, AlertCircle, MessageCircle, BarChart, BarChart2 } from 'lucide-react';

// Компонент звёздного рейтинга
const StarRating = ({ rating, size = "normal" }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const totalStars = 5;
    const starSizeClass = size === "small" ? "h-4 w-4" : size === "large" ? "h-6 w-6" : "h-5 w-5";

    return (
        <div className="flex">
            {[...Array(fullStars)].map((_, i) => (
                <Star key={`full-${i}`} className={`${starSizeClass} text-yellow-400 fill-current`} />
            ))}
            {hasHalfStar && (
                <div className="relative">
                    <Star className={`${starSizeClass} text-gray-300 fill-current`} />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star className={`${starSizeClass} text-yellow-400 fill-current`} />
                    </div>
                </div>
            )}
            {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                <Star key={`empty-${i}`} className={`${starSizeClass} text-gray-300`} />
            ))}
        </div>
    );
};

// Компонент отзыва
const Review = ({ review, onVote }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center mb-2">
                        <StarRating rating={review.rating.overall} />
                        <span className="ml-2 font-semibold text-lg">{review.rating.overall}</span>
                        <span className="ml-3 text-gray-500 text-sm">{new Date(review.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <h4 className="font-medium text-lg text-gray-800 mb-1">{review.title}</h4>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <span>Семестр: {review.semester}</span>
                    <span>•</span>
                    <span>Год: {review.year}</span>
                </div>
            </div>

            <div className="mt-2 mb-3">
                <div className="flex flex-wrap gap-4 text-sm mb-3">
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Сложность:</span>
                        <div className="flex items-center">
              <span className={`px-2 py-0.5 rounded ${review.rating.difficulty >= 4 ? 'bg-red-100 text-red-700' : review.rating.difficulty >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {review.rating.difficulty}
              </span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Полезность:</span>
                        <div className="flex items-center">
              <span className={`px-2 py-0.5 rounded ${review.rating.usefulness >= 4 ? 'bg-green-100 text-green-700' : review.rating.usefulness >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {review.rating.usefulness}
              </span>
                        </div>
                    </div>
                </div>

                <p className={`text-gray-700 ${!expanded && review.text.length > 300 ? 'line-clamp-3' : ''}`}>
                    {review.text}
                </p>

                {review.text.length > 300 && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center mt-1"
                    >
                        {expanded ? (
                            <>Свернуть <ChevronUp className="h-4 w-4 ml-1" /></>
                        ) : (
                            <>Читать полностью <ChevronDown className="h-4 w-4 ml-1" /></>
                        )}
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3 mb-3">
                {review.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {tag}
          </span>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => onVote(review.id, 'helpful')}
                        className={`flex items-center space-x-1 text-sm ${review.votedHelpful ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                    >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Полезно ({review.helpfulCount})</span>
                    </button>
                    <button
                        onClick={() => onVote(review.id, 'unhelpful')}
                        className={`flex items-center space-x-1 text-sm ${review.votedUnhelpful ? 'text-red-600' : 'text-gray-500 hover:text-red-600'}`}
                    >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Неполезно ({review.unhelpfulCount})</span>
                    </button>
                </div>
                <div className="text-gray-400 text-xs">
                    {review.anonymous ? 'Анонимный отзыв' : `Студент ${review.userProgram}`}
                </div>
            </div>
        </div>
    );
};

const CourseDetails = () => {
    // Демонстрационные данные о курсе
    const course = {
        id: 1,
        name: "Базы данных",
        code: "CS-303",
        department: "Кафедра информационных систем",
        professors: [
            { id: 1, name: "Петрова Мария Сергеевна", title: "Кандидат тех. наук" },
            { id: 2, name: "Козлов Дмитрий Александрович", title: "Доцент" }
        ],
        semester: 3,
        credits: 5,
        description: "Курс охватывает фундаментальные принципы проектирования, реализации и управления базами данных. Студенты изучат реляционные модели, язык SQL, нормализацию, индексирование и оптимизацию запросов. Также будут рассмотрены NoSQL базы данных и современные подходы к хранению и обработке больших объемов данных.",
        prerequisites: ["Алгоритмы и структуры данных", "Основы программирования"],
        topics: [
            "Модели данных и проектирование баз данных",
            "Реляционная алгебра и SQL",
            "Нормализация и денормализация",
            "Транзакции и управление параллелизмом",
            "Индексы и оптимизация запросов",
            "NoSQL базы данных",
            "Распределенные базы данных"
        ],
        ratings: {
            overall: 4.6,
            difficulty: 3.8,
            usefulness: 4.7
        },
        reviewsCount: 89,
        tags: ["практический", "востребованный", "много кода", "лабораторные работы", "командная работа"]
    };

    // Демонстрационные отзывы
    const reviews = [
        {
            id: 1,
            title: "Отличный практический курс",
            text: "Один из самых полезных курсов на программе. Преподаватель объясняет материал очень доступно и приводит много примеров из реальной практики. Домашние задания хоть и сложные, но очень помогают закрепить материал. Особенно понравился финальный проект, где мы разрабатывали полноценную базу данных для реального приложения. После курса чувствую себя уверенно в работе с базами данных.",
            rating: {
                overall: 5.0,
                difficulty: 4.0,
                usefulness: 5.0
            },
            date: "2025-02-15",
            semester: "Весна",
            year: 2024,
            tags: ["практический", "сложные домашние задания", "полезный проект"],
            helpfulCount: 28,
            unhelpfulCount: 2,
            votedHelpful: false,
            votedUnhelpful: false,
            anonymous: false,
            userProgram: "Бакалавриат ИВТ"
        },
        {
            id: 2,
            title: "Много полезной информации, но сложные экзамены",
            text: "Курс содержит много актуальной информации, которая действительно пригодится в работе. Лекции интересные, преподаватель отлично объясняет. Однако экзамены оказались неожиданно сложными - много теоретических вопросов, на которые не было акцента в течение семестра. Рекомендую уделять больше внимания самостоятельному изучению теоретического материала. Лабораторные работы очень познавательные и хорошо структурированы.",
            rating: {
                overall: 4.3,
                difficulty: 4.5,
                usefulness: 4.8
            },
            date: "2024-12-20",
            semester: "Осень",
            year: 2024,
            tags: ["полезный", "сложный экзамен", "хорошие лабораторные"],
            helpfulCount: 15,
            unhelpfulCount: 3,
            votedHelpful: false,
            votedUnhelpful: false,
            anonymous: true,
            userProgram: ""
        },
        {
            id: 3,
            title: "Слишком много теории",
            text: "Ожидал больше практики. Много времени уделяется теоретическим концепциям, которые редко применяются на практике. Домашние задания интересные, но их мало. Преподаватель знает материал, но иногда объяснения слишком академичные. Хотелось бы больше примеров из реальной разработки. Тем не менее, базовые концепции объяснены хорошо, и после курса вы будете понимать, как работают СУБД.",
            rating: {
                overall: 3.5,
                difficulty: 3.0,
                usefulness: 3.8
            },
            date: "2024-12-12",
            semester: "Осень",
            year: 2024,
            tags: ["много теории", "мало практики"],
            helpfulCount: 8,
            unhelpfulCount: 12,
            votedHelpful: false,
            votedUnhelpful: false,
            anonymous: true,
            userProgram: ""
        }
    ];

    const [activeTab, setActiveTab] = useState('overview');
    const [reviewsData, setReviewsData] = useState(reviews);
    const [sortOption, setSortOption] = useState('newest');

    // Обработчик голосования за отзыв
    const handleVote = (reviewId, voteType) => {
        setReviewsData(prevReviews =>
            prevReviews.map(review => {
                if (review.id === reviewId) {
                    if (voteType === 'helpful') {
                        return {
                            ...review,
                            helpfulCount: review.votedHelpful
                                ? review.helpfulCount - 1
                                : review.helpfulCount + 1,
                            votedHelpful: !review.votedHelpful,
                            votedUnhelpful: false
                        };
                    } else {
                        return {
                            ...review,
                            unhelpfulCount: review.votedUnhelpful
                                ? review.unhelpfulCount - 1
                                : review.unhelpfulCount + 1,
                            votedUnhelpful: !review.votedUnhelpful,
                            votedHelpful: false
                        };
                    }
                }
                return review;
            })
        );
    };

    // Получение цвета для рейтинга
    const getRatingColorClass = (rating, inverse = false) => {
        if (!inverse) {
            if (rating >= 4.5) return "bg-green-100 text-green-800";
            if (rating >= 4.0) return "bg-teal-100 text-teal-800";
            if (rating >= 3.5) return "bg-blue-100 text-blue-800";
            if (rating >= 3.0) return "bg-yellow-100 text-yellow-800";
            return "bg-red-100 text-red-800";
        } else {
            if (rating >= 4.5) return "bg-red-100 text-red-800";
            if (rating >= 4.0) return "bg-orange-100 text-orange-800";
            if (rating >= 3.5) return "bg-yellow-100 text-yellow-800";
            if (rating >= 3.0) return "bg-blue-100 text-blue-800";
            return "bg-green-100 text-green-800";
        }
    };

    // Получение цвета для шкалы
    const getRatingBarColorClass = (rating, inverse = false) => {
        if (!inverse) {
            if (rating >= 4.5) return "bg-green-500";
            if (rating >= 4.0) return "bg-teal-500";
            if (rating >= 3.5) return "bg-blue-500";
            if (rating >= 3.0) return "bg-yellow-500";
            return "bg-red-500";
        } else {
            if (rating >= 4.5) return "bg-red-500";
            if (rating >= 4.0) return "bg-orange-500";
            if (rating >= 3.5) return "bg-yellow-500";
            if (rating >= 3.0) return "bg-blue-500";
            return "bg-green-500";
        }
    };

    return (
        <div>
            {/* Заголовок и общая информация */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="flex-1">
                        <div className="flex items-center mb-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mr-2">
                {course.code}
              </span>
                            <span className="text-gray-500 text-sm">
                {course.department}
              </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{course.name}</h1>

                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {course.professors.map(professor => (
                                    <a key={professor.id} href={`/professors/${professor.id}`} className="flex items-center text-indigo-600 hover:text-indigo-800">
                                        <span>{professor.name}</span>
                                        <span className="text-gray-500 text-sm ml-1">({professor.title})</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm mb-4">
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                                <span>Семестр {course.semester}</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                                <span>{course.credits} кредитов</span>
                            </div>
                            <div className="flex items-center">
                                <MessageCircle className="h-4 w-4 text-gray-500 mr-1" />
                                <span>{course.reviewsCount} отзывов</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {course.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col items-center lg:items-end mt-4 lg:mt-0">
                        <div className="flex items-center">
                            <div className={`flex items-center ${getRatingColorClass(course.ratings.overall)} px-4 py-2 rounded-full text-lg font-bold`}>
                                <Star className="h-5 w-5 mr-1 fill-current" />
                                {course.ratings.overall}
                            </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4">
                            <div className="flex flex-col items-center">
                                <span className="text-gray-500 text-sm mb-1">Сложность</span>
                                <div className={`${getRatingColorClass(course.ratings.difficulty, true)} px-3 py-1 rounded font-medium text-center min-w-10`}>
                                    {course.ratings.difficulty}
                                </div>
                            </div>

                            <div className="flex flex-col items-center">
                                <span className="text-gray-500 text-sm mb-1">Полезность</span>
                                <div className={`${getRatingColorClass(course.ratings.usefulness)} px-3 py-1 rounded font-medium text-center min-w-10`}>
                                    {course.ratings.usefulness}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Табы */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="border-b border-gray-200">
                    <nav className="flex">
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Обзор курса
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'reviews' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Отзывы ({course.reviewsCount})
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' ? (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Описание курса</h2>
                            <p className="text-gray-700 mb-6">{course.description}</p>

                            {course.prerequisites.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">Предварительные требования</h3>
                                    <ul className="list-disc pl-5 text-gray-700">
                                        {course.prerequisites.map((prereq, index) => (
                                            <li key={index} className="mb-1">{prereq}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Основные темы</h3>
                                <ul className="list-disc pl-5 text-gray-700">
                                    {course.topics.map((topic, index) => (
                                        <li key={index} className="mb-1">{topic}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Статистика курса</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="flex items-center text-gray-700 mb-2">
                                            <BarChart className="h-5 w-5 mr-1 text-indigo-600" />
                                            Распределение оценок
                                        </h4>
                                        <div className="space-y-2">
                                            {[5, 4, 3, 2, 1].map(rating => (
                                                <div key={rating} className="flex items-center">
                                                    <div className="flex items-center w-8">
                                                        <span className="text-gray-700">{rating}</span>
                                                        <Star className="h-4 w-4 ml-1 text-gray-400" />
                                                    </div>
                                                    <div className="h-5 bg-gray-200 rounded-full flex-1 ml-2">
                                                        <div
                                                            className="h-5 bg-indigo-600 rounded-full"
                                                            style={{ width: `${rating === 5 ? 45 : rating === 4 ? 30 : rating === 3 ? 15 : rating === 2 ? 7 : 3}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="ml-2 text-sm text-gray-500 w-8 text-right">
                            {rating === 5 ? 45 : rating === 4 ? 30 : rating === 3 ? 15 : rating === 2 ? 7 : 3}%
                          </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="flex items-center text-gray-700 mb-2">
                                            <BarChart2 className="h-5 w-5 mr-1 text-indigo-600" />
                                            Характеристики курса
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-500">Легкий</span>
                                                    <span className="text-gray-500">Сложный</span>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded-full">
                                                    <div
                                                        className={`h-3 ${getRatingBarColorClass(course.ratings.difficulty, true)} rounded-full`}
                                                        style={{ width: `${course.ratings.difficulty * 20}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-500">Теоретический</span>
                                                    <span className="text-gray-500">Практический</span>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-3 bg-indigo-600 rounded-full"
                                                        style={{ width: "70%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-500">Мало заданий</span>
                                                    <span className="text-gray-500">Много заданий</span>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-3 bg-indigo-600 rounded-full"
                                                        style={{ width: "65%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="text-gray-500">Небольшая нагрузка</span>
                                                    <span className="text-gray-500">Высокая нагрузка</span>
                                                </div>
                                                <div className="h-3 bg-gray-200 rounded-full">
                                                    <div
                                                        className="h-3 bg-indigo-600 rounded-full"
                                                        style={{ width: "60%" }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Отзывы студентов</h2>
                                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                                    Оставить отзыв
                                </button>
                            </div>

                            <div className="mb-6 flex justify-between items-center">
                                <div className="flex">
                                    <div className="relative">
                                        <select
                                            className="appearance-none bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={sortOption}
                                            onChange={(e) => setSortOption(e.target.value)}
                                        >
                                            <option value="newest">Сначала новые</option>
                                            <option value="oldest">Сначала старые</option>
                                            <option value="highest">Сначала высокий рейтинг</option>
                                            <option value="lowest">Сначала низкий рейтинг</option>
                                            <option value="mostHelpful">Самые полезные</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                {reviewsData.map(review => (
                                    <Review
                                        key={review.id}
                                        review={review}
                                        onVote={handleVote}
                                    />
                                ))}

                                {reviewsData.length === 0 && (
                                    <div className="text-center py-12">
                                        <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">У этого курса пока нет отзывов.</p>
                                        <p className="text-gray-500">Будьте первым, кто оставит отзыв!</p>
                                    </div>
                                )}
                            </div>

                            {reviewsData.length > 0 && (
                                <div className="mt-6 flex justify-center">
                                    <button className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-medium">
                                        Смотреть больше отзывов
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;