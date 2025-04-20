import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './components/home/HomePage';
import CoursesList from './components/courses/CoursesList';
import CourseDetails from './components/courses/CourseDetails';
import ProfessorProfile from './components/professors/ProfessorProfile';
import DepartmentPage from './components/departments/DepartmentPage';
import CompareCourses from './components/courses/CompareCourses';
import ReviewForm from './components/reviews/ReviewForm';
import Auth from './components/auth/Auth';

// Временные данные для демонстрации
const tempCourse = {
    id: 1,
    name: "Базы данных",
    code: "CS-303",
    department: "Кафедра информационных систем",
    professors: [
        { id: 1, name: "Петрова Мария Сергеевна", title: "Кандидат тех. наук" }
    ],
};

const tempProfessor = {
    id: 1,
    name: "Петрова Мария Сергеевна",
    title: "Кандидат технических наук",
};

function App() {
    return (
        <Routes>
            {/* Маршрут для авторизации */}
            <Route path="/login" element={<Auth />} />

            {/* Маршруты внутри основного макета */}
            <Route path="/" element={<AppLayout />}>
                {/* Главная страница */}
                <Route index element={<HomePage />} />

                {/* Курсы */}
                <Route path="courses" element={<CoursesList />} />
                <Route path="courses/:id" element={<CourseDetails />} />
                <Route path="compare-courses" element={<CompareCourses />} />

                {/* Преподаватели */}
                <Route path="professors/:id" element={<ProfessorProfile />} />

                {/* Кафедры */}
                <Route path="departments/:id" element={<DepartmentPage />} />

                {/* Форма добавления отзыва - для демонстрации */}
                <Route path="add-review" element={
                    <div className="container mx-auto p-4">
                        <ReviewForm
                            course={tempCourse}
                            professor={tempProfessor}
                            onSubmit={(data) => console.log('Отзыв отправлен:', data)}
                            onCancel={() => console.log('Отменено')}
                        />
                    </div>
                } />

                {/* Маршрут для отсутствующих страниц */}
                <Route path="*" element={
                    <div className="container mx-auto p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Страница не найдена</h2>
                        <p className="text-gray-600">Запрашиваемая страница не существует.</p>
                    </div>
                } />
            </Route>
        </Routes>
    );
}

export default App;