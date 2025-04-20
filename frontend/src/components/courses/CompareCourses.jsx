import React, { useState } from 'react';
import { Search, Star, X, BookOpen, Users, BarChart, CheckCircle, Clock, Award, Calendar } from 'lucide-react';

// Компонент выбора курса для сравнения
const CourseSelector = ({ onSelect, selectedCourses }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Демонстрационные данные для поиска
    const allCourses = [
        { id: 1, name: "Математический анализ", department: "Кафедра высшей математики", professors: ["Иванов А.П."] },
        { id: 2, name: "Базы данных", department: "Кафедра информационных систем", professors: ["Петрова М.С."] },
        { id: 3, name: "Алгоритмы и структуры данных", department: "Кафедра программирования", professors: ["Смирнов В.В."] },
        { id: 4, name: "Линейная алгебра", department: "Кафедра высшей математики", professors: ["Сидорова Е.М."] },
        { id: 5, name: "Веб-программирование", department: "Кафедра информационных систем", professors: ["Козлов Д.А."] },
        { id: 6, name: "Операционные системы", department: "Кафедра программирования", professors: ["Николаев И.П."] },
        { id: 7, name: "Компьютерная графика", department: "Кафедра программирования", professors: ["Морозов К.С."] },
        { id: 8, name: "Машинное обучение", department: "Кафедра информационных систем", professors: ["Алексеева А.В."] }
    ];

    // Обработчик поиска
    const handleSearch = (query) => {
        setSearchQuery(query);
        setIsSearching(true);

        // Имитация задержки API
        setTimeout(() => {
            if (query.length > 2) {
                const results = allCourses.filter(course =>
                    course.name.toLowerCase().includes(query.toLowerCase()) ||
                    course.department.toLowerCase().includes(query.toLowerCase())
                );
                setSearchResults(results);
            } else {
                setSearchResults([]);
            }
            setIsSearching(false);
        }, 300);
    };

    return (
        <div className="mb-4">
            <div className="relative">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
                    <Search className="h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Поиск курса для сравнения..."
                        className="border-none outline-none w-full ml-2"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSearchResults([]);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {isSearching && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2">
                        <div className="flex justify-center">
                            <div className="animate-pulse text-gray-500">Поиск...</div>
                        </div>
                    </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                        {searchResults.map(course => (
                            <button
                                key={course.id}
                                onClick={() => {
                                    onSelect(course);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                }}
                                disabled={selectedCourses.some(c => c.id === course.id)}
                                className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                                    selectedCourses.some(c => c.id === course.id)
                                        ? 'opacity-50 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                <div className="font-medium">{course.name}</div>
                                <div className="text-sm text-gray-500">{course.department}</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Компонент карточки курса для сравнения
const CourseCompareCard = ({ course, onRemove, isReference = false }) => {
    return (
        <div className={`rounded-lg border p-4 ${isReference ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{course.name}</h3>
                    <p className="text-gray-600 text-sm">{course.department}</p>
                </div>
                {!isReference && (
                    <button
                        onClick={() => onRemove(course.id)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <div className="flex items-center mt-2">
                <div className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {course.ratings.overall}
                </div>
                <span className="text-gray-500 text-sm ml-2">{course.reviewsCount} отзывов</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
                {course.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            {tag}
          </span>
                ))}
                {course.tags.length > 3 && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
            +{course.tags.length - 3}
          </span>
                )}
            </div>
        </div>
    );
};

// Главный компонент сравнения курсов
const CompareCourses = () => {
    // Демонстрационные данные для сравнения
    const courseDetails = [
        {
            id: 2,
            name: "Базы данных",
            code: "CS-303",
            department: "Кафедра информационных систем",
            professors: [
                { id: 1, name: "Петрова М.С.", title: "Кандидат тех. наук" }
            ],
            semester: 3,
            credits: 5,
            description: "Курс охватывает фундаментальные принципы проектирования, реализации и управления базами данных. Студенты изучат реляционные модели, язык SQL, нормализацию, индексирование и оптимизацию запросов.",
            workload: 8, // часов в неделю
            ratings: {
                overall: 4.6,
                difficulty: 3.8,
                usefulness: 4.7
            },
            reviewsCount: 89,
            tags: ["практический", "востребованный", "много кода", "лабораторные работы"]
        },
        {
            id: 3,
            name: "Алгоритмы и структуры данных",
            code: "CS-204",
            department: "Кафедра программирования",
            professors: [
                { id: 3, name: "Смирнов В.В.", title: "Кандидат тех. наук" }
            ],
            semester: 2,
            credits: 4,
            description: "Изучение основных алгоритмов и структур данных, их анализ и практическое применение. Курс включает изучение сложности алгоритмов, поиск, сортировку, графы и деревья.",
            workload: 7, // часов в неделю
            ratings: {
                overall: 4.9,
                difficulty: 4.7,
                usefulness: 4.8
            },
            reviewsCount: 102,
            tags: ["логика", "собеседования", "практический", "задачи"]
        },
        {
            id: 5,
            name: "Веб-программирование",
            code: "CS-305",
            department: "Кафедра информационных систем",
            professors: [
                { id: 4, name: "Козлов Д.А.", title: "Доцент" }
            ],
            semester: 4,
            credits: 4,
            description: "Изучение современных технологий веб-разработки, включая HTML, CSS, JavaScript, а также популярные фреймворки и библиотеки.",
            workload: 6, // часов в неделю
            ratings: {
                overall: 4.7,
                difficulty: 3.0,
                usefulness: 4.9
            },
            reviewsCount: 95,
            tags: ["практический", "востребованный", "много кода", "творческий"]
        }
    ];

    const [selectedCourses, setSelectedCourses] = useState([courseDetails[0]]);
    const [referenceCourse, setReferenceCourse] = useState(courseDetails[0]);

    // Добавление курса для сравнения
    const addCourse = (course) => {
        // Находим полную информацию о курсе
        const fullCourseInfo = courseDetails.find(c => c.id === course.id);
        if (fullCourseInfo && selectedCourses.length < 3) {
            setSelectedCourses(prev => [...prev, fullCourseInfo]);
        }
    };

    // Удаление курса из сравнения
    const removeCourse = (courseId) => {
        setSelectedCourses(prev => prev.filter(course => course.id !== courseId));
    };

    // Установка курса как эталона для сравнения
    const setAsReference = (course) => {
        setReferenceCourse(course);
    };

    // Сравнение значений параметров
    const compareValues = (value1, value2, higherIsBetter = true) => {
        if (value1 === value2) return "same";
        if (higherIsBetter) {
            return value1 > value2 ? "better" : "worse";
        } else {
            return value1 < value2 ? "better" : "worse";
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <BarChart className="h-6 w-6 mr-2 text-indigo-600" />
                Сравнение курсов
            </h2>

            {/* Выбор курса для сравнения */}
            {selectedCourses.length < 3 && (
                <div className="mb-6">
                    <CourseSelector
                        onSelect={addCourse}
                        selectedCourses={selectedCourses}
                    />
                </div>
            )}

            {/* Карточки выбранных курсов */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {selectedCourses.map((course) => (
                    <CourseCompareCard
                        key={course.id}
                        course={course}
                        onRemove={removeCourse}
                        isReference={course.id === referenceCourse.id}
                    />
                ))}

                {/* Пустые слоты */}
                {Array.from({ length: 3 - selectedCourses.length }).map((_, index) => (
                    <div
                        key={`empty-${index}`}
                        className="border border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center text-gray-500"
                    >
                        <span>Добавьте курс для сравнения</span>
                    </div>
                ))}
            </div>

            {/* Таблица сравнения */}
            {selectedCourses.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                        <tr className="bg-gray-50">
                            <th className="py-3 px-4 text-left text-gray-600 font-medium">Параметр</th>
                            {selectedCourses.map((course) => (
                                <th key={course.id} className="py-3 px-4 text-left">
                                    <div className="flex items-center">
                                        <span className="text-gray-800 font-medium">{course.name}</span>
                                        {course.id !== referenceCourse.id && (
                                            <button
                                                onClick={() => setAsReference(course)}
                                                className="ml-2 text-indigo-600 hover:text-indigo-800 text-xs"
                                            >
                                                Сделать эталоном
                                            </button>
                                        )}
                                        {course.id === referenceCourse.id && (
                                            <span className="ml-2 bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-xs">
                          Эталон
                        </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {/* Общая оценка */}
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700 font-medium flex items-center">
                                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                                Общая оценка
                            </td>
                            {selectedCourses.map((course) => (
                                <td key={`rating-${course.id}`} className="py-3 px-4">
                                    <div className="flex items-center">
                                        <div className={`px-2 py-1 rounded font-medium ${
                                            course.id === referenceCourse.id
                                                ? 'bg-indigo-100 text-indigo-800'
                                                : compareValues(course.ratings.overall, referenceCourse.ratings.overall) === 'better'
                                                    ? 'bg-green-100 text-green-800'
                                                    : compareValues(course.ratings.overall, referenceCourse.ratings.overall) === 'worse'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {course.ratings.overall}
                                        </div>
                                        <span className="text-gray-500 text-sm ml-2">({course.reviewsCount} отзывов)</span>
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Сложность */}
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700 font-medium flex items-center">
                                <BookOpen className="h-5 w-5 mr-2 text-indigo-500" />
                                Сложность
                            </td>
                            {selectedCourses.map((course) => (
                                <td key={`difficulty-${course.id}`} className="py-3 px-4">
                                    <div className={`px-2 py-1 rounded font-medium inline-block ${
                                        course.id === referenceCourse.id
                                            ? 'bg-indigo-100 text-indigo-800'
                                            : compareValues(course.ratings.difficulty, referenceCourse.ratings.difficulty, false) === 'better'
                                                ? 'bg-green-100 text-green-800'
                                                : compareValues(course.ratings.difficulty, referenceCourse.ratings.difficulty, false) === 'worse'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {course.ratings.difficulty}
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Полезность */}
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700 font-medium flex items-center">
                                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                Полезность
                            </td>
                            {selectedCourses.map((course) => (
                                <td key={`usefulness-${course.id}`} className="py-3 px-4">
                                    <div className={`px-2 py-1 rounded font-medium inline-block ${
                                        course.id === referenceCourse.id
                                            ? 'bg-indigo-100 text-indigo-800'
                                            : compareValues(course.ratings.usefulness, referenceCourse.ratings.usefulness) === 'better'
                                                ? 'bg-green-100 text-green-800'
                                                : compareValues(course.ratings.usefulness, referenceCourse.ratings.usefulness) === 'worse'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {course.ratings.usefulness}
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Кредиты */}
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700 font-medium flex items-center">
                                <Award className="h-5 w-5 mr-2 text-purple-500" />
                                Кредиты
                            </td>
                            {selectedCourses.map((course) => (
                                <td key={`credits-${course.id}`} className="py-3 px-4">
                                    {course.credits}
                                </td>
                            ))}
                        </tr>

                        {/* Семестр */}
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700 font-medium flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                                Семестр
                            </td>
                            {selectedCourses.map((course) => (
                                <td key={`semester-${course.id}`} className="py-3 px-4">
                                    {course.semester}
                                </td>
                            ))}
                        </tr>

                        {/* Нагрузка */}
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700 font-medium flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-orange-500" />
                                Нагрузка (ч/нед)
                            </td>
                            {selectedCourses.map((course) => (
                                <td key={`workload-${course.id}`} className="py-3 px-4">
                                    <div className={`px-2 py-1 rounded font-medium inline-block ${
                                        course.id === referenceCourse.id
                                            ? 'bg-indigo-100 text-indigo-800'
                                            : compareValues(course.workload, referenceCourse.workload, false) === 'better'
                                                ? 'bg-green-100 text-green-800'
                                                : compareValues(course.workload, referenceCourse.workload, false) === 'worse'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {course.workload}
                                    </div>
                                </td>
                            ))}
                        </tr>

                        {/* Преподаватели */}
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700 font-medium flex items-center">
                                <Users className="h-5 w-5 mr-2 text-teal-500" />
                                Преподаватели
                            </td>
                            {selectedCourses.map((course) => (
                                <td key={`profs-${course.id}`} className="py-3 px-4">
                                    {course.professors.map((prof, index) => (
                                        <div key={prof.id} className="mb-1 last:mb-0">
                                            <a href={`/professors/${prof.id}`} className="text-indigo-600 hover:text-indigo-800">
                                                {prof.name}
                                            </a>
                                        </div>
                                    ))}
                                </td>
                            ))}
                        </tr>

                        {/* Теги */}
                        <tr className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-700 font-medium">Теги</td>
                            {selectedCourses.map((course) => (
                                <td key={`tags-${course.id}`} className="py-3 px-4">
                                    <div className="flex flex-wrap gap-1">
                                        {course.tags.map((tag, index) => (
                                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                                        ))}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {/* Подсказка */}
            <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-indigo-800">
                <p className="flex items-start">
                    <Info className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
            Выберите курс в качестве эталона для сравнения. Зеленый цвет обозначает лучший показатель относительно эталона, красный - худший.
            <br />
            Вы можете сравнивать до 3 курсов одновременно.
          </span>
                </p>
            </div>
        </div>
    );
};

export default CompareCourses;