from typing import List

# Список слов, которые считаются неприемлемыми
# В реальном приложении этот список можно хранить в базе данных или конфигурационном файле
BAD_WORDS = [
    "плохой", "ужасный", "отвратительный", "бесполезный", "идиот",
    "дурак", "тупой", "глупый", "фигня", "дерьмо",
    # Английские слова
    "bad", "awful", "terrible", "useless", "idiot",
    "stupid", "fool", "dumb", "crap", "shit"
]


def contains_bad_words(text: str, custom_bad_words: List[str] = None) -> bool:
    """
    Проверяет, содержит ли текст запрещенные слова

    Args:
        text: Текст для проверки
        custom_bad_words: Пользовательский список запрещенных слов (если None, используется стандартный)

    Returns:
        True если текст содержит запрещенные слова, иначе False
    """
    if not text:
        return False

    bad_words_list = custom_bad_words if custom_bad_words is not None else BAD_WORDS
    text_lower = text.lower()

    # Проверяем каждое слово из списка плохих слов
    for word in bad_words_list:
        if word.lower() in text_lower:
            return True

    return False