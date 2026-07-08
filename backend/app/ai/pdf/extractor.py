from pathlib import Path

import fitz


def extract_text_from_pdf(path: Path) -> tuple[str, int]:
    with fitz.open(path) as document:
        pages = [page.get_text("text") for page in document]
        return "\n".join(pages).strip(), document.page_count


def read_plain_text(path: Path) -> tuple[str, int]:
    return path.read_text(encoding="utf-8", errors="ignore"), 1
