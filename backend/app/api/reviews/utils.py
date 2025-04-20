import re
from thefuzz import fuzz  # библиотека для нечеткого поиска
from typing import List

__REPLACE_DICT = {
    "а": ["а", "a", "@"],
    "б": ["б", "6", "b"],
    "в": ["в", "b", "v"],
    "г": ["г", "r", "g"],
    "д": ["д", "d"],
    "е": ["е", "e"],
    "ё": ["ё", "e"],
    "ж": ["ж", "zh", "*"],
    "з": ["з", "3", "z"],
    "и": ["и", "i"],
    "й": ["й"],
    "к": ["к", "k", "i{", "|{"],
    "л": ["л", "l", "ji"],
    "м": ["м", "m"],
    "н": ["н", "h", "n"],
    "о": ["о", "o", "0"],
    "п": ["п", "n", "p"],
    "р": ["р", "r", "p"],
    "с": ["с", "c", "s"],
    "т": ["т", "m", "t"],
    "у": ["у", "y", "u"],
    "ф": ["ф", "f"],
    "х": ["х", "x", "h", "}{"],
    "ц": ["ц", "c", "u,"],
    "ч": ["ч", "ch"],
    "ш": ["ш", "sh"],
    "щ": ["щ", "sch"],
    "ь": ["ь", "b"],
    "ы": ["ы", "bi"],
    "ъ": ["ъ"],
    "э": ["э", "e"],
    "ю": ["ю", "io"],
    "я": ["я", "ya"],
}

# Строим уникальную карту замен с учётом приоритета
_rep_map = {}
for base, variants in __REPLACE_DICT.items():
    for variant in variants:
        _rep_map[variant] = base
# Преобразуем в список и сортируем по убыванию длины вариантов
_REPLACEMENTS = sorted(_rep_map.items(), key=lambda x: -len(x[0]))

FUZZ_THRESHOLD = 80  # Совпадение слов на n%

# Список запрещенных слов (русских и английских)
BAD_WORDS = (
    # Русские негативные и матерные слова
    "плохой",
    "ужасный",
    "отвратительный",
    "бесполезный",
    "идиот",
    "дурак",
    "тупой",
    "глупый",
    "фигня",
    "дерьмо",
    "гнида",
    "мудак",
    "скотина",
    "отстой",
    "сволочь",
    "сучка",
    "сука",
    "блять",
    "ебать",
    "хуй",
    "пизда",
    "млять",
    "гандон",
    "ебло",
    "уебок",
    "говно",
    # Английские ругательства
    "bad",
    "awful",
    "terrible",
    "useless",
    "idiot",
    "stupid",
    "fool",
    "dumb",
    "crap",
    "shit",
    "bastard",
    "asshole",
    "bitch",
    "bollocks",
    "bugger",
    "fuck",
    "fucked",
    "motherfucker",
    "damn",
    "dammit",
)


def _normalize(text: str) -> str:
    """
    Переводим текст в нижний регистр и заменяем leet-символы/латиницу на
    базовые русские буквы по карте _REPLACEMENTS.
    """
    txt = text.lower()
    for variant, base in _REPLACEMENTS:
        txt = txt.replace(variant, base)
    return txt


def contains_bad_words(
    text: str, custom_bad_words: List[str] = None, fuzz_threshold: int = FUZZ_THRESHOLD
) -> bool:
    """
    Проверяет, содержит ли текст запрещенные слова.

    Args:
        text: Входная строка для проверки.
        custom_bad_words: Альтернативный список слов (если None, используется BAD_WORDS).
        fuzz_threshold: Порог для fuzzy matching (0-100).

    Returns:
        True, если найдено совпадение (жесткое или нечеткое), иначе False.
    """
    if not text:
        return False

    bad_words = custom_bad_words if custom_bad_words is not None else BAD_WORDS
    normalized = _normalize(text)
    text_lower = text.lower()

    # Токенизация для нечеткого поиска
    tokens_norm = re.findall(r"\w+", normalized)
    tokens_raw = re.findall(r"\w+", text_lower)

    for word in bad_words:
        word_lower = word.lower()
        if re.search(r"[а-яё]", word_lower):  # русский
            norm_word = _normalize(word_lower)
            if norm_word in normalized:
                return True
            for tok in tokens_norm:
                if fuzz.ratio(tok, norm_word) >= fuzz_threshold:
                    return True
        else:  # английский
            if word_lower in text_lower:
                return True
            for tok in tokens_raw:
                if fuzz.ratio(tok, word_lower) >= fuzz_threshold:
                    return True
    return False


if __name__ == "__main__":
    samples = [
        "Сюда влетают: 5ука и блять!",
        "Ты такая sUkA, ёпт!",
        "Ни одного плохого слова.",
        "This is crap and awful.",
        "Привет, как дела?",
        "Stuuupid error!",
    ]

    for s in samples:
        print(f"{s!r:40} -> {contains_bad_words(s)}")
