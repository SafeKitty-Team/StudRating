import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import HomePage from './components/home/HomePage';
import CoursesList from './components/courses/CoursesList';
import CourseDetails from './components/courses/CourseDetails';
import ProfessorProfile from './components/professors/ProfessorProfile';
import DepartmentPage from './components/departments/DepartmentPage';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/courses" element={<CoursesList />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/professors/:id" element={<ProfessorProfile />} />
                <Route path="/departments/:id" element={<DepartmentPage />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;