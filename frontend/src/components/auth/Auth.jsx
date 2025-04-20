import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

// Компонент входа
const LoginForm = ({ onSwitchToSignup, onForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Валидация
        if (!email.trim() || !password.trim()) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Здесь будет логика авторизации
            await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки API

            // После успешной авторизации обновить UI или перенаправить
            console.log('Успешный вход');

        } catch (error) {
            setError('Неверный email или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Вход в аккаунт</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Введите ваш email"
                            required
                        />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700 font-medium">Пароль</label>
                        <button
                            type="button"
                            onClick={onForgotPassword}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            Забыли пароль?
                        </button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Введите ваш пароль"
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Вход...
                        </>
                    ) : (
                        'Войти'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Нет аккаунта?{' '}
                    <button
                        onClick={onSwitchToSignup}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Зарегистрироваться
                    </button>
                </p>
            </div>
        </div>
    );
};

// Компонент регистрации
const SignupForm = ({ onSwitchToLogin, onSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Очистка ошибки при редактировании поля
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Имя пользователя обязательно';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Неверный формат email';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Пароль должен содержать не менее 8 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Здесь будет логика регистрации
            await new Promise(resolve => setTimeout(resolve, 1500)); // Имитация задержки API

            setSuccess(true);
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                }
            }, 2000);

        } catch (error) {
            setErrors({
                general: 'Ошибка при регистрации. Пожалуйста, попробуйте позже.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Регистрация успешна!</h2>
                <p className="text-gray-600 mb-6">
                    Ваш аккаунт был успешно создан. Теперь вы можете войти, используя ваш email и пароль.
                </p>
                <button
                    onClick={onSwitchToLogin}
                    className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Войти в аккаунт
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Создание аккаунта</h2>

            {errors.general && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {errors.general}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Имя пользователя</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Введите имя пользователя"
                        />
                    </div>
                    {errors.username && (
                        <p className="text-red-600 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Введите ваш email"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Пароль</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Создайте пароль"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                        Пароль должен содержать не менее 8 символов
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Подтвердите пароль</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Подтвердите пароль"
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Регистрация...
                        </>
                    ) : (
                        'Зарегистрироваться'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Уже есть аккаунт?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Войти
                    </button>
                </p>
            </div>
        </div>
    );
};

// Компонент восстановления пароля
const ForgotPasswordForm = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Пожалуйста, введите ваш email');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Здесь будет логика для сброса пароля
            await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки API

            setSuccess(true);

        } catch (error) {
            setError('Не удалось отправить инструкции. Пожалуйста, попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Инструкции отправлены!</h2>
                <p className="text-gray-600 mb-6">
                    Мы отправили инструкции по сбросу пароля на ваш email. Пожалуйста, проверьте свою почту.
                </p>
                <button
                    onClick={onSwitchToLogin}
                    className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Вернуться ко входу
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Восстановление пароля</h2>
            <p className="text-gray-600 text-center mb-6">
                Введите ваш email, и мы отправим вам инструкции по восстановлению пароля.
            </p>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Введите ваш email"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex justify-center items-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Отправка...
                        </>
                    ) : (
                        'Отправить инструкции'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={onSwitchToLogin}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    Вернуться ко входу
                </button>
            </div>
        </div>
    );
};

// Главный компонент авторизации
const Auth = () => {
    const [activeTab, setActiveTab] = useState('login');

    const switchToLogin = () => {
        setActiveTab('login');
    };

    const switchToSignup = () => {
        setActiveTab('signup');
    };

    const switchToForgotPassword = () => {
        setActiveTab('forgotPassword');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                {activeTab === 'login' && (
                    <LoginForm
                        onSwitchToSignup={switchToSignup}
                        onForgotPassword={switchToForgotPassword}
                    />
                )}

                {activeTab === 'signup' && (
                    <SignupForm
                        onSwitchToLogin={switchToLogin}
                        onSuccess={() => setTimeout(switchToLogin, 2000)}
                    />
                )}

                {activeTab === 'forgotPassword' && (
                    <ForgotPasswordForm
                        onSwitchToLogin={switchToLogin}
                    />
                )}
            </div>
        </div>
    );
};

export default Auth;