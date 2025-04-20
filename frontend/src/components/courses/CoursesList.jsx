import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, BookOpen, ChevronDown, X, SortAsc, ArrowUpDown } from 'lucide-react';

const CoursesList = () => {
    const [selectedFilters, setSelectedFilters] = useState({
        departments: [],
        difficulty: [],
        usefulness: [],
        tags: []
    });
    const [activeFilterMenu, setActiveFilterMenu] = useState(null);
    const [sortOption, setSortOption] = useState('rating');

    // Демонстрационные данные курсов
    const courses = [
        {
            id: 1,
            name: "Математический анализ",
            department: "Кафедра высшей математики",
            professor: "Иванов А.П.",
            description: "Фундаментальный курс по основам математического анализа.",
            semester: 1,
            rating: { overall: 4.8, difficulty: 4.5, usefulness: 4.2 },
            reviewsCount: 125,
            tags: ["сложный", "полезный", "теоретический"]
        },
        {
            id: 2,
            name: "Базы данных",
            department: "Кафедра информационных систем",
            professor: "Петрова М.С.",
            description: "Курс по проектированию и разработке баз данных, включая SQL.",
            semester: 3,
            rating: { overall: 4.6, difficulty: 3.2, usefulness: 4.9 },
            reviewsCount: 89,
            tags: ["практический", "востребованный", "много кода"]
        },
        {
            id: 3,
            name: "Алгоритмы и структуры данных",
            department: "Кафедра программирования",
            professor: "Смирнов В.В.",
            description: "Изучение основных алгоритмов и структур данных, их анализ.",
            semester: 2,
            rating: { overall: 4.9, difficulty: 4.7, usefulness: 4.8 },
            reviewsCount: 102,
            tags: ["логика", "собеседования", "практический"]
        },
        {
            id: 4,
            name: "Линейная алгебра",
            department: "Кафедра высшей математики",
            professor: "Сидорова Е.М.",
            description: "Основы линейной алгебры, включая матрицы и линейные операторы.",
            semester: 1,
            rating: { overall: 4.2, difficulty: 4.1, usefulness: 3.9 },
            reviewsCount: 78,
            tags: ["фундаментальный", "сложный", "теоретический"]
        },
        {
            id: 5,
            name: "Веб-программирование",
            department: "Кафедра информационных систем",
            professor: "Козлов Д.А.",
            description: "Изучение современных технологий веб-разработки.",
            semester: 4,
            rating: { overall: 4.7, difficulty: 3.0, usefulness: 4.9 },
            reviewsCount: 95,
            tags: ["практический", "востребованный", "много кода", "творческий"]
        },
        {
            id: 6,
            name: "Операционные системы",
            department: "Кафедра программирования",
            professor: "Николаев И.П.",
            description: "Принципы построения и функционирования современных ОС.",
            semester: 3,
            rating: { overall: 4.5, difficulty: 4.2, usefulness: 4.6 },
            reviewsCount: 67,
            tags: ["системный", "важный", "практический"]
        }
    ];

    // Доступные фильтры
    const filterOptions = {
        departments: ["Кафедра высшей математики", "Кафедра информационных систем", "Кафедра программирования"],
        difficulty: ["Очень сложный", "Сложный", "Средний", "Легкий", "Очень легкий"],
        usefulness: ["Очень полезный", "Полезный", "Средне", "Не очень полезный", "Бесполезный"],
        tags: ["сложный", "теоретический", "практический", "востребованный", "много кода", "логика", "собеседования", "фундаментальный", "творческий", "системный", "важный"]
    };

    // Обработчик выбора фильтра
    const toggleFilter = (category, value) => {
        setSelectedFilters(prev => {
            if (prev[category].includes(value)) {
                return { ...prev, [category]: prev[category].filter(item => item !== value) };
            } else {
                return { ...prev, [category]: [...prev[category], value] };
            }
        });
    };

    // Обработчик удаления фильтра
    const removeFilter = (category, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: prev[category].filter(item => item !== value)
        }));
    };

    // Очистка всех фильтров
    const clearAllFilters = () => {
        setSelectedFilters({
            departments: [],
            difficulty: [],
            usefulness: [],
            tags: []
        });
    };

    // Отображение меню фильтров
    const toggleFilterMenu = (menuName) => {
        if (activeFilterMenu === menuName) {
            setActiveFilterMenu(null);
        } else {
            setActiveFilterMenu(menuName);
        }
    };

    // Получение метки сложности по значению рейтинга
    const getDifficultyLabel = (rating) => {
        if (rating >= 4.5) return "Очень сложный";
        if (rating >= 3.5) return "Сложный";
        if (rating >= 2.5) return "Средний";
        if (rating >= 1.5) return "Легкий";
        return "Очень легкий";
    };

    // Получение метки полезности по значению рейтинга
    const getUsefulnessLabel = (rating) => {
        if (rating >= 4.5) return "Очень полезный";
        if (rating >= 3.5) return "Полезный";
        if (rating >= 2.5) return "Средне";
        if (rating >= 1.5) return "Не очень полезный";
        return "Бесполезный";
    };

    // Определение цвета для рейтинга
    const getRatingColorClass = (rating) => {
        if (rating >= 4.5) return "bg-green-100 text-green-800";
        if (rating >= 4.0) return "bg-teal-100 text-teal-800";
        if (rating >= 3.5) return "bg-blue-100 text-blue-800";
        if (rating >= 3.0) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
                    <BookOpen className="h-6 w-6 mr-2 text-indigo-600" />
                    Курсы
                </h1>

                {/* Поисковая строка */}
                <div className="w-full md:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Поиск курсов..."
                            className="w-full md:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Панель фильтров */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    {/* Выпадающие меню фильтров */}
                    <div className="relative">
                        <button
                            onClick={() => toggleFilterMenu('departments')}
                            className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
                        >
                            Кафедра
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                        {activeFilterMenu === 'departments' && (
                            <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg p-3 z-10 w-64">
                                <div className="space-y-2">
                                    {filterOptions.departments.map((dept, index) => (
                                        <label key={index} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded text-indigo-600 focus:ring-indigo-500 mr-2"
                                                checked={selectedFilters.departments.includes(dept)}
                                                onChange={() => toggleFilter('departments', dept)}
                                            />
                                            <span className="text-sm">{dept}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => toggleFilterMenu('difficulty')}
                            className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
                        >
                            Сложность
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                        {activeFilterMenu === 'difficulty' && (
                            <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg p-3 z-10 w-64">
                                <div className="space-y-2">
                                    {filterOptions.difficulty.map((level, index) => (
                                        <label key={index} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded text-indigo-600 focus:ring-indigo-500 mr-2"
                                                checked={selectedFilters.difficulty.includes(level)}
                                                onChange={() => toggleFilter('difficulty', level)}
                                            />
                                            <span className="text-sm">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => toggleFilterMenu('usefulness')}
                            className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
                        >
                            Полезность
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                        {activeFilterMenu === 'usefulness' && (
                            <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg p-3 z-10 w-64">
                                <div className="space-y-2">
                                    {filterOptions.usefulness.map((level, index) => (
                                        <label key={index} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded text-indigo-600 focus:ring-indigo-500 mr-2"
                                                checked={selectedFilters.usefulness.includes(level)}
                                                onChange={() => toggleFilter('usefulness', level)}
                                            />
                                            <span className="text-sm">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => toggleFilterMenu('tags')}
                            className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
                        >
                            Теги
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                        {activeFilterMenu === 'tags' && (
                            <div className="absolute left-0 top-full mt-1 bg-white shadow-lg rounded-lg p-3 z-10 w-64">
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {filterOptions.tags.map((tag, index) => (
                                        <label key={index} className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded text-indigo-600 focus:ring-indigo-500 mr-2"
                                                checked={selectedFilters.tags.includes(tag)}
                                                onChange={() => toggleFilter('tags', tag)}
                                            />
                                            <span className="text-sm">{tag}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Сортировка */}
                    <div className="relative ml-auto">
                        <button
                            onClick={() => toggleFilterMenu('sort')}
                            className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700"
                        >
                            <SortAsc className="h-4 w-4 mr-1" />
                            Сортировка
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                        {activeFilterMenu === 'sort' && (
                            <div className="absolute right-0 top-full mt-1 bg-white shadow-lg rounded-lg p-3 z-10 w-48">
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            className="text-indigo-600 focus:ring-indigo-500 mr-2"
                                            checked={sortOption === 'rating'}
                                            onChange={() => setSortOption('rating')}
                                        />
                                        <span className="text-sm">По рейтингу</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            className="text-indigo-600 focus:ring-indigo-500 mr-2"
                                            checked={sortOption === 'name'}
                                            onChange={() => setSortOption('name')}
                                        />
                                        <span className="text-sm">По названию</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            className="text-indigo-600 focus:ring-indigo-500 mr-2"
                                            checked={sortOption === 'reviews'}
                                            onChange={() => setSortOption('reviews')}
                                        />
                                        <span className="text-sm">По числу отзывов</span>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Выбранные фильтры */}
                {Object.values(selectedFilters).some(arr => arr.length > 0) && (
                    <div className="mt-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-gray-500 mr-1">Выбранные фильтры:</span>

                            {selectedFilters.departments.map((dept, index) => (
                                <span key={`dept-${index}`} className="bg-indigo-100 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                                    {dept}
                                    <X
                                        className="h-3 w-3 ml-1 cursor-pointer"
                                        onClick={() => removeFilter('departments', dept)}
                                    />
                                </span>
                            ))}

                            {selectedFilters.difficulty.map((level, index) => (
                                <span key={`diff-${index}`} className="bg-indigo-100 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                                    {level}
                                    <X
                                        className="h-3 w-3 ml-1 cursor-pointer"
                                        onClick={() => removeFilter('difficulty', level)}
                                    />
                                </span>
                            ))}

                            {selectedFilters.usefulness.map((level, index) => (
                                <span key={`use-${index}`} className="bg-indigo-100 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                                    {level}
                                    <X
                                        className="h-3 w-3 ml-1 cursor-pointer"
                                        onClick={() => removeFilter('usefulness', level)}
                                    />
                                </span>
                            ))}

                            {selectedFilters.tags.map((tag, index) => (
                                <span key={`tag-${index}`} className="bg-indigo-100 text-indigo-700 text-xs rounded-full px-3 py-1 flex items-center">
                                    {tag}
                                    <X
                                        className="h-3 w-3 ml-1 cursor-pointer"
                                        onClick={() => removeFilter('tags', tag)}
                                    />
                                </span>
                            ))}

                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-red-600 hover:text-red-800 ml-2"
                            >
                                Очистить все
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Список курсов */}
            <div className="space-y-4">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                    {course.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {course.department} • Семестр {course.semester} • Преподаватель: {course.professor}
                                </p>
                                <p className="text-gray-700 mb-3">{course.description}</p>

                                <div className="flex flex-wrap gap-2 mb-2">
                                    {course.tags.map((tag, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col items-center mt-4 md:mt-0 md:ml-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`flex items-center ${getRatingColorClass(course.rating.overall)} px-3 py-1 rounded-full`}>
                                        <Star className="h-4 w-4 mr-1 fill-current" />
                                        <span className="font-bold">{course.rating.overall}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{course.reviewsCount} отзывов</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <div className="flex flex-col items-center">
                                        <span className="text-gray-500">Сложность</span>
                                        <div className={`mt-1 ${getRatingColorClass(course.rating.difficulty)} px-2 py-1 rounded text-xs`}>
                                            {course.rating.difficulty}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <span className="text-gray-500">Полезность</span>
                                        <div className={`mt-1 ${getRatingColorClass(course.rating.usefulness)} px-2 py-1 rounded text-xs`}>
                                            {course.rating.usefulness}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                            <Link
                                to={`/courses/${course.id}`}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                                Подробнее о курсе
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Пагинация */}
            <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-2">
                    <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                        Предыдущая
                    </button>
                    <button className="px-3 py-2 rounded-md bg-indigo-600 text-white">1</button>
                    <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">2</button>
                    <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">3</button>
                    <span className="px-3 py-2">...</span>
                    <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">10</button>
                    <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                        Следующая
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default CoursesList;