import React, { useState } from 'react';
import { Star, Book, Users, Award, GraduationCap, BarChart, BookOpen, MessageCircle } from 'lucide-react';

// Компонент звездного рейтинга
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

// Компонент карточки курса
const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
            <div className="flex justify-between items-start">
                <a href={`/courses/${course.id}`} className="hover:text-indigo-700">
                    <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                </a>
                <div className="flex items-center bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-medium text-sm">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {course.rating}
                </div>
            </div>
            <p className="text-gray-600 text-sm mt-1 mb-2">
                {course.department} • Семестр {course.semester}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
                {course.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {tag}
          </span>
                ))}
            </div>
            <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-gray-100">
                <span className="text-gray-500">{course.year}</span>
                <span className="text-gray-500">{course.reviewsCount} отзывов</span>
            </div>
        </div>
    );
};

const ProfessorProfile = () => {
    // Демонстрационные данные преподавателя
    const professor = {
        id: 1,
        name: "Петрова Мария Сергеевна",
        title: "Кандидат технических наук",
        department: "Кафедра информационных систем",
        faculty: "Факультет компьютерных наук",
        bio: "Специалист в области баз данных и информационных систем с 15-летним опытом работы. Окончила МГТУ им. Баумана, защитила кандидатскую диссертацию по теме 'Методы оптимизации запросов в распределенных базах данных'. Автор более 30 научных работ и 2 учебных пособий по базам данных. Имеет опыт работы в IT-индустрии, является консультантом нескольких технологических компаний.",
        image: "/api/placeholder/150/150",
        interests: ["Базы данных", "Машинное обучение", "Распределенные системы", "Big Data"],
        ratings: {
            overall: 4.6,
            clarity: 4.5,
            expertise: 4.9,
            approachability: 4.3,
            fairness: 4.2
        },
        reviewsCount: 127,
        coursesCount: 5,
        tags: ["понятные объяснения", "справедливые оценки", "интересные задания", "практический опыт"]
    };

    // Демонстрационные данные курсов
    const courses = [
        {
            id: 1,
            name: "Базы данных",
            department: "Кафедра информационных систем",
            semester: 3,
            year: "2024-2025",
            rating: 4.7,
            reviewsCount: 42,
            tags: ["практический", "востребованный", "много кода"]
        },
        {
            id: 2,
            name: "Проектирование информационных систем",
            department: "Кафедра информационных систем",
            semester: 5,
            year: "2024-2025",
            rating: 4.5,
            reviewsCount: 35,
            tags: ["системный анализ", "UML", "командная работа"]
        },
        {
            id: 3,
            name: "Хранилища данных",
            department: "Кафедра информационных систем",
            semester: 6,
            year: "2023-2024",
            rating: 4.8,
            reviewsCount: 28,
            tags: ["аналитика", "OLAP", "SQL"]
        },
        {
            id: 4,
            name: "Введение в машинное обучение",
            department: "Кафедра информационных систем",
            semester: 4,
            year: "2023-2024",
            rating: 4.4,
            reviewsCount: 22,
            tags: ["алгоритмы", "Python", "статистика"]
        }
    ];

    // Демонстрационные данные отзывов
    const reviews = [
        {
            id: 1,
            course: "Базы данных",
            text: "Отличный преподаватель! Объясняет очень понятно и доступно. На лекциях всегда приводит примеры из реальной практики, что помогает лучше понять материал. Домашние задания интересные и помогают закрепить знания. Всегда готова ответить на вопросы и помочь.",
            rating: 5.0,
            date: "2025-02-10",
            semester: "Весна 2024",
            helpful: 28
        },
        {
            id: 2,
            course: "Проектирование информационных систем",
            text: "Преподаватель отлично разбирается в предмете и умеет доступно объяснять сложные концепции. Единственный минус - иногда слишком строго оценивает работы, но всегда обоснованно. В целом, курс очень полезный благодаря профессионализму преподавателя.",
            rating: 4.5,
            date: "2024-12-18",
            semester: "Осень 2024",
            helpful: 15
        },
        {
            id: 3,
            course: "Хранилища данных",
            text: "Мария Сергеевна - один из лучших преподавателей на факультете. Её лекции всегда интересные и актуальные. Особенно ценно, что она делится своим опытом работы в индустрии. Курс по хранилищам данных был очень информативным и полезным для моей будущей карьеры.",
            rating: 4.8,
            date: "2024-06-20",
            semester: "Весна 2024",
            helpful: 22
        }
    ];

    const [activeTab, setActiveTab] = useState('overview');

    // Получение цвета для рейтинга
    const getRatingColorClass = (rating) => {
        if (rating >= 4.5) return "bg-green-100 text-green-800";
        if (rating >= 4.0) return "bg-teal-100 text-teal-800";
        if (rating >= 3.5) return "bg-blue-100 text-blue-800";
        if (rating >= 3.0) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    return (
        <div>
            {/* Профиль преподавателя */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row">
                    <div className="md:mr-6 mb-4 md:mb-0 flex-shrink-0 flex justify-center">
                        <img
                            src={professor.image}
                            alt={professor.name}
                            className="rounded-full h-32 w-32 object-cover border-4 border-indigo-100"
                        />
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{professor.name}</h1>
                                <p className="text-gray-600">{professor.title}</p>
                                <p className="text-gray-600">{professor.department}, {professor.faculty}</p>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col items-center">
                                <div className={`flex items-center ${getRatingColorClass(professor.ratings.overall)} px-4 py-2 rounded-full text-lg font-bold mb-1`}>
                                    <Star className="h-5 w-5 mr-1 fill-current" />
                                    {professor.ratings.overall}
                                </div>
                                <p className="text-gray-500 text-sm">{professor.reviewsCount} отзывов</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                                {professor.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-indigo-50 p-3 rounded-lg text-center">
                                <div className="text-indigo-600 font-semibold text-lg">{professor.ratings.clarity}</div>
                                <div className="text-gray-600 text-sm">Понятность</div>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-lg text-center">
                                <div className="text-indigo-600 font-semibold text-lg">{professor.ratings.expertise}</div>
                                <div className="text-gray-600 text-sm">Компетентность</div>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-lg text-center">
                                <div className="text-indigo-600 font-semibold text-lg">{professor.ratings.approachability}</div>
                                <div className="text-gray-600 text-sm">Доступность</div>
                            </div>
                            <div className="bg-indigo-50 p-3 rounded-lg text-center">
                                <div className="text-indigo-600 font-semibold text-lg">{professor.ratings.fairness}</div>
                                <div className="text-gray-600 text-sm">Объективность</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm">
                            <div className="flex items-center">
                                <Award className="h-4 w-4 text-indigo-600 mr-1" />
                                <span className="text-gray-700">{professor.title}</span>
                            </div>
                            <div className="flex items-center">
                                <GraduationCap className="h-4 w-4 text-indigo-600 mr-1" />
                                <span className="text-gray-700">{professor.coursesCount} курсов</span>
                            </div>
                            <div className="flex items-center">
                                <MessageCircle className="h-4 w-4 text-indigo-600 mr-1" />
                                <span className="text-gray-700">{professor.reviewsCount} отзывов</span>
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
                            О преподавателе
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'courses' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('courses')}
                        >
                            Курсы ({professor.coursesCount})
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'reviews' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('reviews')}
                        >
                            Отзывы ({professor.reviewsCount})
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Биография</h2>
                            <p className="text-gray-700 mb-6">{professor.bio}</p>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Научные интересы</h3>
                                <div className="flex flex-wrap gap-2">
                                    {professor.interests.map((interest, index) => (
                                        <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm">
                      {interest}
                    </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Статистика</h3>
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
                                                            style={{ width: `${rating === 5 ? 50 : rating === 4 ? 30 : rating === 3 ? 15 : rating === 2 ? 3 : 2}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="ml-2 text-sm text-gray-500 w-8 text-right">
                            {rating === 5 ? 50 : rating === 4 ? 30 : rating === 3 ? 15 : rating === 2 ? 3 : 2}%
                          </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="flex items-center text-gray-700 mb-2">
                                                <Book className="h-5 w-5 mr-1 text-indigo-600" />
                                                Топ курсов
                                            </h4>
                                            <div className="space-y-2">
                                                {courses.slice(0, 3).map((course, index) => (
                                                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                        <a href={`/courses/${course.id}`} className="text-indigo-600 hover:text-indigo-800">
                                                            {course.name}
                                                        </a>
                                                        <div className="flex items-center">
                                                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                                            <span className="font-medium">{course.rating}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="flex items-center text-gray-700 mb-2">
                                                <BookOpen className="h-5 w-5 mr-1 text-indigo-600" />
                                                Стиль преподавания
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-500">Теоретик</span>
                                                        <span className="text-gray-500">Практик</span>
                                                    </div>
                                                    <div className="h-3 bg-gray-200 rounded-full">
                                                        <div
                                                            className="h-3 bg-indigo-600 rounded-full"
                                                            style={{ width: "75%" }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-gray-500">Строгость</span>
                                                        <span className="text-gray-500">Лояльность</span>
                                                    </div>
                                                    <div className="h-3 bg-gray-200 rounded-full">
                                                        <div
                                                            className="h-3 bg-indigo-600 rounded-full"
                                                            style={{ width: "40%" }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'courses' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Курсы преподавателя</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Отзывы о преподавателе</h2>
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-medium text-indigo-600 hover:text-indigo-800">
                                                    <a href={`/courses/${review.course}`}>{review.course}</a>
                                                </h3>
                                                <p className="text-gray-500 text-sm">{review.semester}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <StarRating rating={review.rating} size="small" />
                                                <span className="ml-1 font-medium">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-3">{review.text}</p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">{review.date}</span>
                                            <div className="flex items-center">
                                                <ThumbsUp className="h-4 w-4 text-gray-400 mr-1" />
                                                <span>{review.helpful} студентов считают это полезным</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 flex justify-center">
                                <button className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-medium">
                                    Смотреть больше отзывов
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfessorProfile;