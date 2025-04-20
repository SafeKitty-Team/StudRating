import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-info">
                    <div className="footer-logo">
                        <span className="footer-logo-icon">★</span>
                        <span>ПрепРейтинг</span>
                    </div>
                    <p>© 2025 ПрепРейтинг. Анонимная система обратной связи для студентов.</p>
                    <p>Все отзывы публикуются анонимно.</p>
                </div>

                <div className="footer-links">
                    <Link to="/about" className="footer-link">О проекте</Link>
                    <Link to="/rules" className="footer-link">Правила</Link>
                    <Link to="/contact" className="footer-link">Контакты</Link>
                    <Link to="/privacy" className="footer-link">Конфиденциальность</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;