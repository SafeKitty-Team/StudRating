import React, { useState } from 'react';
import { Search, TrendingUp, Star, ThumbsUp, BookOpen, ArrowRight } from 'lucide-react';

// Компонент карточки курса
const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col h-full">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                <div className="flex items-center bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-medium text-sm">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {course.rating}
                </div>
            </div>
            <p className="text-gray-600 text-sm mt-2 mb-2">{course.department}</p>
            <p className="text-gray-700 mt-2 mb-4 flex-grow">{course.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto mb-3">
                {course.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {tag}
          </span>
                ))}
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-500">Преподаватель: {course.professor}</span>
                <span className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer">
          Подробнее <ArrowRight className="h-4 w-4 ml-1" />
        </span>
            </div>
        </div>
    );
};

// Компонент карточки преподавателя
const ProfessorCard = ({ professor }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col">
            <div className="flex justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{professor.name}</h3>
                <div className="flex items-center bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-medium text-sm">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {professor.rating}
                </div>
            </div>
            <p className="text-gray-600 text-sm mt-1">{professor.title}</p>
            <p className="text-gray-600 text-sm">{professor.department}</p>
            <div className="flex flex-wrap gap-2 mt-3 mb-3">
                {professor.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {tag}
          </span>
                ))}
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-500">{professor.courseCount} курсов</span>
                <span className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 cursor-pointer">
          Подробнее <ArrowRight className="h-4 w-4 ml-1" />
        </span>
            </div>
        </div>
    );
};

const HomePage = () => {
    // Демонстрационные данные
    const topCourses = [
        {
            id: 1,
            name: "Математический анализ",
            department: "Кафедра высшей математики",
            professor: "Иванов А.П.",
            description: "Фундаментальный курс по основам математического анализа, включающий дифференциальное и интегральное исчисление.",
            rating: 4.8,
            tags: ["сложный", "полезный", "теоретический"]
        },
        {
            id: 2,
            name: "Базы данных",
            department: "Кафедра информационных систем",
            professor: "Петрова М.С.",
            description: "Курс по проектированию и разработке баз данных, включая нормализацию, SQL и NoSQL технологии.",
            rating: 4.6,
            tags: ["практический", "востребованный", "много кода"]
        },
        {
            id: 3,
            name: "Алгоритмы и структуры данных",
            department: "Кафедра программирования",
            professor: "Смирнов В.В.",
            description: "Изучение основных алгоритмов и структур данных, их анализ и практическое применение.",
            rating: 4.9,
            tags: ["логика", "собеседования", "практический"]
        }
    ];

    const topProfessors = [
        {
            id: 1,
            name: "Иванов А.П.",
            title: "Доктор физ.-мат. наук",
            department: "Кафедра высшей математики",
            rating: 4.8,
            courseCount: 3,
            tags: ["понятно объясняет", "справедливые оценки"]
        },
        {
            id: 2,
            name: "Петрова М.С.",
            title: "Кандидат тех. наук",
            department: "Кафедра информационных систем",
            rating: 4.6,
            courseCount: 4,
            tags: ["практический опыт", "актуальные задания"]
        },
        {
            id: 3,
            name: "Смирнов В.В.",
            title: "Кандидат тех. наук",
            department: "Кафедра программирования",
            rating: 4.9,
            courseCount: 5,
            tags: ["интересные лекции", "сложные домашние задания"]
        }
    ];

    return (
        <div>
            {/* Герой-секция */}
            <section className="bg-indigo-700 text-white rounded-lg shadow-lg mb-8 overflow-hidden">
                <div className="p-6 md:p-8 lg:p-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Выбирайте курсы осознанно
                    </h1>
                    <p className="text-lg md:text-xl mb-6 text-indigo-100 max-w-3xl">
                        ПрепРейтинг помогает студентам принимать обоснованные решения при выборе курсов
                        и преподавателей на основе отзывов других студентов.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <button className="bg-white text-indigo-700 font-medium py-3 px-6 rounded-lg hover:bg-indigo-100 transition-colors">
                            Найти курс
                        </button>
                        <button className="bg-indigo-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-indigo-500 transition-colors">
                            Оставить отзыв
                        </button>
                    </div>

                    {/* Статистика */}
                    <div className="flex flex-wrap gap-6 mt-4">
                        <div className="flex items-center">
                            <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">500+</p>
                                <p className="text-indigo-200 text-sm">Курсов</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                                <Star className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">10,000+</p>
                                <p className="text-indigo-200 text-sm">Отзывов</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">300+</p>
                                <p className="text-indigo-200 text-sm">Преподавателей</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Популярные курсы */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <TrendingUp className="h-6 w-6 mr-2 text-indigo-600" />
                        Топ курсов
                    </h2>
                    <a href="#" className="text-indigo-600 flex items-center hover:text-indigo-800">
                        Все курсы
                        <ArrowRight className="h-5 w-5 ml-1" />
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </section>

            {/* Популярные преподаватели */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Star className="h-6 w-6 mr-2 text-indigo-600" />
                        Лучшие преподаватели
                    </h2>
                    <a href="#" className="text-indigo-600 flex items-center hover:text-indigo-800">
                        Все преподаватели
                        <ArrowRight className="h-5 w-5 ml-1" />
                    </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topProfessors.map(professor => (
                        <ProfessorCard key={professor.id} professor={professor} />
                    ))}
                </div>
            </section>

            {/* Факультеты */}
            <section className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <Library className="h-6 w-6 mr-2 text-indigo-600" />
                        Факультеты и кафедры
                    </h2>
                    <a href="#" className="text-indigo-600 flex items-center hover:text-indigo-800">
                        Все кафедры
                        <ArrowRight className="h-5 w-5 ml-1" />
                    </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {["Компьютерные науки", "Математика и механика", "Экономика", "Физика"].map((faculty, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <h3 className="font-medium text-gray-800 mb-2">{faculty}</h3>
                            <p className="text-sm text-gray-500">5+ кафедр</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;