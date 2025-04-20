import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubjectsPage from './pages/SubjectsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import ProfessorsPage from './pages/ProfessorsPage';
import ProfessorDetailPage from './pages/ProfessorDetailPage';
import FacultiesPage from './pages/FacultiesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReviewFormPage from './pages/ReviewFormPage';
import AdminPanel from './pages/AdminPanel';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { AuthProvider } from './contexts/AuthContext';
import './styles/global.css';

// Временный компонент для PrivateRoute
const PrivateRoute: React.FC<{children: React.ReactNode, roles?: string[]}> = ({children}) => {
    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="app">
                    <Header />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/subjects" element={<SubjectsPage />} />
                            <Route path="/subjects/:id" element={<SubjectDetailPage />} />
                            <Route path="/professors" element={<ProfessorsPage />} />
                            <Route path="/professors/:id" element={<ProfessorDetailPage />} />
                            <Route path="/faculties" element={<FacultiesPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/review/new" element={<ReviewFormPage />} />

                            {/* Защищенные маршруты */}
                            <Route
                                path="/admin/*"
                                element={
                                    <PrivateRoute roles={['admin', 'superuser']}>
                                        <AdminPanel />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;