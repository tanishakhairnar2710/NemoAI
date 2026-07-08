import re

WORD_BANK = {
    "a": "Agile",
    "b": "Bright",
    "c": "Curious",
    "d": "Daring",
    "e": "Eager",
    "f": "Focused",
    "g": "Gentle",
    "h": "Helpful",
    "i": "Inventive",
    "j": "Joyful",
    "k": "Kind",
    "l": "Lively",
    "m": "Mindful",
    "n": "Noble",
    "o": "Open",
    "p": "Patient",
    "q": "Quick",
    "r": "Ready",
    "s": "Smart",
    "t": "Thoughtful",
    "u": "Upbeat",
    "v": "Vivid",
    "w": "Wise",
    "x": "Xtra",
    "y": "Young",
    "z": "Zesty",
}


def terms_from_text(text: str) -> list[str]:
    parts = re.split(r"[,;\n]|(?:\s+-\s+)", text)
    terms = [part.strip(" .:-") for part in parts if part.strip(" .:-")]
    return terms[:12]


def generate_mnemonic(terms: list[str]) -> str:
    if not terms:
        return ""
    acronym = "".join(term[0].upper() for term in terms if term)
    sentence = " ".join(WORD_BANK.get(term[0].lower(), term[0].upper()) for term in terms if term)
    return f"{sentence}\n\n{acronym}: {', '.join(terms)}"
