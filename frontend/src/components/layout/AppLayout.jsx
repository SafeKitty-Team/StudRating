import React, { useState } from 'react';
import { Search, BookOpen, Users, Library, Award, Star, Menu, X } from 'lucide-react';

const AppLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Верхняя панель навигации */}
            <header className="bg-indigo-700 text-white shadow-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Award className="h-8 w-8" />
                        <span className="text-2xl font-bold tracking-tight">ПрепРейтинг</span>
                    </div>

                    {/* Поисковая строка */}
                    <div className="hidden md:flex items-center bg-indigo-600 rounded-lg px-3 py-2 flex-1 max-w-md mx-6">
                        <Search className="h-5 w-5 text-indigo-300" />
                        <input
                            type="text"
                            placeholder="Поиск курсов, преподавателей..."
                            className="bg-transparent border-none outline-none text-white placeholder-indigo-300 ml-2 w-full"
                        />
                    </div>

                    {/* Навигация для десктопа */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
                            <BookOpen className="h-5 w-5" />
                            <span>Курсы</span>
                        </a>
                        <a href="#" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
                            <Users className="h-5 w-5" />
                            <span>Преподаватели</span>
                        </a>
                        <a href="#" className="flex items-center space-x-1 hover:text-indigo-200 transition-colors">
                            <Library className="h-5 w-5" />
                            <span>Кафедры</span>
                        </a>
                        <button className="bg-white text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors">
                            Войти
                        </button>
                    </nav>

                    {/* Кнопка мобильного меню */}
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Поиск для мобильных устройств */}
                <div className="md:hidden px-4 pb-4">
                    <div className="flex items-center bg-indigo-600 rounded-lg px-3 py-2">
                        <Search className="h-5 w-5 text-indigo-300" />
                        <input
                            type="text"
                            placeholder="Поиск курсов, преподавателей..."
                            className="bg-transparent border-none outline-none text-white placeholder-indigo-300 ml-2 w-full"
                        />
                    </div>
                </div>
            </header>

            {/* Мобильное меню */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-indigo-800 text-white">
                    <nav className="flex flex-col px-4 py-2">
                        <a href="#" className="flex items-center space-x-2 py-3 border-b border-indigo-700">
                            <BookOpen className="h-5 w-5" />
                            <span>Курсы</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 py-3 border-b border-indigo-700">
                            <Users className="h-5 w-5" />
                            <span>Преподаватели</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 py-3 border-b border-indigo-700">
                            <Library className="h-5 w-5" />
                            <span>Кафедры</span>
                        </a>
                        <button className="bg-white text-indigo-700 font-medium py-2 px-4 rounded-lg my-3 hover:bg-indigo-100 transition-colors">
                            Войти
                        </button>
                    </nav>
                </div>
            )}

            {/* Основное содержимое */}
            <main className="flex-grow container mx-auto px-4 py-6">
                {children}
            </main>

            {/* Футер */}
            <footer className="bg-gray-100 py-6 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Award className="h-6 w-6 text-indigo-700" />
                            <span className="text-xl font-bold text-indigo-700">ПрепРейтинг</span>
                        </div>
                        <p className="text-gray-600 text-sm text-center md:text-right">
                            © 2025 ПрепРейтинг. Анонимная система обратной связи для студентов.<br />
                            Все отзывы публикуются анонимно.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AppLayout;