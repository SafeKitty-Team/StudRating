import React, { useState } from 'react';
import { Star, Users, BookOpen, GraduationCap, Building, Search, BarChart2, Book, ChevronDown, ChevronUp } from 'lucide-react';

// Компонент карточки преподавателя
const ProfessorCard = ({ professor }) => {
    return (
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
            <div className="flex items-start">
                <img
                    src="/api/placeholder/60/60"
                    alt={professor.name}
                    className="rounded-full h-12 w-12 object-cover mr-4"
                />
                <div>
                    <a href={`/professors/${professor.id}`} className="font-medium text-gray-800 hover:text-indigo-600">
                        {professor.name}
                    </a>
                    <p className="text-gray-600 text-sm">{professor.title}</p>
                    <div className="flex items-center mt-1">
                        <div className="flex items-center bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                            <Star className="h-3 w-3 mr-0.5 fill-current" />
                            {professor.rating}
                        </div>
                        <span className="text-gray-500 text-xs ml-2">{professor.coursesCount} курсов</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Компонент карточки курса
const CourseCard = ({ course }) => {
    return (
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
            <div className="flex justify-between items-start">
                <div>
                    <a href={`/courses/${course.id}`} className="font-medium text-gray-800 hover:text-indigo-600">
                        {course.name}
                    </a>
                    <p className="text-gray-600 text-sm">Семестр {course.semester}</p>
                </div>
                <div className="flex items-center bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-sm font-medium">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    {course.rating}
                </div>
            </div>
            <div className="flex items-center text-sm mt-2 text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                <span>{course.professor}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
                {course.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
            {tag}
          </span>
                ))}
            </div>
        </div>
    );
};

// Компонент карточки программы
const ProgramCard = ({ program, isExpanded, onToggle }) => {
    return (
        <div className="bg-white rounded-lg shadow mb-4">
            <div
                className="p-4 flex justify-between items-center cursor-pointer"
                onClick={onToggle}
            >
                <div>
                    <h3 className="font-medium text-lg text-gray-800">{program.name}</h3>
                    <p className="text-gray-600">{program.degreeLevel}</p>
                </div>
                <button className="text-gray-500 hover:text-indigo-600">
                    {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                    ) : (
                        <ChevronDown className="h-5 w-5" />
                    )}
                </button>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="mb-3">
                        <h4 className="font-medium text-gray-700 mb-2">Описание программы</h4>
                        <p className="text-gray-600 text-sm">{program.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Ключевые курсы</h4>
                            <ul className="text-gray-600 text-sm list-disc list-inside">
                                {program.keyCourses.map((course, index) => (
                                    <li key={index}>
                                        <a href={`/courses/${course.id}`} className="text-indigo-600 hover:text-indigo-800">
                                            {course.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Статистика</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Количество курсов:</span>
                                    <span className="font-medium">{program.stats.coursesCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Средний рейтинг курсов:</span>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                        <span className="font-medium">{program.stats.avgRating}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Студентов:</span>
                                    <span className="font-medium">{program.stats.studentsCount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a
                        href={`/programs/${program.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                    >
                        Подробнее о программе
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                </div>
            )}
        </div>
    );
};

const DepartmentPage = () => {
    // Демонстрационные данные о кафедре
    const department = {
        id: 2,
        name: "Кафедра информационных систем",
        faculty: "Факультет компьютерных наук",
        description: "Кафедра информационных систем занимается подготовкой специалистов в области разработки, внедрения и сопровождения информационных систем различного назначения. Основное направление научной работы кафедры — исследование и разработка методов и средств создания высоконадежных и эффективных информационных систем, баз данных и хранилищ данных.",
        foundedYear: 1996,
        head: {
            id: 5,
            name: "Соколов Андрей Викторович",
            title: "Доктор технических наук, профессор"
        },
        contact: {
            email: "is-department@university.edu",
            phone: "+7 (123) 456-78-90",
            location: "Главный корпус, аудитория 415"
        },
        stats: {
            professorsCount: 15,
            coursesCount: 24,
            programsCount: 3,
            avgRating: 4.5
        }
    };

    // Демонстрационные данные преподавателей
    const professors = [
        {
            id: 1,
            name: "Петрова Мария Сергеевна",
            title: "Кандидат технических наук",
            rating: 4.6,
            coursesCount: 5
        },
        {
            id: 2,
            name: "Козлов Дмитрий Александрович",
            title: "Доцент",
            rating: 4.7,
            coursesCount: 3
        },
        {
            id: 3,
            name: "Алексеева Анна Владимировна",
            title: "Кандидат технических наук",
            rating: 4.8,
            coursesCount: 4
        },
        {
            id: 4,
            name: "Белов Сергей Игоревич",
            title: "Старший преподаватель",
            rating: 4.2,
            coursesCount: 2
        },
        {
            id: 5,
            name: "Соколов Андрей Викторович",
            title: "Доктор технических наук, профессор",
            rating: 4.4,
            coursesCount: 3
        },
        {
            id: 6,
            name: "Новикова Елена Павловна",
            title: "Кандидат технических наук",
            rating: 4.3,
            coursesCount: 4
        }
    ];

    // Демонстрационные данные курсов
    const courses = [
        {
            id: 1,
            name: "Базы данных",
            semester: 3,
            professor: "Петрова М.С.",
            rating: 4.7,
            tags: ["практический", "востребованный", "много кода"]
        },
        {
            id: 2,
            name: "Проектирование информационных систем",
            semester: 5,
            professor: "Козлов Д.А.",
            rating: 4.5,
            tags: ["системный анализ", "UML", "командная работа"]
        },
        {
            id: 3,
            name: "Машинное обучение",
            semester: 6,
            professor: "Алексеева А.В.",
            rating: 4.8,
            tags: ["алгоритмы", "Python", "статистика"]
        },
        {
            id: 4,
            name: "Анализ данных",
            semester: 4,
            professor: "Белов С.И.",
            rating: 4.2,
            tags: ["статистика", "визуализация", "Python"]
        },
        {
            id: 5,
            name: "Администрирование информационных систем",
            semester: 5,
            professor: "Новикова Е.П.",
            rating: 4.3,
            tags: ["сети", "безопасность", "инфраструктура"]
        },
        {
            id: 6,
            name: "Распределенные системы",
            semester: 7,
            professor: "Соколов А.В.",
            rating: 4.6,
            tags: ["микросервисы", "масштабирование", "отказоустойчивость"]
        }
    ];

    // Демонстрационные данные программ обучения
    const programs = [
        {
            id: 1,
            name: "Информационные системы и технологии",
            degreeLevel: "Бакалавриат",
            description: "Программа бакалавриата направлена на подготовку специалистов в области разработки и эксплуатации информационных систем. Студенты изучают основы программирования, базы данных, компьютерные сети, а также методы проектирования и разработки ИС.",
            keyCourses: [
                { id: 1, name: "Базы данных" },
                { id: 2, name: "Проектирование информационных систем" },
                { id: 5, name: "Администрирование информационных систем" }
            ],
            stats: {
                coursesCount: 32,
                avgRating: 4.4,
                studentsCount: 120
            }
        },
        {
            id: 2,
            name: "Большие данные и машинное обучение",
            degreeLevel: "Магистратура",
            description: "Магистерская программа фокусируется на современных методах анализа больших данных и применении алгоритмов машинного обучения. Студенты изучают статистику, программирование на Python, технологии Big Data, а также глубокое обучение.",
            keyCourses: [
                { id: 3, name: "Машинное обучение" },
                { id: 4, name: "Анализ данных" },
                { id: 7, name: "Нейронные сети и глубокое обучение" }
            ],
            stats: {
                coursesCount: 18,
                avgRating: 4.7,
                studentsCount: 45
            }
        },
        {
            id: 3,
            name: "Разработка распределенных систем",
            degreeLevel: "Магистратура",
            description: "Магистерская программа по разработке высоконагруженных и распределенных систем. Студенты изучают архитектуру ПО, микросервисы, облачные технологии, а также методы обеспечения надежности и масштабируемости систем.",
            keyCourses: [
                { id: 6, name: "Распределенные системы" },
                { id: 8, name: "Облачные технологии" },
                { id: 9, name: "Микросервисная архитектура" }
            ],
            stats: {
                coursesCount: 16,
                avgRating: 4.6,
                studentsCount: 35
            }
        }
    ];

    const [activeTab, setActiveTab] = useState('overview');
    const [expandedPrograms, setExpandedPrograms] = useState([]);

    // Обработчик переключения состояния раскрытия программы
    const toggleProgram = (programId) => {
        if (expandedPrograms.includes(programId)) {
            setExpandedPrograms(expandedPrograms.filter(id => id !== programId));
        } else {
            setExpandedPrograms([...expandedPrograms, programId]);
        }
    };

    return (
        <div>
            {/* Заголовок и общая информация */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
                    <div className="bg-indigo-100 p-4 rounded-lg mr-6 mb-4 md:mb-0">
                        <Building className="h-12 w-12 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <div className="text-gray-500">{department.faculty}</div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{department.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                            <div className="flex items-center">
                                <GraduationCap className="h-5 w-5 text-indigo-600 mr-1" />
                                <span>Основана в {department.foundedYear} году</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="h-5 w-5 text-indigo-600 mr-1 fill-current" />
                                <span>{department.stats.avgRating} средний рейтинг</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-indigo-50 p-4 rounded-lg flex flex-col items-center">
                        <div className="text-indigo-700 font-bold text-2xl">{department.stats.professorsCount}</div>
                        <div className="text-indigo-600">Преподавателей</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg flex flex-col items-center">
                        <div className="text-indigo-700 font-bold text-2xl">{department.stats.coursesCount}</div>
                        <div className="text-indigo-600">Курсов</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg flex flex-col items-center">
                        <div className="text-indigo-700 font-bold text-2xl">{department.stats.programsCount}</div>
                        <div className="text-indigo-600">Программ</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg flex flex-col items-center">
                        <div className="text-indigo-700 font-bold text-2xl flex items-center">
                            <Star className="h-5 w-5 fill-current mr-1" />
                            {department.stats.avgRating}
                        </div>
                        <div className="text-indigo-600">Средний рейтинг</div>
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
                            О кафедре
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'programs' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('programs')}
                        >
                            Программы ({department.stats.programsCount})
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'courses' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('courses')}
                        >
                            Курсы ({department.stats.coursesCount})
                        </button>
                        <button
                            className={`px-4 py-3 text-sm font-medium ${activeTab === 'professors' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('professors')}
                        >
                            Преподаватели ({department.stats.professorsCount})
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Описание</h2>
                            <p className="text-gray-700 mb-6">{department.description}</p>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Заведующий кафедрой</h3>
                                <div className="flex items-center bg-gray-50 p-4 rounded-lg">
                                    <img
                                        src="/api/placeholder/80/80"
                                        alt={department.head.name}
                                        className="rounded-full h-16 w-16 object-cover mr-4"
                                    />
                                    <div>
                                        <a href={`/professors/${department.head.id}`} className="font-medium text-lg text-indigo-600 hover:text-indigo-800">
                                            {department.head.name}
                                        </a>
                                        <p className="text-gray-600">{department.head.title}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">Контактная информация</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <div className="text-gray-500 text-sm">Email:</div>
                                            <div className="text-indigo-600">{department.contact.email}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-sm">Телефон:</div>
                                            <div>{department.contact.phone}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 text-sm">Местоположение:</div>
                                            <div>{department.contact.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Статистика кафедры</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="flex items-center text-gray-700 mb-2">
                                            <Book className="h-5 w-5 mr-1 text-indigo-600" />
                                            Топ курсов по рейтингу
                                        </h4>
                                        <div className="space-y-2">
                                            {courses
                                                .sort((a, b) => b.rating - a.rating)
                                                .slice(0, 5)
                                                .map((course, index) => (
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
                                            <Users className="h-5 w-5 mr-1 text-indigo-600" />
                                            Топ преподавателей
                                        </h4>
                                        <div className="space-y-2">
                                            {professors
                                                .sort((a, b) => b.rating - a.rating)
                                                .slice(0, 5)
                                                .map((professor, index) => (
                                                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                                                        <a href={`/professors/${professor.id}`} className="text-indigo-600 hover:text-indigo-800">
                                                            {professor.name}
                                                        </a>
                                                        <div className="flex items-center">
                                                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                                            <span className="font-medium">{professor.rating}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'programs' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Образовательные программы</h2>
                                <div className="relative w-64">
                                    <input
                                        type="text"
                                        placeholder="Поиск программ..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                        Все
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium">
                                        Бакалавриат
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium">
                                        Магистратура
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium">
                                        Аспирантура
                                    </button>
                                </div>
                            </div>

                            <div>
                                {programs.map(program => (
                                    <ProgramCard
                                        key={program.id}
                                        program={program}
                                        isExpanded={expandedPrograms.includes(program.id)}
                                        onToggle={() => toggleProgram(program.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'courses' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Курсы кафедры</h2>
                                <div className="relative w-64">
                                    <input
                                        type="text"
                                        placeholder="Поиск курсов..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                        Все семестры
                                    </button>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(semester => (
                                        <button
                                            key={semester}
                                            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium"
                                        >
                                            Семестр {semester}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>

                            <div className="mt-6 flex justify-center">
                                <a
                                    href="/courses?department=2"
                                    className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg text-sm font-medium"
                                >
                                    Показать все курсы кафедры
                                </a>
                            </div>
                        </div>
                    )}

                    {activeTab === 'professors' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Преподаватели кафедры</h2>
                                <div className="relative w-64">
                                    <input
                                        type="text"
                                        placeholder="Поиск преподавателей..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    <button className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                        Все должности
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium">
                                        Профессора
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium">
                                        Доценты
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium">
                                        Старшие преподаватели
                                    </button>
                                    <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm font-medium">
                                        Ассистенты
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {professors.map(professor => (
                                    <ProfessorCard key={professor.id} professor={professor} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DepartmentPage;