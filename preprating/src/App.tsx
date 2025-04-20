import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Импорт провайдеров контекста
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Импорт общих компонентов
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import LoadingScreen from './components/common/LoadingScreen';

// Импорт статичных страниц
import HomePage from './pages/HomePage';

// Ленивая загрузка компонентов для оптимизации начальной загрузки
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SubjectsPage = lazy(() => import('./pages/SubjectsPage'));
const SubjectDetailPage = lazy(() => import('./pages/SubjectDetailPage'));
const ProfessorsPage = lazy(() => import('./pages/ProfessorsPage'));
const ProfessorDetailPage = lazy(() => import('./pages/ProfessorDetailPage'));
const FacultiesPage = lazy(() => import('./pages/FacultiesPage'));
const ReviewFormPage = lazy(() => import('./pages/ReviewFormPage'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage'));

// Основной компонент приложения
function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <div className="app">
                        <Header />
                        <main className="main-content">
                            <Suspense fallback={<LoadingScreen />}>
                                <Routes>
                                    {/* Публичные маршруты */}
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/subjects" element={<SubjectsPage />} />
                                    <Route path="/subjects/:id" element={<SubjectDetailPage />} />
                                    <Route path="/professors" element={<ProfessorsPage />} />
                                    <Route path="/professors/:id" element={<ProfessorDetailPage />} />
                                    <Route path="/faculties" element={<FacultiesPage />} />
                                    <Route path="/search" element={<SearchResultsPage />} />

                                    {/* Маршруты, требующие авторизации */}
                                    <Route
                                        path="/review/new"
                                        element={
                                            <PrivateRoute>
                                                <ReviewFormPage />
                                            </PrivateRoute>
                                        }
                                    />

                                    <Route
                                        path="/profile"
                                        element={
                                            <PrivateRoute>
                                                <UserProfilePage />
                                            </PrivateRoute>
                                        }
                                    />

                                    {/* Маршруты для администраторов */}
                                    <Route
                                        path="/admin/*"
                                        element={
                                            <PrivateRoute roles={['admin', 'superuser']}>
                                                <AdminPanel />
                                            </PrivateRoute>
                                        }
                                    />

                                    {/* Обработка несуществующих маршрутов */}
                                    <Route path="/404" element={<NotFoundPage />} />
                                    <Route path="*" element={<Navigate to="/404" replace />} />
                                </Routes>
                            </Suspense>
                        </main>
                        <Footer />
                    </div>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;