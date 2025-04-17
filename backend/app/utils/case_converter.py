import re


def camel_to_snake(camel_case_string):
    # Замена случаев, когда строчная буква/цифра идёт перед заглавной
    snake_case_string = re.sub(r"(.)([A-Z][a-z]+)", r"\1_\2", camel_case_string)
    # Обработка случаев, когда заглавная буква идёт перед другой заглавной и строчной
    snake_case_string = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", snake_case_string)
    return snake_case_string.lower()
